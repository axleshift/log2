import React, { useState, useEffect, useMemo } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CFormCheck,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Inventory = () => {
  const navigate = useNavigate()
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [inventoryData, setInventoryData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [viewDetailsModal, setViewDetailsModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:5058/api/v1/inventory', {
          params: { search: searchQuery },
        })
        if (Array.isArray(response.data)) {
          setInventoryData(response.data)
        } else {
          setMessage('Unexpected data format received from the server.')
        }
      } catch (error) {
        setMessage('Error fetching inventory data.')
        console.error('Error fetching inventory data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryData()
  }, [searchQuery])

  const filteredInventory = useMemo(() => {
    return Array.isArray(inventoryData)
      ? inventoryData.filter((item) =>
          item.tracking_id.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : []
  }, [inventoryData, searchQuery])

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked
    setSelectAll(isChecked)

    if (isChecked) {
      setSelectedRows(new Set(inventoryData.map((item) => item.tracking_id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleRowCheckChange = (e, tracking_id) => {
    const newSelectedRows = new Set(selectedRows)
    if (e.target.checked) {
      newSelectedRows.add(tracking_id)
    } else {
      newSelectedRows.delete(tracking_id)
    }
    setSelectedRows(newSelectedRows)
  }

  const handleDelete = async () => {
    if (selectedRows.size === 0) {
      setMessage('Please select at least one item to delete.')
      return
    }

    const idsToDelete = Array.from(selectedRows)

    try {
      if (idsToDelete.length === 1) {
        const trackingId = idsToDelete[0]
        await axios.delete(`http://localhost:5058/api/v1/inventory/${trackingId}`)
      } else {
        await axios.delete('http://localhost:5058/api/v1/inventory/bulk-delete', {
          data: { ids: idsToDelete },
        })
      }

      setMessage('Selected items deleted successfully.')
      setSelectedRows(new Set())
      setSelectAll(false)
      const inventoryResponse = await axios.get('http://localhost:5058/api/v1/inventory')
      setInventoryData(inventoryResponse.data)
      setDeleteConfirmation(false)
    } catch (error) {
      setMessage('Error deleting selected items.')
    }
  }

  const handleViewDetails = (tracking_id) => {
    navigate(`/warehouse/${tracking_id}`)
  }

  const handleCloseModal = () => {
    setViewDetailsModal(false)
    setSelectedItem(null)
  }

  return (
    <CCard>
      <CCardHeader as="h5" style={{ textAlign: 'center', padding: '1rem' }}>
        Warehouse Inventory
      </CCardHeader>
      <CCardBody>
        {message && <div className="alert alert-info">{message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <CInputGroup style={{ maxWidth: '400px', width: '100%' }}>
            <CInputGroupText>Search</CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Search by Tracking ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CInputGroup>

          <div className="d-flex">
            <CButton color="danger" shape="rounded-0" onClick={() => setDeleteConfirmation(true)}>
              Delete
            </CButton>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  <CFormCheck id="selectAll" checked={selectAll} onChange={handleSelectAllChange} />
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Tracking ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                <CTableHeaderCell scope="col">Warehouse Location</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <CTableRow key={item.tracking_id}>
                    <CTableDataCell>
                      <CFormCheck
                        id={`row${item.tracking_id}`}
                        checked={selectedRows.has(item.tracking_id)}
                        onChange={(e) => handleRowCheckChange(e, item.tracking_id)}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{item.tracking_id}</CTableDataCell>
                    <CTableDataCell>
                      {item.shipment?.shipment_description || 'No description'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.warehouse?.destination || 'No destination available'}
                    </CTableDataCell>
                    <CTableDataCell>{item.status || 'Unknown'}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="info" onClick={() => handleViewDetails(item.tracking_id)}>
                        View Details
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="6" style={{ textAlign: 'center' }}>
                    No inventory records found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      {/* Modal for View Details */}
      <CModal visible={viewDetailsModal} onClose={handleCloseModal}>
        <CModalHeader>
          <CModalTitle>Item Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {loadingDetails ? (
            <div>Loading details...</div>
          ) : (
            <div>
              <h6>Tracking ID: {selectedItem?.tracking_id}</h6>
              <p>Shipment Description: {selectedItem?.shipment?.shipment_description}</p>
              <p>Warehouse Location: {selectedItem?.warehouse?.destination || 'Not assigned'}</p>
              <p>Status: {selectedItem?.status || 'Unknown'}</p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteConfirmation} onClose={() => setDeleteConfirmation(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete the selected item(s)?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirmation(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default Inventory
