import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

const RFQ_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/rfq`

const SubmitQuoteForm = ({ vendorId }) => {
  const { id } = useParams()
  const [rfq, setRfq] = useState(null)
  const [price, setPrice] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [isInvited, setIsInvited] = useState(false)

  useEffect(() => {
    if (!id) {
      console.error('RFQ ID is missing.')
      return
    }

    const fetchRFQDetails = async () => {
      try {
        console.log('Fetching RFQ with ID:', id)
        const response = await axios.get(`${RFQ_API_URL}/${id}`)
        console.log('RFQ Details Response:', response.data)

        setRfq(response.data)

        if (response.data.vendors && Array.isArray(response.data.vendors)) {
          if (response.data.vendors.some((vendor) => vendor._id === vendorId)) {
            setIsInvited(true)
          }
        } else {
          console.error('Vendors field is missing or not an array.')
        }
      } catch (error) {
        console.error('Error fetching RFQ details:', error)
      }
    }

    fetchRFQDetails()
  }, [id, vendorId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isInvited) {
      alert('You are not invited to submit a quote for this RFQ.')
      return
    }

    try {
      const response = await axios.post(`${RFQ_API_URL}/${id}/submit-quotes`, {
        vendor: vendorId,
        price,
        deliveryTime,
        additionalNotes,
      })

      alert(response.data.message)
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert(error.response?.data?.error || 'Error submitting quote.')
    }
  }

  if (!rfq) return <div>Loading RFQ details...</div>
  if (!isInvited) return <div>You are not invited to submit a quote for this RFQ.</div>

  return (
    <div>
      <h3>Submit a Quote for {rfq.title}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Delivery Time:</label>
          <input
            type="text"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Additional Notes:</label>
          <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
        </div>
        <button type="submit">Submit Quote</button>
      </form>
    </div>
  )
}

SubmitQuoteForm.propTypes = {
  vendorId: PropTypes.string.isRequired, // Add vendorId prop validation here
}

export default SubmitQuoteForm
