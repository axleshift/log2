import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL
const QUOTE_API_URL = `${API_URL}/api/v1/vendor-quotes`

const VendorQuotes = () => {
  const { accessToken } = useAuth()
  const [quotes, setQuotes] = useState([])
  const [filteredQuotes, setFilteredQuotes] = useState([])
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const fetchQuotes = async () => {
    try {
      const res = await axios.get(QUOTE_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setQuotes(res.data)
      setFilteredQuotes(res.data)
    } catch (err) {
      console.error('Failed to fetch vendor quotes')
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  const handleFilterChange = (value) => {
    setFilter(value)
    setFilteredQuotes(value === 'All' ? quotes : quotes.filter((q) => q.status === value))
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setFilteredQuotes(
      quotes.filter((q) => q.vendorName.toLowerCase().includes(e.target.value.toLowerCase())),
    )
  }

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `${QUOTE_API_URL}/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      fetchQuotes()
    } catch (err) {
      console.error('Failed to update status')
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="mb-4 fw-bold">RFQ Details – Submitted Quotes</h1>
      <div className="d-flex justify-content-between mb-3">
        <CFormSelect value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </CFormSelect>
        <CFormInput placeholder="Search Vendor" value={search} onChange={handleSearchChange} />
      </div>

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Vendor Name</CTableHeaderCell>
            <CTableHeaderCell>Price</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredQuotes.map((quote) => (
            <CTableRow key={quote._id}>
              <CTableDataCell>{quote.vendorName}</CTableDataCell>
              <CTableDataCell>${quote.price}</CTableDataCell>
              <CTableDataCell>{quote.status}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="info"
                  onClick={() => {
                    setSelectedQuote(quote)
                    setModalVisible(true)
                  }}
                >
                  View
                </CButton>
                {quote.status === 'Pending' && (
                  <>
                    <CButton
                      color="success"
                      className="ms-2"
                      onClick={() => handleStatusChange(quote._id, 'Accepted')}
                    >
                      Accept
                    </CButton>
                    <CButton
                      color="danger"
                      className="ms-2"
                      onClick={() => handleStatusChange(quote._id, 'Rejected')}
                    >
                      Reject
                    </CButton>
                  </>
                )}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>Quote Details</CModalHeader>
        <CModalBody>
          {selectedQuote && (
            <>
              <p>
                <strong>Vendor:</strong> {selectedQuote.vendorName}
              </p>
              <p>
                <strong>Price:</strong> ${selectedQuote.price}
              </p>
              <p>
                <strong>Details:</strong> {selectedQuote.details}
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default VendorQuotes
