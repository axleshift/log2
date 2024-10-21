import React, { useEffect, useState, useCallback } from 'react'
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
  CForm,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from '@coreui/react'

const INVENTORY_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/inventory`

const Inventory = () => {
  const [items, setItems] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState({
    shipper: {},
    consignee: {},
    shipment: {},
    shipping: { shipping_details: { land: {}, air: {}, sea: {} } },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAllItems()
  }, [])

  const fetchAllItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(INVENTORY_API_URL)
      setItems(Array.isArray(response.data.data) ? response.data.data : [])
    } catch (error) {
      console.error('Error fetching items:', error)
      setError('Failed to fetch items. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
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
  }

  const handleViewItem = (item) => {
    setCurrentItem(item)
    setModalVisible(true)
  }

  const handleCreateOrUpdateItem = async (isUpdate) => {
    setLoading(true)
    setError(null)
    try {
      if (isUpdate) {
        await axios.put(`${INVENTORY_API_URL}/${currentItem._id}`, currentItem)
      } else {
        await axios.post(INVENTORY_API_URL, currentItem)
      }
      fetchAllItems()
      resetModal()
    } catch (error) {
      console.error(`Error ${isUpdate ? 'updating' : 'creating'} item:`, error)
      setError(`Failed to ${isUpdate ? 'update' : 'create'} item. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setModalVisible(false)
    setCurrentItem({
      shipper: {},
      consignee: {},
      shipment: {},
      shipping: { shipping_details: { land: {}, air: {}, sea: {} } },
    })
    setError(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    const fieldMap = {
      shipper: 'shipper_',
      consignee: 'consignee_',
      shipment: 'shipment_',
      status: 'status',
    }

    let updatedField = null

    for (const [field, prefix] of Object.entries(fieldMap)) {
      if (name.startsWith(prefix)) {
        const fieldName = name.replace(prefix, '')
        updatedField = { [fieldName]: value }

        setCurrentItem((prevItem) => ({
          ...prevItem,
          [field]: {
            ...prevItem[field],
            ...updatedField,
          },
        }))
        return
      }
    }
  }

  const handleShippingDetailsChange = (e) => {
    const { name, value } = e.target
    const [mode, field] = name.split('.')

    setCurrentItem((prevItem) => ({
      ...prevItem,
      shipping: {
        ...prevItem.shipping,
        shipping_details: {
          ...prevItem.shipping.shipping_details,
          [mode]: {
            ...prevItem.shipping.shipping_details[mode],
            [field]: value,
          },
        },
      },
    }))
  }

  const formatDateForInput = (date) => (date ? new Date(date).toISOString().split('T')[0] : '')

  const filteredItems = items.filter((item) =>
    item?.shipment?.shipment_description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <CButton
            color="success"
            onClick={() => {
              setModalVisible(true)
              resetModal()
            }}
          >
            Add New Item
          </CButton>
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
          <CModalTitle>{currentItem._id ? 'Edit Item' : 'Add New Item'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            onSubmit={(e) => {
              e.preventDefault() // Prevent default form submission
              handleCreateOrUpdateItem(!!currentItem._id)
            }}
          >
            <div>
              <h5>Shipper Details</h5>
              <CFormInput
                label="Company Name"
                name="shipper_company_name"
                value={currentItem.shipper?.shipper_company_name || ''}
                onChange={handleInputChange}
              />
              <CFormInput
                label="Contact Name"
                name="shipper_contact_name"
                value={currentItem.shipper?.shipper_contact_name || ''}
                onChange={handleInputChange}
              />
              <CFormInput
                label="Email"
                name="shipper_contact_email_address"
                value={currentItem.shipper?.shipper_contact_email_address || ''}
                onChange={handleInputChange}
              />
              <CFormInput
                label="Address"
                name="shipper_company_address"
                value={currentItem.shipper?.shipper_company_address || ''}
                onChange={handleInputChange}
              />

              <h5>Consignee Details</h5>
              <CFormInput
                label="Company Name"
                name="consignee_company_name"
                value={currentItem.consignee?.consignee_company_name || ''}
                onChange={handleInputChange}
              />
              <CFormInput
                label="Contact Name"
                name="consignee_contact_name"
                value={currentItem.consignee?.consignee_contact_name || ''}
                onChange={handleInputChange}
              />
              <CFormInput
                label="Email"
                name="consignee_contact_email_address"
                value={currentItem.consignee?.consignee_contact_email_address || ''}
                onChange={handleInputChange}
              />
              <CFormInput
                label="Phone"
                name="consignee_contact_phone_number"
                value={currentItem.consignee?.consignee_contact_phone_number || ''}
                onChange={handleInputChange}
              />
              <CFormInput
                label="Address"
                name="consignee_company_address"
                value={currentItem.consignee?.consignee_company_address || ''}
                onChange={handleInputChange}
              />

              <h5>Shipment Details</h5>
              <CFormInput
                label="Description"
                name="shipment_description"
                value={currentItem.shipment?.shipment_description || ''}
                onChange={handleInputChange}
              />
              <CFormInput
                label="Weight"
                name="shipment_weight"
                value={currentItem.shipment?.shipment_weight || ''}
                onChange={handleInputChange}
              />
              <CFormInput
                label="Value"
                name="shipment_value"
                value={currentItem.shipment?.shipment_value || ''}
                onChange={handleInputChange}
              />
              <CFormInput
                label="Status"
                name="status"
                value={currentItem.status || ''}
                onChange={handleInputChange}
              />

              <h5>Shipping Details</h5>
              <CFormInput
                label="Land"
                name="land.description"
                value={currentItem.shipping?.shipping_details?.land?.description || ''}
                onChange={handleShippingDetailsChange}
              />
              <CFormInput
                label="Air"
                name="air.description"
                value={currentItem.shipping?.shipping_details?.air?.description || ''}
                onChange={handleShippingDetailsChange}
              />
              <CFormInput
                label="Sea"
                name="sea.description"
                value={currentItem.shipping?.shipping_details?.sea?.description || ''}
                onChange={handleShippingDetailsChange}
              />
            </div>

            {/* Submit and Close buttons */}
            <CModalFooter>
              {loading ? (
                <CSpinner size="sm" />
              ) : (
                <>
                  <CButton color={currentItem._id ? 'primary' : 'success'} type="submit">
                    {currentItem._id ? 'Update' : 'Create'}
                  </CButton>
                  <CButton color="secondary" onClick={resetModal}>
                    Close
                  </CButton>
                </>
              )}
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </CCard>
  )
}

export default Inventory
