import React, { useState, useEffect } from 'react'
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
  CFormCheck,
  CTableRow,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import axios from 'axios'

const Inventory = () => {
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [inventoryData, setInventoryData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get('http://localhost:5058/api/inventory')
        setInventoryData(response.data)
      } catch (error) {
        console.error('Error fetching inventory data:', error)
      }
    }

    fetchInventoryData()
  }, [])

  const handleSelectAllChange = (e) => {
    setSelectAll(e.target.checked)
    if (e.target.checked) {
      setSelectedRows(new Set(inventoryData.map((_, i) => i)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleRowCheckChange = (e, index) => {
    if (e.target.checked) {
      selectedRows.add(index)
    } else {
      selectedRows.delete(index)
    }
    setSelectedRows(new Set(selectedRows))
  }

  const filteredInventory = inventoryData.filter((item) =>
    item.shipment.shipment_description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <CCard>
      <CCardHeader as="h5" style={{ textAlign: 'center' }}>
        Warehouse Inventory 3
      </CCardHeader>
      <CCardBody>
        <CInputGroup className="mb-3">
          <CInputGroupText id="basic-addon1">Search</CInputGroupText>
          <CFormInput
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          &nbsp;&nbsp;
          <CButton color="primary" shape="rounded-0">
            Search
          </CButton>
          &nbsp;
          <CButton color="primary" shape="rounded-0">
            Delete
          </CButton>
        </CInputGroup>

        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">
                <CFormCheck id="selectAll" checked={selectAll} onChange={handleSelectAllChange} />
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">Shipment Description</CTableHeaderCell>
              <CTableHeaderCell scope="col">Weight</CTableHeaderCell>
              <CTableHeaderCell scope="col">Dimensions</CTableHeaderCell>
              <CTableHeaderCell scope="col">Volume</CTableHeaderCell>
              <CTableHeaderCell scope="col">Value</CTableHeaderCell>
              <CTableHeaderCell scope="col">Warehouse Location</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item, index) => (
                <CTableRow key={item._id}>
                  <CTableDataCell>
                    <CFormCheck
                      id={`row${index}`}
                      checked={selectedRows.has(index)}
                      onChange={(e) => handleRowCheckChange(e, index)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{item.shipment.shipment_description}</CTableDataCell>
                  <CTableDataCell>{item.shipment.shipment_weight} kg</CTableDataCell>
                  <CTableDataCell>
                    {item.shipment.shipment_dimension_length} x{' '}
                    {item.shipment.shipment_dimension_width} x{' '}
                    {item.shipment.shipment_dimension_height} m
                  </CTableDataCell>
                  <CTableDataCell>{item.shipment.shipment_volume} m³</CTableDataCell>
                  <CTableDataCell>${item.shipment.shipment_value}</CTableDataCell>
                  <CTableDataCell>{item.warehouse_location}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="7" style={{ textAlign: 'center' }}>
                  No inventory records found.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default Inventory
