import React, { useState } from 'react'
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
  const [warehouses, setWarehouses] = useState([
    {
      id: 1,
      name: 'Warehouse 1',
      location: 'North Zone',
      goods: 'Electronics',
      capacity: 'Full',
      shipments: 30,
    },
    {
      id: 2,
      name: 'Warehouse 2',
      location: 'South Zone',
      goods: 'Furniture',
      capacity: 'Available',
      shipments: 15,
    },
  ])

  const [modal, setModal] = useState(false)
  const [currentWarehouse, setCurrentWarehouse] = useState(null)
  const [warehouseName, setWarehouseName] = useState('')
  const [warehouseLocation, setWarehouseLocation] = useState('')
  const [goodsToBeStored, setGoodsToBeStored] = useState('')
  const [warehouseCapacity, setWarehouseCapacity] = useState('')
  const [alert, setAlert] = useState('')

  const toggleModal = () => {
    setModal(!modal)
    setWarehouseName('')
    setWarehouseLocation('')
    setGoodsToBeStored('')
    setWarehouseCapacity('')
    setCurrentWarehouse(null)
  }

  const handleSubmit = () => {
    if (!warehouseName || !warehouseLocation || !goodsToBeStored || !warehouseCapacity) {
      setAlert('Please fill out all fields.')
      return
    }

    setAlert('')

    if (currentWarehouse) {
      setWarehouses(
        warehouses.map((warehouse) =>
          warehouse.id === currentWarehouse.id
            ? {
                ...warehouse,
                name: warehouseName,
                location: warehouseLocation,
                goods: goodsToBeStored,
                capacity: warehouseCapacity,
              }
            : warehouse,
        ),
      )
    } else {
      const newWarehouse = {
        id: warehouses.length + 1,
        name: warehouseName,
        location: warehouseLocation,
        goods: goodsToBeStored,
        capacity: warehouseCapacity,
        shipments: 0,
      }
      setWarehouses([...warehouses, newWarehouse])
    }
    toggleModal()
  }

  const editWarehouse = (warehouse) => {
    setCurrentWarehouse(warehouse)
    setWarehouseName(warehouse.name)
    setWarehouseLocation(warehouse.location)
    setGoodsToBeStored(warehouse.goods)
    setWarehouseCapacity(warehouse.capacity)
    setModal(true)
  }

  const deleteWarehouse = (id) => {
    const updatedWarehouses = warehouses.filter((warehouse) => warehouse.id !== id)
    setWarehouses(updatedWarehouses)
    setAlert('Warehouse deleted successfully.')
  }

  return (
    <>
      <CButton color="primary" onClick={toggleModal} className="mb-3">
        Add Warehouse
      </CButton>
      {alert && <CAlert color="danger">{alert}</CAlert>}
      <CRow>
        {warehouses.map((warehouse) => (
          <CCol sm="6" key={warehouse.id}>
            <CCard>
              <CCardHeader>
                <h5>{warehouse.name}</h5>
              </CCardHeader>
              <CCardBody>
                <p>Location: {warehouse.location}</p>
                <p>Goods Stored: {warehouse.goods}</p>
                <p>Capacity: {warehouse.capacity}</p>
                <p>Shipments Stored: {warehouse.shipments}</p>
                <CButton color="warning" onClick={() => editWarehouse(warehouse)} className="me-2">
                  Edit
                </CButton>
                <CButton color="danger" onClick={() => deleteWarehouse(warehouse.id)}>
                  Delete
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

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
