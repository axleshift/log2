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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const WAREHOUSE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/warehouse`

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([])
  const [warehouseData, setWarehouseData] = useState({
    warehouse_id: '',
    name: '',
    location: '',
    capacity: '',
    goods_stored: '',
    customCapacity: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingWarehouse, setEditingWarehouse] = useState(null)
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

  const handleSubmitWarehouse = async (e) => {
    e.preventDefault()

    const formData = {
      ...warehouseData,
      goods_stored: String(warehouseData.goods_stored),
      capacity: String(warehouseData.capacity),
    }

    if (
      !formData.warehouse_id ||
      !formData.name ||
      !formData.location ||
      !formData.capacity ||
      !formData.goods_stored
    ) {
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
        warehouse_id: '',
        name: '',
        location: '',
        capacity: '',
        goods_stored: '',
        customCapacity: '',
      })
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

  const handleEditWarehouse = (warehouse) => {
    setEditingWarehouse(warehouse)
    setWarehouseData({
      warehouse_id: warehouse.warehouse_id,
      name: warehouse.name,
      location: warehouse.location,
      capacity: warehouse.capacity,
      goods_stored: warehouse.goods_stored,
      customCapacity: warehouse.customCapacity || '',
    })
  }

  const handleUpdateWarehouse = async (e) => {
    e.preventDefault()

    const formData = {
      name: warehouseData.name,
      location: warehouseData.location,
      capacity: warehouseData.capacity,
      goods_stored: String(warehouseData.goods_stored),
    }

    try {
      const response = await fetch(`${WAREHOUSE_API_URL}/${warehouseData.warehouse_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorDetails = await response.text()
        throw new Error(errorDetails || 'Failed to update warehouse')
      }

      const updatedWarehouse = await response.json()
      setWarehouses((prevWarehouses) =>
        prevWarehouses.map((warehouse) =>
          warehouse.warehouse_id === updatedWarehouse.warehouse_id ? updatedWarehouse : warehouse,
        ),
      )

      setEditingWarehouse(null)
      setWarehouseData({
        warehouse_id: '',
        name: '',
        location: '',
        capacity: '',
        goods_stored: '',
        customCapacity: '',
      })
      setError(null)
    } catch (err) {
      setError('Failed to update warehouse: ' + err.message)
    }
  }

  const handleGoToWarehouse = (warehouse_id) => {
    navigate(`/warehouseDetail/${warehouse_id}`)
  }

  return (
    <CContainer>
      <h1>Warehouse Management</h1>

      {/* Warehouse Form */}
      <CRow className="mb-4">
        <CCol md="8">
          <h2>{editingWarehouse ? 'Edit Warehouse' : 'Create New Warehouse'}</h2>
          <CForm onSubmit={editingWarehouse ? handleUpdateWarehouse : handleSubmitWarehouse}>
            <div className="mb-3">
              <CFormLabel htmlFor="warehouse_id">Warehouse ID</CFormLabel>
              <CFormInput
                id="warehouse_id"
                name="warehouse_id"
                type="text"
                placeholder="Enter warehouse ID"
                value={warehouseData.warehouse_id}
                onChange={handleChange}
                required
                disabled={editingWarehouse}
              />
            </div>

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
              />
            </div>

            <CButton type="submit" color="primary" className="mt-3">
              {editingWarehouse ? 'Update Warehouse' : 'Create Warehouse'}
            </CButton>
          </CForm>
        </CCol>
      </CRow>

      {/* Warehouse List */}
      <h2>Warehouse List</h2>
      {loading && <CSpinner />}
      {error && <CAlert color="danger">{error}</CAlert>}

      <CListGroup>
        {warehouses.map((warehouse) => (
          <CListGroupItem key={warehouse.warehouse_id}>
            <h4>{warehouse.name}</h4>
            <p>{warehouse.location}</p>
            <p>Capacity: {warehouse.capacity}</p>
            <CButton color="info" onClick={() => handleEditWarehouse(warehouse)}>
              Edit
            </CButton>
            <CButton color="danger" onClick={() => handleDeleteWarehouse(warehouse.warehouse_id)}>
              Delete
            </CButton>
            <CButton color="secondary" onClick={() => handleGoToWarehouse(warehouse.warehouse_id)}>
              Go to Details
            </CButton>
          </CListGroupItem>
        ))}
      </CListGroup>
    </CContainer>
  )
}

export default WarehouseManagement
