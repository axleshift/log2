import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CForm,
  CFormInput,
  CFormTextarea,
  CModalFooter,
  CButton,
  CSpinner,
} from '@coreui/react'
import axios from 'axios'
import PropTypes from 'prop-types'

const API_BASE_URL = import.meta.env.VITE_API_URL
const RFQ_API_URL = `${API_BASE_URL}/api/v1/rfq`

const SubmitQuoteModal = ({ visible, onClose, rfqId, vendorId }) => {
  const [quoteForm, setQuoteForm] = useState({
    price: '',
    deliveryTime: '',
    additionalNotes: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    if (!quoteForm.price || !quoteForm.deliveryTime) {
      setErrorMessage('Please fill in all required fields.')
      setIsSubmitting(false)
      return
    }

    if (!vendorId) {
      setErrorMessage('Vendor ID is missing.')
      setIsSubmitting(false)
      return
    }

    const quotePayload = {
      ...quoteForm,
      vendor: vendorId,
    }

    try {
      console.log('Submitting quote:', quotePayload)
      const response = await axios.post(`${RFQ_API_URL}/${rfqId}/submit-quotes`, quotePayload)
      console.log('Quote Submitted:', response.data)

      if (response.data && response.data.message === 'Quote submitted successfully') {
        onClose()
      } else {
        setErrorMessage('Unexpected response from server.')
      }
    } catch (err) {
      console.error('Error submitting quote:', err)
      setErrorMessage('Failed to submit the quote. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <h5>Submit Quote</h5>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleQuoteSubmit}>
          <CFormInput
            type="number"
            label="Price"
            value={quoteForm.price}
            onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
            required
          />
          <CFormInput
            type="text"
            label="Delivery Time"
            value={quoteForm.deliveryTime}
            onChange={(e) => setQuoteForm({ ...quoteForm, deliveryTime: e.target.value })}
            required
          />
          <CFormTextarea
            label="Additional Notes"
            value={quoteForm.additionalNotes}
            onChange={(e) => setQuoteForm({ ...quoteForm, additionalNotes: e.target.value })}
          />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <CModalFooter>
            <CButton color="secondary" onClick={onClose}>
              Cancel
            </CButton>
            <CButton type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CSpinner size="sm" /> : 'Submit Quote'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

SubmitQuoteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rfqId: PropTypes.string.isRequired,
  vendorId: PropTypes.string.isRequired,
}

export default SubmitQuoteModal
