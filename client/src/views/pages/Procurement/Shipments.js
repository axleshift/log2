import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CAlert,
  CFormInput,
  CRow,
  CCol,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
} from '@coreui/react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import opencage from 'opencage-api-client'

const BASE_URL = import.meta.env.VITE_API_URL
const SHIPMENT_API_URL = `${BASE_URL}/api/v1/shipment`
const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY

const RecenterMap = ({ center }) => {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, 13)
    }
  }, [center])
  return null
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'success'
    case 'in transit':
      return 'info'
    case 'delayed':
      return 'danger'
    case 'pending':
      return 'secondary'
    default:
      return 'warning'
  }
}

const DeliveryTrackingWithList = () => {
  const [shipments, setShipments] = useState([])
  const [filteredShipments, setFilteredShipments] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const [selectedTrackingNumber, setSelectedTrackingNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  const [coordinates, setCoordinates] = useState(null)
  const [shipmentData, setShipmentData] = useState(null)
  const [vehicleData, setVehicleData] = useState(null)
  const [error, setError] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await axios.get(SHIPMENT_API_URL)
        const fetched = res.data?.shipments || []
        setShipments(fetched)
        setFilteredShipments(fetched)
      } catch (err) {
        console.error('Failed to fetch shipments', err)
      }
    }
    fetchShipments()
  }, [])

  const handleFilterChange = (value) => {
    setFilter(value)
    if (value === 'All') {
      setFilteredShipments(shipments)
    } else {
      const filtered = shipments.filter((shipment) => shipment.delivery?.status === value)
      setFilteredShipments(filtered)
    }
  }

  const handleSearch = (value) => {
    setSearch(value)
    const lowercased = value.toLowerCase()
    const filtered = shipments.filter((shipment) =>
      shipment.tracking_id?.toString().toLowerCase().includes(lowercased),
    )
    setFilteredShipments(filtered)
  }

  const handleTrack = async (trackingNum) => {
    if (!trackingNum.trim()) {
      setError('Please enter a tracking number')
      return
    }

    setIsLoading(true)
    setError(null)
    setDeliveryStatus(null)
    setCoordinates(null)
    setShipmentData(null)
    setVehicleData(null)

    try {
      const res = await axios.get(SHIPMENT_API_URL)
      const allShipments = res.data.shipments || []
      const shipment = allShipments.find((s) => s.tracking_id?.toString() === trackingNum)

      if (!shipment) {
        setError('Tracking number not found.')
        setIsLoading(false)
        return
      }

      setShipmentData(shipment)
      if (shipment.vehicle) setVehicleData(shipment.vehicle)

      // Get current address to geocode
      const currentAddress =
        shipment.shipping?.shipping_details?.land?.destination_address ||
        shipment.consignee?.consignee_company_address ||
        'Philippines'

      const geoRes = await opencage.geocode({ q: currentAddress, key: OPENCAGE_API_KEY })

      if (!geoRes || !geoRes.results || geoRes.results.length === 0) {
        throw new Error('Geolocation not found for address.')
      }

      const location = geoRes.results[0].geometry
      setCoordinates(location)

      setDeliveryStatus({
        status: shipment.delivery?.status || 'N/A',
        estimatedArrival: shipment.shipping?.shipping_details?.sea?.estimated_arrival_date
          ? new Date(
              shipment.shipping.shipping_details.sea.estimated_arrival_date,
            ).toLocaleDateString()
          : 'Not provided',
        currentLocation: currentAddress,
      })
    } catch (err) {
      console.error(err)
      setError('Error fetching shipment or location data.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (autoRefresh && selectedTrackingNumber) {
      intervalRef.current = setInterval(() => {
        handleTrack(selectedTrackingNumber)
      }, 30000) // 30 seconds
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [autoRefresh, selectedTrackingNumber])

  const onViewShipment = (shipment) => {
    setSelectedTrackingNumber(shipment.tracking_id)
    handleTrack(shipment.tracking_id)
  }

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="bg-primary text-white">
        <h5 className="mb-0">🚚 Shipments & Delivery Tracking</h5>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-3 gap-3">
          <CCol md={4}>
            <CFormInput
              placeholder="Search by Tracking ID"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </CCol>
          <CCol md={3}>
            <CFormSelect value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Tracking ID</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Consignee</CTableHeaderCell>
              <CTableHeaderCell>Driver</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredShipments.map((shipment) => (
              <CTableRow key={shipment._id}>
                <CTableDataCell>{shipment.tracking_id}</CTableDataCell>
                <CTableDataCell>{shipment.delivery?.status || 'N/A'}</CTableDataCell>
                <CTableDataCell>
                  {shipment.consignee?.consignee_company_name || 'N/A'}
                </CTableDataCell>
                <CTableDataCell>{shipment.vehicle?.driver_name || 'N/A'}</CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" color="primary" onClick={() => onViewShipment(shipment)}>
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Delivery Tracking Section */}
        <CCard className="mt-4">
          <CCardHeader>
            <h6>📦 Delivery Tracking</h6>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}

            <CRow className="mb-3">
              <CCol md={8}>
                <CFormInput
                  placeholder="Enter Tracking Number"
                  value={selectedTrackingNumber}
                  onChange={(e) => setSelectedTrackingNumber(e.target.value)}
                />
              </CCol>
              <CCol md={2}>
                <CButton
                  color="primary"
                  disabled={isLoading}
                  onClick={() => handleTrack(selectedTrackingNumber)}
                >
                  {isLoading ? <CSpinner size="sm" /> : 'Track'}
                </CButton>
              </CCol>
              <CCol md={2}>
                <CFormSelect
                  value={autoRefresh ? 'On' : 'Off'}
                  onChange={(e) => setAutoRefresh(e.target.value === 'On')}
                >
                  <option value="Off">Auto Refresh Off</option>
                  <option value="On">Auto Refresh On</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {deliveryStatus && (
              <div>
                <p>
                  <strong>Status:</strong>{' '}
                  <CBadge color={getStatusColor(deliveryStatus.status)}>
                    {deliveryStatus.status}
                  </CBadge>
                </p>
                <p>
                  <strong>Estimated Arrival:</strong> {deliveryStatus.estimatedArrival}
                </p>
                <p>
                  <strong>Current Location:</strong> {deliveryStatus.currentLocation}
                </p>
              </div>
            )}

            {coordinates && (
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={13}
                style={{ height: '300px', width: '100%' }}
              >
                <RecenterMap center={[coordinates.lat, coordinates.lng]} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[coordinates.lat, coordinates.lng]}>
                  <Popup>
                    <div>
                      <strong>Shipment Info</strong>
                      <br />
                      Tracking #: {selectedTrackingNumber}
                      <br />
                      Consignee: {shipmentData?.consignee?.consignee_company_name || 'N/A'}
                      <br />
                      Vehicle: {vehicleData?.plate_number || 'N/A'}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            )}
          </CCardBody>
        </CCard>
      </CCardBody>
    </CCard>
  )
}

RecenterMap.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
}
export default DeliveryTrackingWithList
