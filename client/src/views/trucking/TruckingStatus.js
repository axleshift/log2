import { CHeader } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import {
  getTruckingItems,
  createTruckingItem,
  updateTruckingItem,
  deleteTruckingItem,
} from '../../api/truckingService'

function TruckingStatus() {
  const [records, setRecords] = useState([])
  const [originalRecords, setOriginalRecords] = useState([])
  const [editingRecord, setEditingRecord] = useState(null)
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    billingAddress: '',
    contactNumber: '',
    recipientAddress: '',
    recipientNumber: '',
    weight: '',
    paidAmount: '',
    quantity: '',
    status: 'Pending', // Default value
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const columns = [
    { name: 'ID', selector: (row) => row.id, sortable: true },
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    { name: 'Billing Address', selector: (row) => row.billingAddress, sortable: true },
    { name: 'Contact Number', selector: (row) => row.contactNumber, sortable: true },
    { name: 'Recipient Address', selector: (row) => row.recipientAddress, sortable: true },
    { name: 'Recipient Number', selector: (row) => row.recipientNumber, sortable: true },
    { name: 'Weight', selector: (row) => row.weight, sortable: true },
    { name: 'Paid Amount', selector: (row) => row.paidAmount, sortable: true },
    { name: 'Quantity', selector: (row) => row.quantity, sortable: true },
    { name: 'Status', selector: (row) => row.status, sortable: true },
  ]

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const data = await getTruckingItems()
      setRecords(data)
      setOriginalRecords(data)
    } catch (err) {
      setError('Failed to fetch records')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    console.log(`Changing ${name} to ${value}`) // Debugging line
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setFormData(record)
  }

  const handleUpdate = async () => {
    if (!formData.name || !formData.email) {
      setError('Name and Email are required')
      return
    }
    try {
      await updateTruckingItem(formData.id, formData)
      fetchRecords()
      resetForm()
    } catch (error) {
      setError('Failed to update record')
    }
  }

  const handleDelete = async (recordId) => {
    try {
      await deleteTruckingItem(recordId)
      fetchRecords()
    } catch (error) {
      setError('Failed to delete record')
    }
  }

  const handleCreate = async () => {
    console.log('Form Data Before Create:', formData)
    if (
      !formData.name ||
      !formData.email ||
      !formData.billingAddress ||
      !formData.contactNumber ||
      !formData.recipientAddress ||
      !formData.recipientNumber ||
      !formData.weight ||
      !formData.paidAmount ||
      !formData.quantity
    ) {
      setError('All fields are required')
      return
    }
    try {
      await createTruckingItem({ ...formData })
      fetchRecords()
      resetForm()
    } catch (error) {
      console.error('Error creating trucking items', error.response.data)
      setError('Failed to create record: ' + (error.response.data.message || 'Unknown error'))
    }
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      email: '',
      billingAddress: '',
      contactNumber: '',
      recipientAddress: '',
      recipientNumber: '',
      weight: '',
      paidAmount: '',
      quantity: '',
      status: 'Pending', // Reset to default value
    })
    setEditingRecord(null)
    setError(null)
  }

  const handleFilter = (event) => {
    const filterValue = event.target.value.toLowerCase()
    const filteredRecords = originalRecords.filter((record) =>
      record.name.toLowerCase().includes(filterValue),
    )
    setRecords(filteredRecords)
  }

  return (
    <div className="container mt-5">
      <CHeader>
        <div className="text-end">
          <input type="text" onChange={handleFilter} placeholder="Search" />
        </div>
        <div>
          <button
            type="button"
            onClick={editingRecord ? handleUpdate : handleCreate}
            className="btn btn-primary me-2"
          >
            {editingRecord ? 'Update' : '+ Create New'}
          </button>
          {editingRecord && (
            <button type="button" onClick={resetForm} className="btn btn-secondary me-2">
              Cancel
            </button>
          )}
        </div>
      </CHeader>
      {loading ? (
        <p>Loading records...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={records}
          selectableRows
          fixedHeader
          pagination
          onRowClicked={handleEdit}
          selectableRowsOnClick
          onSelectedRowsChange={({ selectedRows }) => {
            if (selectedRows.length) {
              handleDelete(selectedRows[0].id)
            }
          }}
        />
      )}
      <div className="mt-3">
        <h5>{editingRecord ? 'Edit Record' : 'Create New Record'}</h5>
        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          name="billingAddress"
          value={formData.billingAddress}
          onChange={handleInputChange}
          placeholder="Billing Address"
        />
        <input
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          placeholder="Contact Number"
        />
        <input
          name="recipientAddress"
          value={formData.recipientAddress}
          onChange={handleInputChange}
          placeholder="Recipient Address"
        />
        <input
          name="recipientNumber"
          value={formData.recipientNumber}
          onChange={handleInputChange}
          placeholder="Recipient Number"
        />
        <input
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          placeholder="Weight"
        />
        <input
          name="paidAmount"
          value={formData.paidAmount}
          onChange={handleInputChange}
          placeholder="Paid Amount"
        />
        <input
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
        />
        <input
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          placeholder="Status"
        />
        <button onClick={editingRecord ? handleUpdate : handleCreate}>
          {editingRecord ? 'Save Changes' : 'Create'}
        </button>
      </div>
    </div>
  )
}

export default TruckingStatus
