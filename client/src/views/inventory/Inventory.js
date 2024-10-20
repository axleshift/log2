import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardHeader,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'

const INVENTORY_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/inventory`

const Inventory = () => {
  const [items, setItems] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAllItems()
  }, [])

  const fetchAllItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(INVENTORY_API_URL)
      // Ensure items is always an array
      setItems(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching items:', error)
      setError('Failed to fetch items. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await axios.delete(`${INVENTORY_API_URL}/${id}`)
      fetchAllItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      setError('Failed to delete item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleViewItem = (item) => {
    setCurrentItem(item)
    setModalVisible(true)
  }

  const handleUpdateItem = async () => {
    setLoading(true)
    setError(null)
    try {
      if (currentItem) {
        await axios.put(`${INVENTORY_API_URL}/${currentItem._id}`, currentItem)
        fetchAllItems()
        resetModal()
      }
    } catch (error) {
      console.error('Error updating item:', error)
      setError('Failed to update item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setModalVisible(false)
    setCurrentItem(null)
    setError(null)
  }

  const filteredItems = items.filter((item) => {
    const description = item?.shipment?.shipment_description?.toLowerCase() || ''
    return description.includes(searchQuery.toLowerCase())
  })

  return (
    <CCard>
      <h1 className="text-center">Inventory Management</h1>
      <CCardHeader>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <CFormInput
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CCardHeader>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <CTable bordered hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>No.</CTableHeaderCell>
                <CTableHeaderCell>Shipment Description</CTableHeaderCell>
                <CTableHeaderCell>Weight</CTableHeaderCell>
                <CTableHeaderCell>Value</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredItems.map((item, index) => (
                <CTableRow key={item._id}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{item.shipment.shipment_description}</CTableDataCell>
                  <CTableDataCell>{item.shipment.shipment_weight}</CTableDataCell>
                  <CTableDataCell>{item.shipment.shipment_value}</CTableDataCell>
                  <CTableDataCell>{item.status}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" onClick={() => handleViewItem(item)}>
                      View
                    </CButton>
                    <CButton color="primary" onClick={() => handleViewItem(item)}>
                      Edit
                    </CButton>
                    <CButton color="danger" onClick={() => handleDeleteItem(item._id)}>
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </>
      )}

      <CModal visible={modalVisible} onClose={resetModal}>
        <CModalHeader>
          <CModalTitle>{currentItem ? 'View / Edit Item' : 'Item Details'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Display Item Details */}
          {currentItem && (
            <>
              <h5>Shipper Details</h5>
              <p>Company Name: {currentItem.shipper.shipper_company_name}</p>
              <p>Contact Name: {currentItem.shipper.shipper_contact_name}</p>
              <p>Email: {currentItem.shipper.shipper_contact_email_address}</p>
              <p>Address: {currentItem.shipper.shipper_company_address}</p>

              <h5>Consignee Details</h5>
              <p>Company Name: {currentItem.consignee.consignee_company_name}</p>
              <p>Contact Name: {currentItem.consignee.consignee_contact_name}</p>
              <p>Email: {currentItem.consignee.consignee_contact_email_address}</p>
              <p>Phone: {currentItem.consignee.consignee_contact_phone_number}</p>
              <p>Address: {currentItem.consignee.consignee_company_address}</p>

              <h5>Shipment Details</h5>
              <p>Description: {currentItem.shipment.shipment_description}</p>
              <p>Weight: {currentItem.shipment.shipment_weight}</p>
              <p>Value: {currentItem.shipment.shipment_value}</p>
              <p>Instructions: {currentItem.shipment.shipment_instructions}</p>

              <h5>Status</h5>
              <p>{currentItem.status}</p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          {currentItem && (
            <CButton color="primary" onClick={handleUpdateItem}>
              Update
            </CButton>
          )}
          <CButton color="secondary" onClick={resetModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default Inventory
