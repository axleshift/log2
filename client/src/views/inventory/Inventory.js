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
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../../api/inventoryService'

const Inventory = () => {
  const [items, setItems] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    min_level: 0,
    location: '',
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
      const data = await getInventoryItems()
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching items:', error)
      setError('Failed to fetch items. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddOrUpdateItem = async () => {
    setLoading(true)
    setError(null)
    try {
      if (currentItem) {
        await updateInventoryItem(currentItem._id, newItem)
      } else {
        await createInventoryItem(newItem)
      }
      fetchAllItems()
      resetModal()
    } catch (error) {
      console.error('Error saving item:', error)
      setError('Failed to save item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await deleteInventoryItem(id)
      fetchAllItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      setError('Failed to delete item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditItem = (item) => {
    setCurrentItem(item)
    setNewItem(item)
    setModalVisible(true)
  }

  const resetModal = () => {
    setModalVisible(false)
    setNewItem({
      name: '',
      quantity: 0,
      min_level: 0,
      location: '',
    })
    setCurrentItem(null)
    setError(null)
  }

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <CCard>
      <h1 className="text-center">Inventory Management</h1>
      <CCardHeader>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <CButton color="primary" onClick={() => setModalVisible(true)}>
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
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>No.</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Quantity</CTableHeaderCell>
                <CTableHeaderCell>Minimum Level</CTableHeaderCell>
                <CTableHeaderCell>Location</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredItems.map((item, index) => (
                <CTableRow key={item._id}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{item.name}</CTableDataCell>
                  <CTableDataCell>{item.quantity}</CTableDataCell>
                  <CTableDataCell>{item.min_level}</CTableDataCell>
                  <CTableDataCell>{item.location}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" onClick={() => handleEditItem(item)}>
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
            type="text"
            name="name"
            label="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <CFormInput
            type="number"
            name="quantity"
            label="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          />
          <CFormInput
            type="number"
            name="min_level"
            label="Minimum Level"
            value={newItem.min_level}
            onChange={(e) => setNewItem({ ...newItem, min_level: Number(e.target.value) })}
          />
          <CFormInput
            type="text"
            name="location"
            label="Location"
            value={newItem.location}
            onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleAddOrUpdateItem}>
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

export default Inventory
