import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react'

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([])
  const [modal, setModal] = useState(false)
  const [currentWarehouse, setCurrentWarehouse] = useState(null)
  const [warehouseName, setWarehouseName] = useState('')
  const [warehouseLocation, setWarehouseLocation] = useState('')
  const [goodsToBeStored, setGoodsToBeStored] = useState('')
  const [warehouseCapacity, setWarehouseCapacity] = useState('')
  const [alert, setAlert] = useState('')

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get('http://localhost:5058/api/v1/warehouse')
        setWarehouses(response.data)
      } catch (error) {
        console.error('Error fetching warehouse data:', error)
        setAlert('Failed to fetch warehouse data.')
      }
    }
    fetchWarehouses()
  }, [])

  const toggleModal = () => {
    setModal(!modal)
    setWarehouseName('')
    setWarehouseLocation('')
    setGoodsToBeStored('')
    setWarehouseCapacity('')
    setCurrentWarehouse(null)
  }

  // Handle warehouse creation and update
  const handleSubmit = async () => {
    if (!warehouseName || !warehouseLocation || !goodsToBeStored || !warehouseCapacity) {
      setAlert('Please fill out all fields.')
      return
    }

    setAlert('')

    const warehouseData = {
      name: warehouseName,
      location: warehouseLocation,
      goods: goodsToBeStored,
      capacity: warehouseCapacity,
    }

    try {
      if (currentWarehouse) {
        // Update existing warehouse
        const updatedWarehouse = await axios.put(
          `http://localhost:5058/api/v1/warehouse/${currentWarehouse.warehouse_id}`,
          warehouseData,
        )
        setWarehouses((prevWarehouses) =>
          prevWarehouses.map((warehouse) =>
            warehouse.warehouse_id === currentWarehouse.warehouse_id
              ? updatedWarehouse.data
              : warehouse,
          ),
        )
        setAlert('Warehouse updated successfully.')
      } else {
        // Create new warehouse
        const response = await axios.post('http://localhost:5058/api/v1/warehouse', warehouseData)

        if (response.data && response.data.warehouse) {
          setWarehouses([...warehouses, response.data.warehouse])
          setAlert('Warehouse created successfully.')
        } else {
          setAlert('Failed to create warehouse. Please try again.')
        }
      }

      toggleModal()
    } catch (error) {
      console.error('Error creating/updating warehouse:', error)
      setAlert('Failed to save warehouse data.')
    }
  }

  const editWarehouse = (warehouse) => {
    setCurrentWarehouse(warehouse)
    setWarehouseName(warehouse.name)
    setWarehouseLocation(warehouse.location)
    setGoodsToBeStored(warehouse.goods)
    setWarehouseCapacity(warehouse.capacity)
    setModal(true)
  }

  const deleteWarehouse = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await axios.delete(`http://localhost:5058/api/v1/warehouse/${id}`)
        setWarehouses((prevWarehouses) =>
          prevWarehouses.filter((warehouse) => warehouse.warehouse_id !== id),
        )
        setAlert('Warehouse deleted successfully.')
      } catch (error) {
        console.error('Error deleting warehouse:', error)
        setAlert('Failed to delete warehouse.')
      }
    }
  }

  return (
    <>
      <CButton color="primary" onClick={toggleModal} className="mb-3">
        Add Warehouse
      </CButton>
      {alert && <CAlert color="danger">{alert}</CAlert>}

      <CRow>
        {warehouses.map((warehouse) => (
          <CCol sm="6" key={warehouse.warehouse_id}>
            <CCard>
              <CCardHeader>
                <h5>{warehouse.name}</h5>
              </CCardHeader>
              <CCardBody>
                <p>Location: {warehouse.location}</p>
                <p>Goods Stored: {warehouse.goods}</p>
                <p>Capacity: {warehouse.capacity}</p>
                <CButton color="warning" onClick={() => editWarehouse(warehouse)} className="me-2">
                  Edit
                </CButton>
                <CButton color="danger" onClick={() => deleteWarehouse(warehouse.warehouse_id)}>
                  Delete
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Modal for Add/Edit Warehouse */}
      <CModal show={modal} onClose={toggleModal}>
        <CModalHeader closeButton>
          <CModalTitle>{currentWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            <label htmlFor="warehouseName">Warehouse Name</label>
            <input
              type="text"
              id="warehouseName"
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              className="form-control"
            />
          </div>
          <div>
            <label htmlFor="warehouseLocation">Location</label>
            <input
              type="text"
              id="warehouseLocation"
              value={warehouseLocation}
              onChange={(e) => setWarehouseLocation(e.target.value)}
              className="form-control"
            />
          </div>
          <div>
            <label htmlFor="goodsToBeStored">Goods to be Stored</label>
            <input
              type="text"
              id="goodsToBeStored"
              value={goodsToBeStored}
              onChange={(e) => setGoodsToBeStored(e.target.value)}
              className="form-control"
            />
          </div>
          <div>
            <label htmlFor="warehouseCapacity">Capacity</label>
            <input
              type="text"
              id="warehouseCapacity"
              value={warehouseCapacity}
              onChange={(e) => setWarehouseCapacity(e.target.value)}
              className="form-control"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleModal}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            {currentWarehouse ? 'Update' : 'Add'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default WarehouseManagement
