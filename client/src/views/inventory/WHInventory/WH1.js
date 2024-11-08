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
  CFormCheck,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from '@coreui/react'
import axios from 'axios'

const Inventory = () => {
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [inventoryData, setInventoryData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [viewDetailsModal, setViewDetailsModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  // Fetch inventory data based on search query
  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:5058/api/v1/inventory', {
          params: { search: searchQuery }, // Passing search query (tracking_id) to backend
        })
        console.log(response)
        if (Array.isArray(response.data)) {
          setInventoryData(response.data)
        } else {
          setMessage('Unexpected data format received from the server.')
        }
      } catch (error) {
        setMessage('Error fetching inventory data.')
        console.error('Error fetching inventory data:', error)
        if (error.response) {
          console.error('Backend error:', error.response.data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryData()
  }, [searchQuery])

  // Filter the data based on the search query
  const filteredInventory = useMemo(() => {
    return Array.isArray(inventoryData)
      ? inventoryData.filter((item) =>
          item.tracking_id.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : []
  }, [inventoryData, searchQuery])

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked
    setSelectAll(isChecked)

    if (isChecked) {
      setSelectedRows(new Set(inventoryData.map((item) => item.tracking_id))) // Store tracking_id
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleRowCheckChange = (e, tracking_id) => {
    const newSelectedRows = new Set(selectedRows)
    if (e.target.checked) {
      newSelectedRows.add(tracking_id) // Add tracking_id to selectedRows
    } else {
      newSelectedRows.delete(tracking_id)
    }
    setSelectedRows(newSelectedRows)
  }

  const handleDelete = async () => {
    if (selectedRows.size === 0) {
      setMessage('Please select at least one item to delete.')
      return
    }

    // Check if we are deleting a single item or multiple items
    const idsToDelete = Array.from(selectedRows)

    try {
      if (idsToDelete.length === 1) {
        // Single item delete
        const trackingId = idsToDelete[0]
        console.log('Deleting single item with ID:', trackingId)
        const response = await axios.delete(`http://localhost:5058/api/v1/inventory/${trackingId}`)
        console.log('Delete response:', response.data)
      } else {
        // Bulk delete
        console.log('Deleting items with IDs:', idsToDelete)
        const response = await axios.delete('http://localhost:5058/api/v1/inventory/bulk-delete', {
          data: { ids: idsToDelete },
        })
        console.log('Delete response:', response.data)
      }

      // Reset selections and fetch updated data
      setMessage('Selected items deleted successfully.')
      setSelectedRows(new Set())
      setSelectAll(false)
      const inventoryResponse = await axios.get('http://localhost:5058/api/v1/inventory')
      setInventoryData(inventoryResponse.data)
      setDeleteConfirmation(false)
    } catch (error) {
      console.error('Error deleting items:', error)
      setMessage('Error deleting selected items.')
    }
  }

  const handleViewDetails = async (tracking_id) => {
    setLoadingDetails(true)
    try {
      const response = await axios.get(`http://localhost:5058/api/v1/inventory/${tracking_id}`)
      setSelectedItem(response.data)
      setViewDetailsModal(true)
    } catch (error) {
      setMessage('Error fetching inventory data.')
      console.error('Error fetching inventory data:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleCloseModal = () => {
    setViewDetailsModal(false)
    setSelectedItem(null)
  }

  return (
    <CCard>
      <CCardHeader as="h5" style={{ textAlign: 'center', padding: '1rem' }}>
        Warehouse Inventory
      </CCardHeader>
      <CCardBody>
        {message && <div className="alert alert-info">{message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <CInputGroup style={{ maxWidth: '400px', width: '100%' }}>
            <CInputGroupText>Search</CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Search by Tracking ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CInputGroup>

          <div className="d-flex">
            <CButton color="danger" shape="rounded-0" onClick={() => setDeleteConfirmation(true)}>
              Delete
            </CButton>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  <CFormCheck id="selectAll" checked={selectAll} onChange={handleSelectAllChange} />
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Tracking ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Shipment Description</CTableHeaderCell>
                <CTableHeaderCell scope="col">Weight</CTableHeaderCell>
                <CTableHeaderCell scope="col">Dimensions</CTableHeaderCell>
                <CTableHeaderCell scope="col">Volume</CTableHeaderCell>
                <CTableHeaderCell scope="col">Value</CTableHeaderCell>
                <CTableHeaderCell scope="col">Warehouse Location</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <CTableRow key={item.tracking_id}>
                    <CTableDataCell>
                      <CFormCheck
                        id={`row${item.tracking_id}`}
                        checked={selectedRows.has(item.tracking_id)}
                        onChange={(e) => handleRowCheckChange(e, item.tracking_id)}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{item.tracking_id}</CTableDataCell>
                    <CTableDataCell>{item.shipment.shipment_description}</CTableDataCell>
                    <CTableDataCell>{item.shipment.shipment_weight} kg</CTableDataCell>
                    <CTableDataCell>
                      {item.shipment.shipment_dimension_length} x{' '}
                      {item.shipment.shipment_dimension_width} x{' '}
                      {item.shipment.shipment_dimension_height} m
                    </CTableDataCell>
                    <CTableDataCell>{item.shipment.shipment_volume} m³</CTableDataCell>
                    <CTableDataCell>${item.shipment.shipment_value}</CTableDataCell>
                    <CTableDataCell>{item.warehouse.destination}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="info" onClick={() => handleViewDetails(item.tracking_id)}>
                        View Details
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="8" style={{ textAlign: 'center' }}>
                    No inventory records found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      {/* Modal for View Details */}
      <CModal visible={viewDetailsModal} onClose={handleCloseModal}>
        <CModalHeader>
          <CModalTitle>Item Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {loadingDetails ? (
            <div>Loading details...</div>
          ) : (
            selectedItem && (
              <div>
                <h5>Shipment Details</h5>
                <p>
                  <strong>Tracking ID:</strong> {selectedItem.tracking_id}
                </p>
                <p>
                  <strong>Shipment Description:</strong>{' '}
                  {selectedItem.shipment.shipment_description}
                </p>
                <p>
                  <strong>Weight:</strong> {selectedItem.shipment.shipment_weight} kg
                </p>
                <p>
                  <strong>Dimensions:</strong> {selectedItem.shipment.shipment_dimension_length} x{' '}
                  {selectedItem.shipment.shipment_dimension_width} x{' '}
                  {selectedItem.shipment.shipment_dimension_height} m
                </p>
                <p>
                  <strong>Volume:</strong> {selectedItem.shipment.shipment_volume} m³
                </p>
                <p>
                  <strong>Value:</strong> ${selectedItem.shipment.shipment_value}
                </p>
                <p>
                  <strong>Instructions:</strong> {selectedItem.shipment.shipment_instructions}
                </p>

                <h5>Shipping Details</h5>
                <p>
                  <strong>Shipping Method:</strong> {selectedItem.shipping.shipping_type}
                </p>

                {/* Display shipping-specific details */}
                {selectedItem.shipping.shipping_type === 'air' && (
                  <div>
                    <h6>Air Shipping</h6>
                    <p>
                      <strong>Origin Airport:</strong>{' '}
                      {selectedItem.shipping.details.air.origin_airport}
                    </p>
                    <p>
                      <strong>Destination Airport:</strong>{' '}
                      {selectedItem.shipping.details.air.destination_airport}
                    </p>
                    <p>
                      <strong>Preferred Departure Date:</strong>{' '}
                      {new Date(
                        selectedItem.shipping.details.air.preferred_departure_date,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Preferred Arrival Date:</strong>{' '}
                      {new Date(
                        selectedItem.shipping.details.air.preferred_arrival_date,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Flight Type:</strong> {selectedItem.shipping.details.air.flight_type}
                    </p>
                  </div>
                )}

                {selectedItem.shipping.shipping_type === 'land' && (
                  <div>
                    <h6>Land Shipping</h6>
                    <p>
                      <strong>Origin Address:</strong>{' '}
                      {selectedItem.shipping.details.land.origin_address}
                    </p>
                    <p>
                      <strong>Destination Address:</strong>{' '}
                      {selectedItem.shipping.details.land.destination_address}
                    </p>
                    <p>
                      <strong>Pickup Date:</strong>{' '}
                      {new Date(
                        selectedItem.shipping.details.land.pickup_date,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Delivery Date:</strong>{' '}
                      {new Date(
                        selectedItem.shipping.details.land.delivery_date,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Vehicle Type:</strong>{' '}
                      {selectedItem.shipping.details.land.vehicle_type}
                    </p>
                  </div>
                )}

                {selectedItem.shipping.shipping_type === 'sea' && (
                  <div>
                    <h6>Sea Shipping</h6>
                    <p>
                      <strong>Loading Port:</strong>{' '}
                      {selectedItem.shipping.details.sea.loading_port}
                    </p>
                    <p>
                      <strong>Discharge Port:</strong>{' '}
                      {selectedItem.shipping.details.sea.discharge_port}
                    </p>
                    <p>
                      <strong>Sailing Date:</strong>{' '}
                      {new Date(
                        selectedItem.shipping.details.sea.sailing_date,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Estimated Arrival Date:</strong>{' '}
                      {new Date(
                        selectedItem.shipping.details.sea.estimated_arrival_date,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Cargo Type:</strong> {selectedItem.shipping.details.sea.cargo_type}
                    </p>
                  </div>
                )}

                <h5>Warehouse Details</h5>
                <p>
                  <strong>Warehouse ID:</strong> {selectedItem.warehouse.warehouse_id}
                </p>
                <p>
                  <strong>Warehouse Destination:</strong> {selectedItem.warehouse.destination}
                </p>
                <p>
                  <strong>Release Date/Time:</strong>{' '}
                  {new Date(selectedItem.warehouse.date_time_release).toLocaleString()}
                </p>
                <p>
                  <strong>Estimated Received Date/Time:</strong>{' '}
                  {new Date(selectedItem.warehouse.estimated_date_time_received).toLocaleString()}
                </p>
                <p>
                  <strong>Courier:</strong> {selectedItem.warehouse.courier}
                </p>
              </div>
            )
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteConfirmation} onClose={() => setDeleteConfirmation(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete the selected items?</CModalBody>
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
