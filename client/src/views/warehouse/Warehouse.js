import React, { useEffect, useState } from 'react'
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
import {
  getWarehouseItems,
  createWarehouseItem,
  updateWarehouseItem,
  deleteWarehouseItem,
} from '../../api/warehouseService'

const Warehouse = () => {
  const [items, setItems] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [newItem, setNewItem] = useState({
    date: '',
    productName: '',
    productCategory: '',
    vendorName: '',
    unitsReceived: 0,
  })
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
      const data = await getWarehouseItems()
      setItems(Array.isArray(data) ? data : []) // Ensure data is an array
    } catch (error) {
      console.error('Error fetching items:', error)
      setError('Failed to fetch items. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('New item to be added:', newItem)
      const result = await createWarehouseItem(newItem)
      setItems([...items, result])
      resetModal()
    } catch (error) {
      console.error('Error adding item:', error)
      setError('Failed to add item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateItem = async () => {
    setLoading(true)
    setError(null)
    try {
      const updatedItem = await updateWarehouseItem(currentItem._id, {
        ...newItem,
        unitsReceived: Number(newItem.unitsReceived), // Ensure it's a number
      })
      console.log('API response:', updatedItem)
      setItems(items.map((item) => (item._id === updatedItem._id ? updatedItem : item)))
      resetModal()
    } catch (error) {
      console.error('Error updating item:', error)
      setError('Failed to update item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await deleteWarehouseItem(id)
      setItems(items.filter((item) => item._id !== id))
    } catch (error) {
      console.error('Error deleting item:', error)
      setError('Failed to delete item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const newValue = name === 'unitsReceived' ? Number(value) : value // Convert to number if needed
    setNewItem({ ...newItem, [name]: newValue })
  }

  const handleEditItem = (id) => {
    const itemToEdit = items.find((item) => item._id === id)
    setCurrentItem(itemToEdit)
    setNewItem(itemToEdit)
    setModalVisible(true)
  }

  const isFormValid = () => {
    return Object.values(newItem).every((field) => field !== '') && newItem.unitsReceived >= 0
  }

  const resetModal = () => {
    setModalVisible(false)
    setNewItem({
      date: '',
      productName: '',
      productCategory: '',
      vendorName: '',
      unitsReceived: 0,
    })
    setCurrentItem(null)
    setError(null)
  }
  // ALLOWS USER TO SEARCH INPUT AND DISPLAYS THE ITEM IN THE TABLE REAL TIME
  const filteredItems = items.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <CCard>
      <h1 className="text-center">WAREHOUSE</h1>
      <CCardHeader>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <CButton color="primary" className="me-md-2" onClick={() => setModalVisible(true)}>
            + Create
          </CButton>
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
            <CTableHead align="center" size="md">
              <CTableRow>
                <CTableHeaderCell>No.</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Product Name</CTableHeaderCell>
                <CTableHeaderCell>Product Category</CTableHeaderCell>
                <CTableHeaderCell>Vendor Name</CTableHeaderCell>
                <CTableHeaderCell>Units Received</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredItems.map((item, index) => (
                <CTableRow key={item._id}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{new Date(item.date).toLocaleDateString()}</CTableDataCell>
                  <CTableDataCell>{item.productName}</CTableDataCell>
                  <CTableDataCell>{item.productCategory}</CTableDataCell>
                  <CTableDataCell>{item.vendorName}</CTableDataCell>
                  <CTableDataCell>{item.unitsReceived}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" onClick={() => handleEditItem(item._id)}>
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

      {/* Modal for Create/Edit */}
      <CModal visible={modalVisible} onClose={resetModal}>
        <CModalHeader>
          <CModalTitle>{currentItem ? 'Edit Item' : 'Create Item'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="date"
            name="date"
            label="Date"
            value={newItem.date}
            onChange={handleInputChange}
          />
          <CFormInput
            type="text"
            name="productName"
            label="Product Name"
            value={newItem.productName}
            onChange={handleInputChange}
          />
          <CFormInput
            type="text"
            name="productCategory"
            label="Product Category"
            value={newItem.productCategory}
            onChange={handleInputChange}
          />
          <CFormInput
            type="text"
            name="vendorName"
            label="Vendor Name"
            value={newItem.vendorName}
            onChange={handleInputChange}
          />
          <CFormInput
            type="number"
            name="unitsReceived"
            label="Units Received"
            value={newItem.unitsReceived}
            onChange={handleInputChange}
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            onClick={currentItem ? handleUpdateItem : handleAddItem}
            disabled={!isFormValid()}
          >
            {currentItem ? 'Update' : 'Add'}
          </CButton>
          <CButton color="secondary" onClick={resetModal}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default Warehouse
