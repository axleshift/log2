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
      setFilteredShipments(
        shipments.filter(
          (s) =>
            s.shipment?.shipment_description &&
            s.shipment.shipment_description.toLowerCase().includes(value.toLowerCase()),
        ),
      )
    }
  }

  const handleSearchChange = (e) => {
    const keyword = e.target.value.toLowerCase()
    setSearch(keyword)
    setFilteredShipments(
      shipments.filter((s) => s.shipper?.shipper_company_name?.toLowerCase().includes(keyword)),
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="mb-4 fw-bold">Shipment Records</h1>

      <div className="d-flex justify-content-between mb-3">
        <CFormSelect value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="All">All</option>
        </CFormSelect>

        <CFormInput
          placeholder="Search Shipper Company"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Shipper Company</CTableHeaderCell>
            <CTableHeaderCell>Tracking ID</CTableHeaderCell>
            <CTableHeaderCell>Shipment Description</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {Array.isArray(filteredShipments) && filteredShipments.length > 0 ? (
            filteredShipments.map((shipment, index) => (
              <CTableRow key={shipment._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{shipment.shipper?.shipper_company_name || 'N/A'}</CTableDataCell>
                <CTableDataCell>{shipment.tracking_id || 'N/A'}</CTableDataCell>
                <CTableDataCell>{shipment.shipment?.shipment_description || 'N/A'}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="info"
                    size="sm"
                    onClick={() => {
                      setSelectedShipment(shipment)
                      setModalVisible(true)
                    }}
                  >
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={5} className="text-center text-muted">
                No shipments found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>Shipment Details</CModalHeader>
        <CModalBody>
          {selectedShipment && (
            <>
              <p>
                <strong>Shipper Company:</strong>{' '}
                {selectedShipment.shipper?.shipper_company_name || 'N/A'}
              </p>
              <p>
                <strong>Tracking ID:</strong> {selectedShipment.tracking_id || 'N/A'}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {selectedShipment.shipment?.shipment_description || 'N/A'}
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
