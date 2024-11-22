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
    type_of_goods: '',
    customCapacity: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingWarehouse, setEditingWarehouse] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const capacityOptions = ['Low', 'Medium', 'Full', 'Custom']

  const capacityMapping = {
    Low: 10,
    Medium: 50,
    Full: 100,
    Custom: (customCapacity) => (customCapacity ? parseInt(customCapacity, 10) : 0), // Handle custom capacity
  }

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
    let lastNumber = 0

    if (lastWarehouse) {
      const parsedId = parseInt(lastWarehouse.warehouse_id.replace('WH', ''), 10)
      if (!isNaN(parsedId)) {
        lastNumber = parsedId
      }
    }

    let newNumber = lastNumber + 1
    return `WH${newNumber.toString().padStart(3, '0')}`
  }

  const handleSubmitWarehouse = async (e) => {
    e.preventDefault()

    // If the capacity is Custom, handle it separately
    let capacity = 0
    if (warehouseData.capacity === 'Custom') {
      // Handle the custom capacity logic
      capacity = warehouseData.customCapacity ? parseInt(warehouseData.customCapacity, 10) : 0
    } else {
      // Use the predefined mapping for Low, Medium, Full
      capacity = capacityMapping[warehouseData.capacity] || 0
    }

    const formData = {
      warehouse_id: generateWarehouseId(),
      name: warehouseData.name,
      location: warehouseData.location,
      capacity: capacity,
      type_of_goods: warehouseData.type_of_goods,
    }

    // Validation check
    if (!formData.name || !formData.location || !formData.capacity || !formData.type_of_goods) {
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
        type_of_goods: '',
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
              <CFormLabel htmlFor="type_of_goods">Type of Goods</CFormLabel>
              <CFormInput
                id="type_of_goods"
                name="type_of_goods"
                type="text"
                placeholder="Enter type of goods stored"
                value={warehouseData.type_of_goods}
                onChange={handleChange}
                required
              />
            </div>

            <CModalFooter>
              <CButton color="secondary" onClick={() => setShowModal(false)}>
                Close
              </CButton>
              <CButton type="submit" color="primary">
                {editingWarehouse ? 'Update Warehouse' : 'Create Warehouse'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
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
            <p>Type of Goods: {warehouse.type_of_goods}</p>
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
