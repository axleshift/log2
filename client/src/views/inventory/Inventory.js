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
    productName: '',
    quantity: 0,
    price: '',
    total: '',
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
      productName: '',
      quantity: 0,
      price: '',
      total: '',
    })
    setCurrentItem(null)
    setError(null)
  }

  const filteredItems = items.filter((item) => {
    const productName = item?.productName?.toLowerCase() || ''
    const total = item?.total?.toString().toLowerCase() || ''

    return (
      productName.includes(searchQuery.toLowerCase()) || total.includes(searchQuery.toLowerCase())
    )
  })

  const getStockStatus = (quantity) => {
    return quantity > 6 ? 'In Stock' : 'Out of Stock'
  }

  const calculateTotal = (quantity, price) => {
    const totalValue = parseFloat(quantity) * parseFloat(price || 0)
    setNewItem((prevState) => ({ ...prevState, total: totalValue.toFixed(2) }))
  }

  const handleQuantityChange = (e) => {
    const value = e.target.value
    setNewItem((prevState) => ({
      ...prevState,
      quantity: value,
    }))
    calculateTotal(value, newItem.price)
  }

  const handlePriceChange = (e) => {
    const value = e.target.value
    setNewItem((prevState) => ({
      ...prevState,
      price: value,
    }))
    calculateTotal(newItem.quantity, value)
  }
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
                <CTableHeaderCell>Product Name</CTableHeaderCell>
                <CTableHeaderCell>Quantity</CTableHeaderCell>
                <CTableHeaderCell>Price</CTableHeaderCell>
                <CTableHeaderCell>Total</CTableHeaderCell>
                <CTableHeaderCell>Stock Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredItems.map((item, index) => (
                <CTableRow key={item._id}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{item.productName}</CTableDataCell>
                  <CTableDataCell>{item.quantity}</CTableDataCell>
                  <CTableDataCell>{item.price}</CTableDataCell>
                  <CTableDataCell>{item.total}</CTableDataCell>
                  <CTableDataCell style={{ color: item.quantity > 6 ? 'green' : 'red' }}>
                    {getStockStatus(item.quantity)}
                  </CTableDataCell>
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

      <CModal visible={modalVisible} onClose={resetModal}>
        <CModalHeader>
          <CModalTitle>{currentItem ? 'Edit Item' : 'Create Item'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            name="productName"
            label="Product Name"
            value={newItem.productName}
            onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
          />
          <CFormInput
            type="number"
            name="quantity"
            label="Quantity"
            value={newItem.quantity}
            onChange={handleQuantityChange}
          />
          <CFormInput
            type="text"
            name="price"
            label="Price"
            value={newItem.price}
            onChange={handlePriceChange}
          />
          <CFormInput type="text" name="total" label="Total" value={newItem.total} disabled />
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
