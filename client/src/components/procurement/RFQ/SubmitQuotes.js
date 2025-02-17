import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types' // Import PropTypes

const SubmitQuote = ({ rfqId, vendorId }) => {
  const [quoteData, setQuoteData] = useState({
    price: 0,
    deliveryTime: '',
    additionalNotes: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setQuoteData({ ...quoteData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`/api/rfqs/${rfqId}/submit-quote`, {
        vendor: vendorId,
        ...quoteData,
      })
      alert('Quote submitted successfully!')
    } catch (error) {
      alert('Error submitting quote')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        name="price"
        value={quoteData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input
        type="text"
        name="deliveryTime"
        value={quoteData.deliveryTime}
        onChange={handleChange}
        placeholder="Delivery Time"
        required
      />
      <textarea
        name="additionalNotes"
        value={quoteData.additionalNotes}
        onChange={handleChange}
        placeholder="Additional Notes"
      />
      <button type="submit">Submit Quote</button>
    </form>
  )
}

// Add PropTypes validation
SubmitQuote.propTypes = {
  rfqId: PropTypes.string.isRequired,
  vendorId: PropTypes.string.isRequired,
}

export default SubmitQuote
