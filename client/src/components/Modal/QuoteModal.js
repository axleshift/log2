import React from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormTextarea,
  CButton,
} from '@coreui/react'

const QuoteModal = ({ visible, onClose, quote, onChange, onSubmit }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Submit Your Quote</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            type="number"
            label="Total Price"
            name="totalPrice"
            value={quote.totalPrice}
            onChange={onChange}
            placeholder="Enter the total price"
            required
          />
          <CFormInput
            type="number"
            label="Quantity"
            name="quantity"
            value={quote.quantity}
            onChange={onChange}
            placeholder="Enter the quantity"
            required
          />
          <CFormInput
            type="text"
            label="Lead Time"
            name="leadTime"
            value={quote.leadTime}
            onChange={onChange}
            placeholder="Enter lead time (e.g., 3 days, 1 week)"
            required
          />
          <CFormTextarea
            label="Terms"
            name="terms"
            value={quote.terms}
            onChange={onChange}
            rows="3"
            placeholder="Enter terms and conditions (optional)"
          />
          <CFormInput
            type="date"
            label="Valid Until"
            name="validUntil"
            value={quote.validUntil}
            onChange={onChange}
            placeholder="Enter validity date"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={onSubmit}>
          Submit Quote
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

QuoteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  quote: PropTypes.shape({
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    leadTime: PropTypes.string.isRequired,
    terms: PropTypes.string,
    validUntil: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default QuoteModal
