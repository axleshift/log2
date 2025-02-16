import React from 'react'
import { useState } from 'react'
import { CForm, CFormInput, CFormTextarea, CButton } from '@coreui/react'
import axios from 'axios'

const RFQ_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/rfq`

const CreateRFQ = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    budget: '',
    deadline: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(RFQ_API_URL, formData)
      alert('RFQ Created Successfully!')
      setFormData({
        title: '',
        description: '',
        quantity: '',
        budget: '',
        deadline: '',
      })
    } catch (error) {
      alert('Failed to create RFQ: ' + error.message)
    }
  }

  return (
    <div className="container">
      <h2 className="my-4">Create RFQ</h2>
      <CForm onSubmit={handleSubmit}>
        <CFormInput
          type="text"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <CFormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="3"
          required
        />
        <CFormInput
          type="number"
          label="Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          required
        />
        <CFormInput
          type="number"
          label="Budget"
          name="budget"
          value={formData.budget}
          onChange={handleInputChange}
          required
        />
        <CFormInput
          type="date"
          label="Deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleInputChange}
          required
        />
        <CButton type="submit" color="primary" className="mt-3">
          Create RFQ
        </CButton>
      </CForm>
    </div>
  )
}

export default CreateRFQ
