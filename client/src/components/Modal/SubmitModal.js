import React, { useState } from 'react'
import PropTypes from 'prop-types' // Import PropTypes
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import axios from 'axios'

const SubmitQuoteModal = ({ rfq, vendorId, onClose, onSuccess }) => {
  const [quoteDetails, setQuoteDetails] = useState(
    rfq.products.map((product) => ({
      product: product.name,
      pricePerUnit: '',
      deliveryTime: '',
    })),
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (index, field, value) => {
    const updatedQuotes = [...quoteDetails]
    updatedQuotes[index][field] = value
    setQuoteDetails(updatedQuotes)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/rfq/${rfq._id}/submit-quote`,
        {
          vendorId,
          quoteDetails,
        },
      )
      onSuccess(response.data)
      onClose()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit quote.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal visible onClose={onClose} backdrop="static">
      <CModalHeader>
        <CModalTitle>Submit Quote for {rfq.procurementId?.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {quoteDetails.map((quote, index) => (
            <div key={index} className="mb-3">
              <CFormLabel>{quote.product}</CFormLabel>
              <CFormInput
                type="number"
                placeholder="Price Per Unit"
                value={quote.pricePerUnit}
                onChange={(e) => handleChange(index, 'pricePerUnit', e.target.value)}
              />
              <CFormInput
                type="text"
                placeholder="Delivery Time"
                value={quote.deliveryTime}
                onChange={(e) => handleChange(index, 'deliveryTime', e.target.value)}
              />
            </div>
          ))}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Quote'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

// Add PropTypes validation
SubmitQuoteModal.propTypes = {
  rfq: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
    procurementId: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
  vendorId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

export default SubmitQuoteModal
