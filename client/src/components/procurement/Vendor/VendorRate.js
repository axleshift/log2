import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react'

const VendorProfile = ({ vendorId }) => {
  const [rating, setRating] = useState('')
  const [review, setReview] = useState('')

  const handleRatingSubmit = () => {
    console.log(`Rating for vendor ${vendorId}: ${rating}`)
    console.log(`Review for vendor ${vendorId}: ${review}`)
  }

  return (
    <CCard>
      <CCardHeader>Vendor Profile</CCardHeader>
      <CCardBody>
        <CForm>
          <CFormLabel htmlFor="rating">Rating</CFormLabel>
          <CFormInput
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
          />
        </CForm>
        <CForm>
          <CFormLabel htmlFor="review">Review</CFormLabel>
          <textarea
            id="review"
            rows="4"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="form-control"
          />
        </CForm>
        <CButton color="primary" onClick={handleRatingSubmit}>
          Submit Rating & Review
        </CButton>
      </CCardBody>
    </CCard>
  )
}

VendorProfile.propTypes = {
  vendorId: PropTypes.string.isRequired,
}

export default VendorProfile
