import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
} from '@coreui/react'

const defaultInvoice = {
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  customer: {
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    contact: {
      phone: '',
      email: '',
    },
  },
  summary: {
    subtotal: '',
    shippingCharges: '',
    taxes: '',
    totalAmountDue: '',
  },
  paymentTerms: {
    methods: '',
    dueDate: new Date().toISOString().split('T')[0],
  },
  notes: '',
}

// Predefined list of payment methods
const paymentMethods = [
  { value: '', label: 'Select Payment Method' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'PayPal', label: 'PayPal' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Cash', label: 'Cash' },
]

const InvoiceForm = () => {
  const [invoices, setInvoices] = useState([])
  const [currentInvoice, setCurrentInvoice] = useState(defaultInvoice)
  const [modalVisible, setModalVisible] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:5058/api/v1/invoice')
      setInvoices(response.data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    }
  }

  const openModal = (invoice = null) => {
    setCurrentInvoice(invoice ? { ...invoice } : defaultInvoice)
    setModalVisible(true)
    setFormErrors({})
  }

  const closeModal = () => {
    setCurrentInvoice(defaultInvoice)
    setModalVisible(false)
  }

  const validateForm = () => {
    const errors = {}
    if (!currentInvoice.invoiceNumber) errors.invoiceNumber = 'Invoice number is required.'
    if (!currentInvoice.invoiceDate) errors.invoiceDate = 'Invoice date is required.'
    if (!currentInvoice.customer?.name) errors.customerName = 'Customer name is required.'
    if (!currentInvoice.customer?.address?.street)
      errors.customerStreet = 'Street address is required.'
    if (!currentInvoice.customer?.address?.city) errors.customerCity = 'City is required.'
    if (!currentInvoice.customer?.address?.state) errors.customerState = 'State is required.'
    if (!currentInvoice.customer?.address?.zipCode) errors.customerZipCode = 'Zip code is required.'
    if (!currentInvoice.summary?.totalAmountDue)
      errors.totalAmountDue = 'Total amount due is required.'
    if (!currentInvoice.paymentTerms?.methods) errors.paymentMethod = 'Payment method is required.'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Handle nested state for customer and payment terms
    if (name.startsWith('customer.')) {
      const customerField = name.split('.')[1]
      setCurrentInvoice((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          [customerField]: value,
        },
      }))
    } else if (name.startsWith('paymentTerms.')) {
      const paymentField = name.split('.')[1]
      setCurrentInvoice((prev) => ({
        ...prev,
        paymentTerms: {
          ...prev.paymentTerms,
          [paymentField]: value,
        },
      }))
    } else {
      setCurrentInvoice((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return // Prevent submission if validation fails

    try {
      if (currentInvoice._id) {
        await axios.put(
          `http://localhost:5058/api/v1/invoice/${currentInvoice._id}`,
          currentInvoice,
        )
      } else {
        await axios.post('http://localhost:5058/api/v1/invoice', currentInvoice)
      }
      fetchInvoices()
      closeModal()
    } catch (error) {
      console.error('Error saving invoice:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5058/api/v1/invoice/${id}`)
      fetchInvoices()
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  return (
    <div>
      <CButton color="primary" onClick={() => openModal()}>
        Create New Invoice
      </CButton>
      <CRow className="mt-4">
        {invoices.map((invoice) => (
          <CCol xs="12" md="6" lg="4" key={invoice._id}>
            <CCard>
              <CCardHeader>
                <h5>{invoice.invoiceNumber}</h5>
                <CButton color="danger" onClick={() => handleDelete(invoice._id)}>
                  Delete
                </CButton>
                <CButton color="info" onClick={() => openModal(invoice)}>
                  Edit
                </CButton>
              </CCardHeader>
              <CCardBody>
                <p>Customer: {invoice.customer?.name || 'N/A'}</p>
                <p>Total Amount Due: ${invoice.summary?.totalAmountDue || '0.00'}</p>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CModal visible={modalVisible} onClose={closeModal}>
        <CModalHeader>
          <CModalTitle>{currentInvoice._id ? 'Edit Invoice' : 'Create Invoice'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              type="text"
              name="invoiceNumber"
              value={currentInvoice.invoiceNumber}
              onChange={handleInputChange}
              placeholder="Invoice Number"
              required
              invalid={!!formErrors.invoiceNumber}
            />
            <CFormInput
              type="date"
              name="invoiceDate"
              value={currentInvoice.invoiceDate}
              onChange={handleInputChange}
              required
              invalid={!!formErrors.invoiceDate}
            />
            <CFormInput
              type="text"
              name="customer.name"
              value={currentInvoice.customer?.name || ''}
              onChange={handleInputChange}
              placeholder="Customer Name"
              required
              invalid={!!formErrors.customerName}
            />
            <CFormInput
              type="text"
              name="customer.address.street"
              value={currentInvoice.customer?.address?.street || ''}
              onChange={handleInputChange}
              placeholder="Customer Street Address"
              required
              invalid={!!formErrors.customerStreet}
            />
            <CFormInput
              type="text"
              name="customer.address.city"
              value={currentInvoice.customer?.address?.city || ''}
              onChange={handleInputChange}
              placeholder="Customer City"
              required
              invalid={!!formErrors.customerCity}
            />
            <CFormInput
              type="text"
              name="customer.address.state"
              value={currentInvoice.customer?.address?.state || ''}
              onChange={handleInputChange}
              placeholder="Customer State"
              required
              invalid={!!formErrors.customerState}
            />
            <CFormInput
              type="text"
              name="customer.address.zipCode"
              value={currentInvoice.customer?.address?.zipCode || ''}
              onChange={handleInputChange}
              placeholder="Customer Zip Code"
              required
              invalid={!!formErrors.customerZipCode}
            />
            <CFormInput
              type="text"
              name="customer.contact.phone"
              value={currentInvoice.customer?.contact?.phone || ''}
              onChange={handleInputChange}
              placeholder="Customer Phone"
            />
            <CFormInput
              type="email"
              name="customer.contact.email"
              value={currentInvoice.customer?.contact?.email || ''}
              onChange={handleInputChange}
              placeholder="Customer Email"
            />
            <CFormInput
              type="text"
              name="summary.totalAmountDue"
              value={currentInvoice.summary?.totalAmountDue || ''}
              onChange={handleInputChange}
              placeholder="Total Amount Due"
              required
              invalid={!!formErrors.totalAmountDue}
            />
            <CFormSelect
              name="paymentTerms.methods"
              value={currentInvoice.paymentTerms?.methods || ''}
              onChange={handleInputChange}
              required
              invalid={!!formErrors.paymentMethod}
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </CFormSelect>
            <CFormInput
              type="date"
              name="paymentTerms.dueDate"
              value={currentInvoice.paymentTerms?.dueDate || ''}
              onChange={handleInputChange}
              required
            />
            <CFormInput
              type="text"
              name="notes"
              value={currentInvoice.notes || ''}
              onChange={handleInputChange}
              placeholder="Notes"
            />
            <div className="text-danger">
              {Object.values(formErrors).map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
            <CButton type="submit" color="primary">
              Save
            </CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default InvoiceForm
