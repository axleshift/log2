import React, { useState } from 'react'
import axios from 'axios'
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
  CCardText,
  CCardTitle,
  CBadge,
} from '@coreui/react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import opencage from 'opencage-api-client'

const BASE_URL = import.meta.env.VITE_API_URL
const SHIPMENT_API_URL = `${BASE_URL}/api/v1/shipment`
const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY

const DeliveryTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  const [coordinates, setCoordinates] = useState(null)
  const [shipmentData, setShipmentData] = useState(null)
  const [vehicleData, setVehicleData] = useState(null)
  const [error, setError] = useState(null)

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
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
      const shipment = allShipments.find((s) => s.tracking_id?.toString() === trackingNumber)

      if (!shipment) {
        setError('Tracking number not found.')
        setIsLoading(false)
        return
      }

      setShipmentData(shipment)
      if (shipment.vehicle) setVehicleData(shipment.vehicle)

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

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="bg-primary text-white">
        <h5 className="mb-0">📦 Delivery Tracking</h5>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-4">
          <CCol md={8} className="mb-2 mb-md-0">
            <CFormInput
              id="trackingNumber"
              placeholder="Enter tracking number (e.g. 12345)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </CCol>
          <CCol md={4}>
            <CButton
              color="success"
              className="w-100"
              onClick={handleTrack}
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Tracking...
                </>
              ) : (
                <>
                  <i className="bi bi-geo-alt-fill me-2"></i> Track
                </>
              )}
            </CButton>
          </CCol>
        </CRow>

        {error && <CAlert color="danger">{error}</CAlert>}

        {deliveryStatus && (
          <CCard className="mb-4">
            <CCardBody>
              <CCardTitle className="text-success mb-3">✅ Delivery Status</CCardTitle>
              <CCardText>
                <strong>Status:</strong>{' '}
                <CBadge color="info" className="px-3 py-1 text-uppercase">
                  {deliveryStatus.status}
                </CBadge>
              </CCardText>
              <CCardText>
                <strong>Estimated Arrival:</strong> {deliveryStatus.estimatedArrival}
              </CCardText>
              <CCardText>
                <strong>Current Location:</strong> {deliveryStatus.currentLocation}
              </CCardText>

              {vehicleData && (
                <>
                  <hr />
                  <CCardText>
                    <strong>Vehicle:</strong> {vehicleData.name}
                  </CCardText>
                  <CCardText>
                    <strong>Plate No:</strong> {vehicleData.plate_no}
                  </CCardText>
                  <CCardText>
                    <strong>Driver Name:</strong> {vehicleData.driver_name}
                  </CCardText>
                </>
              )}
            </CCardBody>
          </CCard>
        )}

        {coordinates && shipmentData && (
          <CCard>
            <CCardBody>
              <h6 className="mb-3">📍 Current Location on Map</h6>
              <MapContainer
                center={coordinates}
                zoom={13}
                style={{ height: '300px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={coordinates}>
                  <Popup>
                    <strong>Consignee:</strong> {shipmentData.consignee?.consignee_company_name}
                    <br />
                    <strong>Shipper:</strong> {shipmentData.shipper?.shipper_company_name}
                    <br />
                    <strong>Description:</strong> {shipmentData.shipment?.shipment_description}
                    <br />
                    <strong>Weight:</strong> {shipmentData.shipment?.shipment_weight} kg
                    <br />
                    <strong>Dimensions:</strong> {shipmentData.shipment?.shipment_dimension_length}x
                    {shipmentData.shipment?.shipment_dimension_width}x
                    {shipmentData.shipment?.shipment_dimension_height} cm
                    <br />
                    <strong>Vehicle:</strong> {vehicleData?.name || 'N/A'} (Plate No:{' '}
                    {vehicleData?.plate_no || 'N/A'})
                    <br />
                    <strong>Driver:</strong> {vehicleData?.driver_name || 'N/A'}
                  </Popup>
                </Marker>
              </MapContainer>
            </CCardBody>
          </CCard>
        )}
      </CCardBody>
    </CCard>
  )
}

export default DeliveryTracking
