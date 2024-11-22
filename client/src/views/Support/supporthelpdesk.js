import React, { useState } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormText,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CCollapse,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilChevronBottom } from '@coreui/icons'

const SupportHelpdesk = () => {
  const [contactModal, setContactModal] = useState(false)
  const [contactDetails, setContactDetails] = useState({ name: '', email: '', message: '' })
  const [faqCollapse, setFaqCollapse] = useState([false, false, false])

  // Toggle for Contact Form Modal
  const toggleContactModal = () => setContactModal(!contactModal)

  // Handle change in contact form inputs
  const handleContactChange = (e) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value })
  }

  // Handle contact form submission
  const handleContactSubmit = () => {
    console.log('Contact Form Submitted:', contactDetails)
    setContactDetails({ name: '', email: '', message: '' })
    setContactModal(false)
  }

  // Toggle FAQ item
  const toggleFAQ = (index) => {
    setFaqCollapse((prevState) => prevState.map((item, i) => (i === index ? !item : item)))
  }

  return (
    <CContainer fluid>
      {/* Contact Buyer Section */}
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Contact Buyer</h3>
            </CCardHeader>
            <CCardBody>
              <CButton color="primary" onClick={toggleContactModal}>
                Contact Procurement Team
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Contact Modal */}
      <CModal visible={contactModal} onClose={toggleContactModal}>
        <CModalHeader closeButton>
          <CModalTitle>Contact Procurement Team</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="contactName">Name</CFormLabel>
              <CFormInput
                type="text"
                id="contactName"
                name="name"
                value={contactDetails.name}
                onChange={handleContactChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="contactEmail">Email</CFormLabel>
              <CFormInput
                type="email"
                id="contactEmail"
                name="email"
                value={contactDetails.email}
                onChange={handleContactChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="contactMessage">Message</CFormLabel>
              <CFormInput
                type="textarea"
                id="contactMessage"
                name="message"
                value={contactDetails.message}
                onChange={handleContactChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleContactModal}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleContactSubmit}>
            Submit
          </CButton>
        </CModalFooter>
      </CModal>

      {/* FAQ Section */}
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Frequently Asked Questions (FAQs)</h3>
            </CCardHeader>
            <CCardBody>
              <CListGroup>
                <CListGroupItem
                  onClick={() => toggleFAQ(0)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>How do I place an order?</div>
                  <CIcon icon={cilChevronBottom} size="sm" />
                </CListGroupItem>
                <CCollapse visible={faqCollapse[0]}>
                  <CListGroupItem>
                    To place an order, go to the &apos;Orders&apos; section and select the product.
                    Then, fill in the order details.
                  </CListGroupItem>
                </CCollapse>

                <CListGroupItem
                  onClick={() => toggleFAQ(1)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>What payment methods are available?</div>
                  <CIcon icon={cilChevronBottom} size="sm" />
                </CListGroupItem>
                <CCollapse visible={faqCollapse[1]}>
                  <CListGroupItem>
                    We accept various payment methods, including bank transfer, credit card, and
                    PayPal.
                  </CListGroupItem>
                </CCollapse>

                <CListGroupItem
                  onClick={() => toggleFAQ(2)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>How do I track my order?</div>
                  <CIcon icon={cilChevronBottom} size="sm" />
                </CListGroupItem>
                <CCollapse visible={faqCollapse[2]}>
                  <CListGroupItem>
                    You can track your order status in the &apos;Orders&apos; section. Once your
                    order is shipped, tracking details will be provided.
                  </CListGroupItem>
                </CCollapse>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default SupportHelpdesk
