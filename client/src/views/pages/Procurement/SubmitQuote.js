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
  CSpinner,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
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
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '', color: '' })

  useEffect(() => {
    fetchQuotes()
  }, [])

  useEffect(() => {
    filterAndSearchQuotes()
  }, [quotes, filter, search])

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const res = await axios.get(QUOTE_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setQuotes(res.data)
    } catch (err) {
      console.error('Failed to fetch vendor quotes', err)
      showToast('Failed to fetch vendor quotes', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSearchQuotes = () => {
    let result = [...quotes]
    if (filter !== 'All') {
      result = result.filter((q) => q.status === filter)
    }
    if (search.trim()) {
      const searchTerm = search.toLowerCase()
      result = result.filter((q) =>
        (q.vendorId?.businessName || q.vendorId?.fullName || '').toLowerCase().includes(searchTerm),
      )
    }
    setFilteredQuotes(result)
  }

  const showToast = (message, color = 'success') => {
    setToast({ visible: true, message, color })
  }

  const handleStatusChange = async (quoteId, newStatus) => {
    setActionLoadingId(quoteId)
    try {
      await axios.put(
        `${QUOTE_API_URL}/${quoteId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      await fetchQuotes()
      showToast(`Quote ${newStatus.toLowerCase()} successfully!`)
    } catch (err) {
      console.error('Failed to update status', err)
      showToast('Failed to update status', 'danger')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeleteQuote = async (id) => {
    try {
      await axios.delete(`${QUOTE_API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setQuotes((prev) => prev.filter((q) => q._id !== id))
      showToast('Quote deleted successfully!')
    } catch (err) {
      console.error('Failed to delete quote', err)
      showToast('Failed to delete quote', 'danger')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="mb-4 fw-bold">RFQ Details – Submitted Quotes</h1>
      <div className="d-flex justify-content-between mb-3">
        <CFormSelect
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </CFormSelect>
        <CFormInput
          placeholder="Search Vendor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      {loading ? (
        <div className="text-center my-5">
          <CSpinner />
          <div>Loading quotes...</div>
        </div>
      ) : (
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
            {filteredQuotes.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={4} className="text-center">
                  No quotes found.
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredQuotes.map((quote) => (
                <CTableRow key={quote._id}>
                  <CTableDataCell>
                    {quote.vendorId?.businessName || quote.vendorId?.fullName || 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>{Number(quote.price).toLocaleString()}</CTableDataCell>
                  <CTableDataCell>{quote.status}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      onClick={() => {
                        setSelectedQuote(quote)
                        setModalVisible(true)
                      }}
                      disabled={actionLoadingId === quote._id}
                    >
                      View
                    </CButton>
                    {quote.status === 'Pending' && (
                      <>
                        <CButton
                          color="success"
                          className="ms-2"
                          onClick={() => handleStatusChange(quote._id, 'Accepted')}
                          disabled={actionLoadingId === quote._id}
                        >
                          {actionLoadingId === quote._id ? <CSpinner size="sm" /> : 'Accept'}
                        </CButton>
                        <CButton
                          color="danger"
                          className="ms-2"
                          onClick={() => handleStatusChange(quote._id, 'Rejected')}
                          disabled={actionLoadingId === quote._id}
                        >
                          {actionLoadingId === quote._id ? <CSpinner size="sm" /> : 'Reject'}
                        </CButton>
                      </>
                    )}
                    <CButton
                      color="danger"
                      className="ms-2"
                      onClick={() => handleDeleteQuote(quote._id)}
                      disabled={actionLoadingId === quote._id}
                    >
                      {actionLoadingId === quote._id ? <CSpinner size="sm" /> : 'Delete'}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      )}

      {/* Quote Details Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>Quote Details</CModalHeader>
        <CModalBody>
          {selectedQuote && (
            <>
              <p>
                <strong>Vendor:</strong>{' '}
                {selectedQuote.vendorId?.businessName || selectedQuote.vendorId?.fullName || 'N/A'}
              </p>
              <p>
                <strong>Price:</strong>
                {Number(selectedQuote.price).toLocaleString()}
              </p>
              <p>
                <strong>Details:</strong> {selectedQuote.details || 'No details provided.'}
              </p>
              <p>
                <strong>Lead Time:</strong> {selectedQuote.leadTime || 'No lead time specified.'}
              </p>
              <p>
                <strong>Terms:</strong> {selectedQuote.terms || 'No terms specified.'}
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

      {/* Toast Notification */}
      <CToaster placement="top-end">
        {toast.visible && (
          <CToast
            color={toast.color}
            autohide={true}
            delay={3000}
            show={toast.visible}
            fade={true}
            onClose={() => setToast({ visible: false, message: '', color: '' })}
          >
            <CToastHeader>{toast.color === 'danger' ? 'Error' : 'Success'}</CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>
    </div>
  )
}

export default VendorQuotes
