import { CHeader } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'

const TRACKING_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/tracking`

function TrackingStatus() {
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
    status: 'Pending',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const columns = [
    { name: 'ID', selector: 'id', sortable: true },
    { name: 'Name', selector: 'customerName', sortable: true },
    { name: 'Email', selector: 'email', sortable: true },
    { name: 'Billing Address', selector: 'billingAddress', sortable: true },
    { name: 'Contact Number', selector: 'contactNumber', sortable: true },
    { name: 'Recipient Address', selector: 'recipientAddress', sortable: true },
    { name: 'Recipient Number', selector: 'recipientNumber', sortable: true },
    { name: 'Weight', selector: 'weight', sortable: true },
    { name: 'Paid Amount', selector: 'paidAmount', sortable: true },
    { name: 'Quantity', selector: 'quantity', sortable: true },
    { name: 'Status', selector: 'status', sortable: true },
  ]

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(TRACKING_API_URL)
      const data = await response.json()
      setRecords(data)
      setOriginalRecords(data)
    } catch {
      setError('Failed to fetch records')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setFormData(record)
  }

  const handleUpdate = async () => {
    const { customerName, email } = formData
    if (!customerName || !email) {
      setError('Customer Name and Email are required')
      return
    }
    try {
      await fetch(`${TRACKING_API_URL}/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      await fetchRecords()
      resetForm()
    } catch {
      setError('Failed to update record')
    }
  }

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await fetch(`${TRACKING_API_URL}/${recordId}`, { method: 'DELETE' })
        await fetchRecords()
      } catch {
        setError('Failed to delete record')
      }
    }
  }

  const handleCreate = async () => {
    const {
      customerName,
      email,
      billingAddress,
      contactNumber,
      recipientAddress,
      recipientNumber,
      weight,
      paidAmount,
      quantity,
    } = formData
    if (
      !customerName ||
      !email ||
      !billingAddress ||
      !contactNumber ||
      !recipientAddress ||
      !recipientNumber ||
      !weight ||
      !paidAmount ||
      !quantity
    ) {
      setError('All fields are required')
      return
    }
    try {
      await fetch(TRACKING_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      await fetchRecords()
      resetForm()
    } catch (error) {
      setError(`Failed to create record: ${error.message || 'Unknown error'}`)
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
      status: 'Pending',
    })
    setEditingRecord(null)
    setError(null)
  }

  const handleFilter = ({ target: { value } }) => {
    const filterValue = value.toLowerCase()
    const filteredRecords = originalRecords.filter((record) =>
      record.customerName.toLowerCase().includes(filterValue),
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
            disabled={loading}
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
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            name={key}
            value={formData[key]}
            onChange={handleInputChange}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        ))}
        <button onClick={editingRecord ? handleUpdate : handleCreate}>
          {editingRecord ? 'Save Changes' : 'Create'}
        </button>
      </div>
    </div>
  )
}

export default TrackingStatus
