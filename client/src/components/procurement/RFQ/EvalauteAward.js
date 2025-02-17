import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types' // Import PropTypes

const EvaluateAndAward = ({ rfqId }) => {
  const [rfq, setRfq] = useState(null)
  const [awardedVendor, setAwardedVendor] = useState('')

  useEffect(() => {
    const fetchRFQ = async () => {
      const response = await axios.get(`/api/rfqs/${rfqId}`)
      setRfq(response.data)
    }
    fetchRFQ()
  }, [rfqId])

  const handleAward = async () => {
    try {
      await axios.put(`/api/rfqs/${rfqId}/award`, { awardedVendor })
      alert('Vendor awarded the contract!')
    } catch (error) {
      alert('Error awarding vendor')
    }
  }

  return (
    <div>
      {rfq && (
        <div>
          <h3>Evaluate Quotes</h3>
          {rfq.quotes.map((quote) => (
            <div key={quote._id}>
              <p>Vendor: {quote.vendor.name}</p>
              <p>Price: {quote.price}</p>
              <p>Delivery Time: {quote.deliveryTime}</p>
              <button onClick={() => setAwardedVendor(quote.vendor._id)}>Select this Vendor</button>
            </div>
          ))}
          <button onClick={handleAward}>Award Vendor</button>
        </div>
      )}
    </div>
  )
}

// Add PropTypes validation
EvaluateAndAward.propTypes = {
  rfqId: PropTypes.string.isRequired,
}

export default EvaluateAndAward
