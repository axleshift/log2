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
      setShipments(res.data)
      setFilteredShipments(res.data)
    } catch (err) {
      console.error('Failed to fetch shipments')
    }
  }

  useEffect(() => {
    fetchShipments()
  }, [])

  const handleFilterChange = (value) => {
    setFilter(value)
    setFilteredShipments(value === 'All' ? shipments : shipments.filter((s) => s.status === value))
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setFilteredShipments(
      shipments.filter((s) => s.vendorName.toLowerCase().includes(e.target.value.toLowerCase())),
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="mb-4 fw-bold">Shipment Records</h1>
      <div className="d-flex justify-content-between mb-3">
        <CFormSelect value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </CFormSelect>
        <CFormInput placeholder="Search Vendor" value={search} onChange={handleSearchChange} />
      </div>

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Vendor Name</CTableHeaderCell>
            <CTableHeaderCell>Tracking Number</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredShipments.map((shipment) => (
            <CTableRow key={shipment._id}>
              <CTableDataCell>{shipment.vendorName}</CTableDataCell>
              <CTableDataCell>{shipment.trackingNumber}</CTableDataCell>
              <CTableDataCell>{shipment.status}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="info"
                  onClick={() => {
                    setSelectedShipment(shipment)
                    setModalVisible(true)
                  }}
                >
                  View
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>Shipment Details</CModalHeader>
        <CModalBody>
          {selectedShipment && (
            <>
              <p>
                <strong>Vendor:</strong> {selectedShipment.vendorName}
              </p>
              <p>
                <strong>Tracking Number:</strong> {selectedShipment.trackingNumber}
              </p>
              <p>
                <strong>Status:</strong> {selectedShipment.status}
              </p>
              <p>
                <strong>Details:</strong> {selectedShipment.details || 'N/A'}
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ShipmentsList
