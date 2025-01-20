import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CForm, CFormInput, CFormTextarea, CButton } from '@coreui/react'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here (e.g., send to backend or API)
    console.log('Form Data:', formData)
    alert('Thank you for contacting us!')
    setFormData({ name: '', email: '', message: '' }) // Clear the form
  }

  return (
    <CContainer className="py-5">
      <CButton color="secondary" className="mb-4" onClick={() => navigate(-1)}>
        Back
      </CButton>
      <h2 className="text-center mb-4">Contact Us</h2>
      <CRow className="g-4">
        {/* Contact Information */}
        <CCol md={6}>
          <h4>Get in Touch</h4>
          <p>If you have any questions, feel free to reach out to us. We&apos;re here to help!</p>

          <p>
            <strong>Address:</strong> 123 Business St, Quezon City, Philippines
          </p>
          <p>
            <strong>Email:</strong> support@trendyclicks.com
          </p>
          <p>
            <strong>Phone:</strong> +63 912 345 6789
          </p>
        </CCol>

        {/* Contact Form */}
        <CCol md={6}>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="mb-3"
              required
            />
            <CFormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="mb-3"
              required
            />
            <CFormTextarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              className="mb-3"
              required
            />
            <CButton type="submit" color="primary" className="me-2">
              Submit
            </CButton>
          </CForm>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ContactUs
