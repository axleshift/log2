import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CFormLabel,
  CButton,
  CForm,
  CFormInput,
  CContainer,
  CSpinner,
  CAlert,
  CListGroup,
  CListGroupItem,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const WAREHOUSE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/warehouse`

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([])
  const [warehouseData, setWarehouseData] = useState({
    name: '',
    location: '',
    capacity: '',
    goods_stored: '',
    customCapacity: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingWarehouse, setEditingWarehouse] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const capacityOptions = ['Low', 'Medium', 'Full', 'Custom']

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoading(true)
        const response = await fetch(WAREHOUSE_API_URL)
        if (!response.ok) throw new Error('Failed to fetch warehouses')
        const data = await response.json()
        setWarehouses(data)
      } catch (err) {
        setError('Failed to load warehouses')
      } finally {
        setLoading(false)
      }
    }

    fetchWarehouses()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setWarehouseData({ ...warehouseData, [name]: value })
  }

  const generateWarehouseId = () => {
    const lastWarehouse = warehouses[warehouses.length - 1]
    let lastNumber = lastWarehouse ? parseInt(lastWarehouse.warehouse_id.replace('WH', ''), 10) : 0
    let newNumber = lastNumber + 1
    return `WH${newNumber.toString().padStart(3, '0')}`
  }

  const handleSubmitWarehouse = async (e) => {
    e.preventDefault()

    const formData = {
      warehouse_id: generateWarehouseId(),
      name: warehouseData.name,
      location: warehouseData.location,
      capacity: warehouseData.capacity,
      goods_stored: String(warehouseData.goods_stored),
    }

    if (!formData.name || !formData.location || !formData.capacity || !formData.goods_stored) {
      setError('Please fill all fields to create a new warehouse.')
      return
    }

    try {
      const response = await fetch(WAREHOUSE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorDetails = await response.text()
        throw new Error(errorDetails || 'Failed to create warehouse')
      }

      const newWarehouse = await response.json()
      setWarehouses((prevWarehouses) => [...prevWarehouses, newWarehouse])
      setWarehouseData({
        name: '',
        location: '',
        capacity: '',
        goods_stored: '',
        customCapacity: '',
      })
      setShowModal(false)
      setError(null)
    } catch (err) {
      setError('Failed to create warehouse: ' + err.message)
    }
  }

  const handleDeleteWarehouse = async (warehouse_id) => {
    if (!warehouse_id) {
      setError('Warehouse ID is undefined. Unable to delete.')
      return
    }

    try {
      const response = await fetch(`${WAREHOUSE_API_URL}/${warehouse_id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete warehouse')
      }

      setWarehouses((prevWarehouses) =>
        prevWarehouses.filter((warehouse) => warehouse.warehouse_id !== warehouse_id),
      )
      setError(null)
    } catch (err) {
      setError('Failed to delete warehouse: ' + err.message)
    }
  }

  const handleGoToWarehouse = (warehouse_id) => {
    navigate(`/warehouseDetail/${warehouse_id}`)
  }

  return (
    <CContainer>
      <h1 className="mb-4">Warehouse Management</h1>

      {/* Create Warehouse Button */}
      <CButton color="primary" onClick={() => setShowModal(true)} className="mb-4">
        Create Warehouse
      </CButton>

      {/* Warehouse Form Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader onClose={() => setShowModal(false)}>
          <CModalTitle>{editingWarehouse ? 'Edit Warehouse' : 'Create New Warehouse'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmitWarehouse}>
            <div className="mb-3">
              <CFormLabel htmlFor="name">Warehouse Name</CFormLabel>
              <CFormInput
                id="name"
                name="name"
                type="text"
                placeholder="Enter warehouse name"
                value={warehouseData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="location">Location</CFormLabel>
              <CFormInput
                id="location"
                name="location"
                type="text"
                placeholder="Enter warehouse location"
                value={warehouseData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="capacity">Capacity</CFormLabel>
              <CFormSelect
                id="capacity"
                name="capacity"
                value={warehouseData.capacity}
                onChange={handleChange}
                required
              >
                <option value="">Select capacity</option>
                {capacityOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {warehouseData.capacity === 'Custom' && (
              <div className="mb-3">
                <CFormLabel htmlFor="customCapacity">Custom Capacity</CFormLabel>
                <CFormInput
                  id="customCapacity"
                  name="customCapacity"
                  type="text"
                  placeholder="Enter custom capacity"
                  value={warehouseData.customCapacity || ''}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="mb-3">
              <CFormLabel htmlFor="goods_stored">Goods Stored</CFormLabel>
              <CFormInput
                id="goods_stored"
                name="goods_stored"
                type="text"
                placeholder="Enter goods stored"
                value={warehouseData.goods_stored}
                onChange={handleChange}
                required
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
          <CButton type="submit" color="primary" onClick={handleSubmitWarehouse}>
            {editingWarehouse ? 'Update Warehouse' : 'Create Warehouse'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Warehouse List */}
      <h2 className="mt-4">Warehouse List</h2>
      {loading && <CSpinner />}
      {error && <CAlert color="danger">{error}</CAlert>}

      <CListGroup>
        {warehouses.map((warehouse) => (
          <CListGroupItem key={warehouse.warehouse_id}>
            <h4>{warehouse.name}</h4>
            <p>{warehouse.location}</p>
            <p>Capacity: {warehouse.capacity}</p>
            <div className="d-flex gap-2">
              <CButton color="info" onClick={() => handleGoToWarehouse(warehouse.warehouse_id)}>
                View Details
              </CButton>
              <CButton color="danger" onClick={() => handleDeleteWarehouse(warehouse.warehouse_id)}>
                Delete
              </CButton>
            </div>
          </CListGroupItem>
        ))}
      </CListGroup>
    </CContainer>
  )
}

export default WarehouseManagement
