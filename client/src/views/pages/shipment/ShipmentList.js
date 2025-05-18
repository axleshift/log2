import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL
const SHIPMENT_API_URL = `${API_URL}/api/v1/shipment`

const ShipmentsList = () => {
  const { accessToken } = useAuth()
  const [shipments, setShipments] = useState([])
  const [filteredShipments, setFilteredShipments] = useState([])
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const fetchShipments = async () => {
    try {
      const res = await axios.get(SHIPMENT_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const fetched = res.data?.shipments || []
      setShipments(fetched)
      setFilteredShipments(fetched)
    } catch (err) {
      console.error('Failed to fetch shipments', err)
    }
  }

  useEffect(() => {
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

  const openModal = (shipment) => {
    setSelectedShipment(shipment)
    setModalVisible(true)
  }

  const closeModal = () => {
    setSelectedShipment(null)
    setModalVisible(false)
  }

  return (
    <>
      <div className="d-flex gap-2 mb-3">
        <CFormInput
          placeholder="Search by Tracking ID"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <CFormSelect value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Delayed">Delayed</option>
        </CFormSelect>
      </div>

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
              <CTableDataCell>{shipment.consignee?.consignee_company_name || 'N/A'}</CTableDataCell>
              <CTableDataCell>{shipment.vehicle?.driver_name || 'N/A'}</CTableDataCell>
              <CTableDataCell>
                <CButton size="sm" color="primary" onClick={() => openModal(shipment)}>
                  View
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={modalVisible} onClose={closeModal}>
        <CModalHeader closeButton>
          <strong>Shipment Details</strong>
        </CModalHeader>
        <CModalBody>
          {selectedShipment && (
            <>
              <p>
                <strong>Tracking ID:</strong> {selectedShipment.tracking_id}
              </p>
              <p>
                <strong>Status:</strong> {selectedShipment.delivery?.status || 'N/A'}
              </p>
              <p>
                <strong>Consignee:</strong> {selectedShipment.consignee?.consignee_company_name}
              </p>
              <p>
                <strong>Shipper:</strong> {selectedShipment.shipper?.shipper_company_name}
              </p>
              <p>
                <strong>Vehicle:</strong> {selectedShipment.vehicle?.name}
              </p>
              <p>
                <strong>Driver:</strong> {selectedShipment.vehicle?.driver_name}
              </p>
              <p>
                <strong>Weight:</strong> {selectedShipment.shipment?.shipment_weight} kg
              </p>
              <p>
                <strong>Dimensions:</strong>{' '}
                {`${selectedShipment.shipment?.shipment_dimension_length} x ${selectedShipment.shipment?.shipment_dimension_width} x ${selectedShipment.shipment?.shipment_dimension_height} cm`}
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ShipmentsList
