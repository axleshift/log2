import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function CreateVendorProfile() {
  const [vendor, setVendor] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
    documents: null,
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'documents') {
      setVendor({ ...vendor, documents: files?.[0] || null })
    } else {
      setVendor({ ...vendor, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    const formData = new FormData()
    formData.append('companyName', vendor.companyName)
    formData.append('email', vendor.email)
    formData.append('phone', vendor.phone)
    formData.append('address', vendor.address)
    formData.append('businessType', vendor.businessType)
    if (vendor.documents) {
      formData.append('documents', vendor.documents)
    }

    try {
      const response = await axios.post(`${API_URL}/api/v1/vendors`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage('Vendor profile submitted for review.')
      setVendor({
        companyName: '',
        email: '',
        phone: '',
        address: '',
        businessType: '',
        documents: null,
      })
    } catch (err) {
      setError(err?.response?.data?.error || 'Submission failed.')
    }
  }

  return React.createElement(
    CCard,
    null,
    React.createElement(CCardHeader, null, 'Create Vendor Profile'),
    React.createElement(
      CCardBody,
      null,
      message && React.createElement('div', { className: 'alert alert-success' }, message),
      error && React.createElement('div', { className: 'alert alert-danger' }, error),
      React.createElement(
        CForm,
        { onSubmit: handleSubmit },
        React.createElement(CFormLabel, { htmlFor: 'companyName' }, 'Company Name'),
        React.createElement(CFormInput, {
          name: 'companyName',
          value: vendor.companyName,
          onChange: handleChange,
          required: true,
        }),
        React.createElement(CFormLabel, { htmlFor: 'email' }, 'Email'),
        React.createElement(CFormInput, {
          type: 'email',
          name: 'email',
          value: vendor.email,
          onChange: handleChange,
          required: true,
        }),
        React.createElement(CFormLabel, { htmlFor: 'phone' }, 'Phone'),
        React.createElement(CFormInput, {
          name: 'phone',
          value: vendor.phone,
          onChange: handleChange,
          required: true,
        }),
        React.createElement(CFormLabel, { htmlFor: 'address' }, 'Address'),
        React.createElement(CFormTextarea, {
          name: 'address',
          value: vendor.address,
          onChange: handleChange,
          required: true,
        }),
        React.createElement(CFormLabel, { htmlFor: 'businessType' }, 'Business Type'),
        React.createElement(
          CFormSelect,
          {
            name: 'businessType',
            value: vendor.businessType,
            onChange: handleChange,
            required: true,
          },
          React.createElement('option', { value: '' }, 'Select'),
          React.createElement('option', { value: 'Sole Proprietor' }, 'Sole Proprietor'),
          React.createElement('option', { value: 'Corporation' }, 'Corporation'),
        ),
        React.createElement(CFormLabel, { htmlFor: 'documents' }, 'Upload Business Document'),
        React.createElement(CFormInput, {
          type: 'file',
          name: 'documents',
          accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
          onChange: handleChange,
          required: true,
        }),
        React.createElement(
          'div',
          { className: 'mt-3' },
          React.createElement(CButton, { type: 'submit', color: 'primary' }, 'Submit'),
        ),
      ),
    ),
  )
}

export default CreateVendorProfile
