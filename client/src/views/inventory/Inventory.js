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
  CFormCheck,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CSpinner,
  CForm,
  CFormLabel,
  CFormSelect,
} from '@coreui/react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_URL
const INVENTORY_API_URL = `${API_BASE}/api/v1/inventory`
const SHIPMENT_API_URL = `${API_BASE}/api/v1/shipment`
const PRODUCT_API_URL = `${API_BASE}/api/v1/product`
const WAREHOUSE_API_URL = `https://backend-log1.axleshift.com/api/v1/warehouseLoc/locations`

const Inventory = () => {
  const { accessToken } = useAuth()
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [inventoryData, setInventoryData] = useState([])
  const [shipments, setShipments] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [newItem, setNewItem] = useState({
    shipment: '',
    warehouse_id: '',
    product: '',
    sku: '',
    quantity: '',
    stock_level: '',
    status: 'In Stock',
  })

  useEffect(() => {
    fetchInventoryData()
    fetchShipments()
    fetchProducts()
    fetchWarehouses()
  }, [])

  const fetchInventoryData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(INVENTORY_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setInventoryData(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      setMessage('Error fetching inventory data.')
    } finally {
      setLoading(false)
    }
  }

  const fetchShipments = async () => {
    try {
      const res = await axios.get(SHIPMENT_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setShipments(res.data?.shipments || [])
    } catch (error) {
      console.error('Failed to fetch shipments')
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get(PRODUCT_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setProducts(res.data || [])
    } catch (error) {
      console.error('Failed to fetch products')
    }
  }

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get(WAREHOUSE_API_URL, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':
            '0ad3f5c013c42d2d0537672a260978c71dcd5a7d508019d748f991deee3d65665a477e3523c6bbc83fd6a51a71dd5003',
        },
      })
      // Accessing the "data" array from the response
      setWarehouses(res.data?.data || [])
    } catch (error) {
      console.error('Failed to fetch warehouses', error)
    }
  }

  const filteredInventory = useMemo(() => {
    return inventoryData.filter((item) =>
      (item.shipment?.tracking_id || '').toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [inventoryData, searchQuery])

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked
    setSelectAll(isChecked)
    setSelectedRows(isChecked ? new Set(inventoryData.map((item) => item._id)) : new Set())
  }

  const handleRowCheckChange = (e, id) => {
    const updatedSet = new Set(selectedRows)
    e.target.checked ? updatedSet.add(id) : updatedSet.delete(id)
    setSelectedRows(updatedSet)
  }

  const handleDelete = async () => {
    if (!selectedRows.size) return setMessage('Please select items to delete.')

    try {
      await Promise.all(
        Array.from(selectedRows).map((id) =>
          axios.delete(`${INVENTORY_API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ),
      )
      setMessage('Selected items deleted successfully.')
      setSelectedRows(new Set())
      setSelectAll(false)
      fetchInventoryData()
    } catch (error) {
      setMessage('Error deleting selected items.')
    } finally {
      setDeleteConfirmation(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id)

    if (
      !isValidObjectId(newItem.shipment) ||
      !isValidObjectId(newItem.product) ||
      !isValidObjectId(newItem.warehouse_id)
    ) {
      return setMessage('Shipment, Product, and Warehouse must be valid ObjectIDs.')
    }

    const payload = {
      ...newItem,
      quantity: Number(newItem.quantity),
      stock_level: Number(newItem.stock_level),
    }

    try {
      await axios.post(INVENTORY_API_URL, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setMessage('New inventory item created.')
      setNewItem({
        shipment: '',
        warehouse_id: '',
        product: '',
        sku: '',
        quantity: '',
        stock_level: '',
        status: 'In Stock',
      })
      setCreateModalVisible(false)
      fetchInventoryData()
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create item.')
    }
  }

  return (
    <CCard>
      <CCardHeader className="text-center py-3">Warehouse Inventory</CCardHeader>
      <CCardBody>
        {message && <div className="alert alert-info">{message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <CInputGroup style={{ maxWidth: '400px' }}>
            <CInputGroupText>Search</CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Search by Tracking ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CInputGroup>

          <div className="d-flex gap-2">
            <CButton color="success" onClick={() => setCreateModalVisible(true)}>
              + New Item
            </CButton>
            <CButton color="danger" onClick={() => setDeleteConfirmation(true)}>
              Delete
            </CButton>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
          </div>
        ) : (
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>
                  <CFormCheck checked={selectAll} onChange={handleSelectAllChange} />
                </CTableHeaderCell>
                <CTableHeaderCell>Tracking ID</CTableHeaderCell>
                <CTableHeaderCell>Product</CTableHeaderCell>
                <CTableHeaderCell>SKU</CTableHeaderCell>
                <CTableHeaderCell>Quantity</CTableHeaderCell>
                <CTableHeaderCell>Stock Level</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>
                      <CFormCheck
                        checked={selectedRows.has(item._id)}
                        onChange={(e) => handleRowCheckChange(e, item._id)}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{item.shipment?.tracking_id || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{item.product?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{item.sku}</CTableDataCell>
                    <CTableDataCell>{item.quantity}</CTableDataCell>
                    <CTableDataCell>{item.stock_level}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="6" className="text-center">
                    No inventory records found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      {/* Create Modal */}
      <CModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>New Inventory Item</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleCreate}>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel>Shipment</CFormLabel>
              <CFormSelect
                value={newItem.shipment}
                onChange={(e) => setNewItem({ ...newItem, shipment: e.target.value })}
                required
              >
                <option value="">Select Shipment</option>
                {Array.isArray(shipments) &&
                  shipments.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.tracking_id || 'Unnamed Shipment'}
                    </option>
                  ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Product</CFormLabel>
              <CFormSelect
                value={newItem.product}
                onChange={(e) => setNewItem({ ...newItem, product: e.target.value })}
                required
              >
                <option value="">Select Product</option>
                {Array.isArray(products) &&
                  products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name || 'Unnamed Product'}
                    </option>
                  ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Warehouse</CFormLabel>
              <CFormSelect
                value={newItem.warehouse_id}
                onChange={(e) => setNewItem({ ...newItem, warehouse_id: e.target.value })}
                required
              >
                <option value="">Select Warehouse</option>
                {Array.isArray(warehouses) &&
                  warehouses.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.warehouseName} - {w.address}{' '}
                      {/* You can display the warehouse name and address */}
                    </option>
                  ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>SKU</CFormLabel>
              <CFormInput
                value={newItem.sku}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Quantity</CFormLabel>
              <CFormInput
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Stock Level</CFormLabel>
              <CFormInput
                type="number"
                value={newItem.stock_level}
                onChange={(e) => setNewItem({ ...newItem, stock_level: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Status</CFormLabel>
              <CFormSelect
                value={newItem.status}
                onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pending">Pending</option>
              </CFormSelect>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setCreateModalVisible(false)}>
              Cancel
            </CButton>
            <CButton color="primary" type="submit">
              Create
            </CButton>
          </CModalFooter>
        </CForm>
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
