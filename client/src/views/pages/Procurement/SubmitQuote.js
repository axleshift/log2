import React, { useState } from 'react'
import {
  CButton,
  CTable,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
} from '@coreui/react'

const SubmittedQuotesPage = () => {
  const mockQuotes = [
    { id: 1, vendorName: 'Vendor A', price: 5000, details: '2-week delivery', status: 'Pending' },
    { id: 2, vendorName: 'Vendor B', price: 4800, details: '1-year warranty', status: 'Accepted' },
    { id: 3, vendorName: 'Vendor C', price: 5200, details: 'Extra support', status: 'Rejected' },
  ]

  const [quotes, setQuotes] = useState(mockQuotes)
  const [filteredQuotes, setFilteredQuotes] = useState(mockQuotes)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

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

  const handleStatusChange = (id, status) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)))
    setFilteredQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)))
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
        <thead>
          <tr>
            <th>Vendor Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuotes.map((quote) => (
            <tr key={quote.id}>
              <td>{quote.vendorName}</td>
              <td>${quote.price}</td>
              <td>{quote.status}</td>
              <td>
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
                      onClick={() => handleStatusChange(quote.id, 'Accepted')}
                    >
                      Accept
                    </CButton>
                    <CButton
                      color="danger"
                      className="ms-2"
                      onClick={() => handleStatusChange(quote.id, 'Rejected')}
                    >
                      Reject
                    </CButton>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
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

export default SubmittedQuotesPage
