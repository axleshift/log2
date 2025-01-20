import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'

const Opportunities = () => {
  // Sample data for procurement opportunities
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: 'Office Supplies Procurement',
      deadline: '2025-02-15',
      description: 'Looking for vendors to supply office materials like paper, pens, and folders.',
      status: 'Open',
    },
    {
      id: 2,
      title: 'IT Equipment Purchase',
      deadline: '2025-03-10',
      description: 'Procurement of laptops, printers, and other IT accessories.',
      status: 'Open',
    },
  ])

  // Modal state for adding a new opportunity
  const [visible, setVisible] = useState(false)
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    deadline: '',
    description: '',
  })

  // Handle input changes in form
  const handleChange = (e) => {
    setNewOpportunity({ ...newOpportunity, [e.target.name]: e.target.value })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    const newId = opportunities.length + 1
    setOpportunities([...opportunities, { id: newId, ...newOpportunity, status: 'Open' }])
    setNewOpportunity({ title: '', deadline: '', description: '' })
    setVisible(false)
  }

  return (
    <div className="container mt-4">
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h4>Open Opportunities</h4>
          <CButton color="primary" onClick={() => setVisible(true)}>
            + Add Opportunity
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CAccordion alwaysOpen>
            {opportunities.map((opportunity, index) => (
              <CAccordionItem key={opportunity.id}>
                <CAccordionHeader>
                  {index + 1}. {opportunity.title}
                </CAccordionHeader>
                <CAccordionBody>
                  <p>
                    <strong>Description:</strong> {opportunity.description}
                  </p>
                  <p>
                    <strong>Deadline:</strong> {opportunity.deadline}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`badge bg-${opportunity.status === 'Open' ? 'success' : 'secondary'} ms-2`}
                    >
                      {opportunity.status}
                    </span>
                  </p>
                </CAccordionBody>
              </CAccordionItem>
            ))}
          </CAccordion>
        </CCardBody>
      </CCard>

      {/* Modal for adding new opportunity */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add New Opportunity</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              type="text"
              name="title"
              placeholder="Opportunity Title"
              value={newOpportunity.title}
              onChange={handleChange}
              required
            />
            <CFormInput
              type="date"
              name="deadline"
              className="mt-3"
              value={newOpportunity.deadline}
              onChange={handleChange}
              required
            />
            <CFormTextarea
              name="description"
              rows="3"
              placeholder="Description"
              className="mt-3"
              value={newOpportunity.description}
              onChange={handleChange}
              required
            />
            <CModalFooter>
              <CButton type="submit" color="primary">
                Add
              </CButton>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Cancel
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Opportunities
