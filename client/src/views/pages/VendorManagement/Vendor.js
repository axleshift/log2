import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CInputGroup,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

const Vendor = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [addVendorModal, setAddVendorModal] = useState(false) // For adding new vendor
  const [vendorDetails, setVendorDetails] = useState(null)
  const [vendors, setVendors] = useState([
    {
      name: 'ABC Corp',
      contactPerson: 'John Doe',
      status: 'Active',
      details: 'Contract: ABC123, Performance: Excellent',
    },
    {
      name: 'XYZ Ltd.',
      contactPerson: 'Jane Smith',
      status: 'Inactive',
      details: 'Contract: XYZ456, Performance: Good',
    },
  ])

  const [newVendor, setNewVendor] = useState({
    name: '',
    contactPerson: '',
    status: '',
    details: '',
  })

  const handleViewClick = (vendor) => {
    setVendorDetails(vendor)
    setModalVisible(true)
  }

  const handleDelete = (vendor) => {
    setVendors(vendors.filter((v) => v !== vendor))
    setModalVisible(false)
  }

  const handleAddVendor = () => {
    setVendors([...vendors, newVendor])
    setAddVendorModal(false)
    setNewVendor({ name: '', contactPerson: '', status: '', details: '' }) // Clear form
  }

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Vendor Management</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-4">
          <CCol sm="6">
            <p>Manage vendor details, contracts, and performance metrics.</p>
          </CCol>
          <CCol sm="6" className="text-right">
            <CButton color="primary" onClick={() => setAddVendorModal(true)}>
              Add New Vendor
            </CButton>
          </CCol>
        </CRow>

        {/* Vendor Table */}
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Vendor Name</CTableHeaderCell>
              <CTableHeaderCell>Contact Person</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {vendors.map((vendor, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{vendor.name}</CTableDataCell>
                <CTableDataCell>{vendor.contactPerson}</CTableDataCell>
                <CTableDataCell>{vendor.status}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" size="sm" onClick={() => handleViewClick(vendor)}>
                    View
                  </CButton>
                  <CButton color="warning" size="sm" className="ml-2">
                    Edit
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() =>
                      setVendors(vendors.filter((v) => v !== vendor)) || setModalVisible(false)
                    }
                    className="ml-2"
                  >
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Vendor Details Modal */}
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
          <CModalHeader>
            <CModalTitle>Vendor Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {vendorDetails && (
              <div>
                <p>
                  <strong>Vendor Name:</strong> {vendorDetails.name}
                </p>
                <p>
                  <strong>Contact Person:</strong> {vendorDetails.contactPerson}
                </p>
                <p>
                  <strong>Status:</strong> {vendorDetails.status}
                </p>
                <p>
                  <strong>Contract Details:</strong> {vendorDetails.details}
                </p>
              </div>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Add New Vendor Modal */}
        <CModal visible={addVendorModal} onClose={() => setAddVendorModal(false)} size="lg">
          <CModalHeader>
            <CModalTitle>Add New Vendor</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CInputGroup>
                <CFormLabel htmlFor="name">Vendor Name</CFormLabel>
                <CFormInput
                  id="name"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  placeholder="Enter vendor name"
                />
              </CInputGroup>
              <CInputGroup>
                <CFormLabel htmlFor="contactPerson">Contact Person</CFormLabel>
                <CFormInput
                  id="contactPerson"
                  value={newVendor.contactPerson}
                  onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                  placeholder="Enter contact person"
                />
              </CInputGroup>
              <CInputGroup>
                <CFormLabel htmlFor="status">Status</CFormLabel>
                <CFormInput
                  id="status"
                  value={newVendor.status}
                  onChange={(e) => setNewVendor({ ...newVendor, status: e.target.value })}
                  placeholder="Enter status"
                />
              </CInputGroup>
              <CInputGroup>
                <CFormLabel htmlFor="details">Contract Details</CFormLabel>
                <CFormInput
                  id="details"
                  value={newVendor.details}
                  onChange={(e) => setNewVendor({ ...newVendor, details: e.target.value })}
                  placeholder="Enter contract details"
                />
              </CInputGroup>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setAddVendorModal(false)}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleAddVendor}>
              Add Vendor
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  )
}

export default Vendor
