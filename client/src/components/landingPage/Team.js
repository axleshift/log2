import React, { useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CButton,
} from '@coreui/react'

const BidDocumentUploader = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    bidderName: '',
    description: '',
    document: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, document: e.target.files[0] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    // Add your upload logic here
    alert('Bid document uploaded successfully!')
  }

  return (
    <CContainer fluid className="h-100 p-5">
      <div className="mt-5 text-center mb-5" data-aos="fade-down">
        <span>BID DOCUMENTS</span>
        <h2 className="text-primary">Upload Your Bid Documents</h2>
      </div>
      <CRow className="justify-content-center">
        <CCol xs={12} md={6}>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="projectName">Project Name</CFormLabel>
              <CFormInput
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="bidderName">Bidder Name</CFormLabel>
              <CFormInput
                type="text"
                id="bidderName"
                name="bidderName"
                value={formData.bidderName}
                onChange={handleChange}
                placeholder="Enter bidder name"
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="description">Description</CFormLabel>
              <CFormTextarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a brief description of the bid"
                rows="4"
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="document">Upload Document</CFormLabel>
              <CFormInput
                type="file"
                id="document"
                name="document"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="text-center">
              <CButton type="submit" color="primary">
                Upload Document
              </CButton>
            </div>
          </CForm>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default BidDocumentUploader
