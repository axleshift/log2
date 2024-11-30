import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CButton,
  CImage,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
} from '@coreui/react'

const SupplierProfile = () => {
  const [suppliers, setSuppliers] = useState([
    {
      companyName: 'XYZ Supplies',
      contactPerson: 'John Doe',
      email: 'john.doe@xyzsupplies.com',
      phone: '+1 234 567 890',
      address: '123 Supplier Lane, Suite 456, Supply City, SC 78901',
      complianceDocuments: [
        { name: 'Certificate of Compliance', expiry: '2024-01-15' },
        { name: 'Business License', expiry: '2025-05-20' },
      ],
      activeOrders: [
        { id: '001', quantity: '500 Units', dueDate: '2024-02-10' },
        { id: '002', quantity: '300 Units', dueDate: '2024-03-05' },
      ],
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [addSupplierModal, setAddSupplierModal] = useState(false)
  const [newSupplier, setNewSupplier] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    complianceDocuments: [],
    activeOrders: [],
  })
  const [newDocument, setNewDocument] = useState({ name: '', expiry: '' })

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const toggleAddSupplierModal = () => {
    setAddSupplierModal(!addSupplierModal)
  }

  const handleAddSupplier = () => {
    setSuppliers([...suppliers, { ...newSupplier }])
    setNewSupplier({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      complianceDocuments: [],
      activeOrders: [],
    })
    setAddSupplierModal(false)
  }

  const handleAddDocument = () => {
    if (newDocument.name && newDocument.expiry) {
      setNewSupplier({
        ...newSupplier,
        complianceDocuments: [...newSupplier.complianceDocuments, newDocument],
      })
      setNewDocument({ name: '', expiry: '' })
    }
  }

  const handleDeleteSupplier = (index) => {
    const updatedSuppliers = suppliers.filter((_, i) => i !== index)
    setSuppliers(updatedSuppliers)
  }

  const handleDeleteDocument = (supplierIndex, docIndex) => {
    const updatedSuppliers = [...suppliers]
    updatedSuppliers[supplierIndex].complianceDocuments = updatedSuppliers[
      supplierIndex
    ].complianceDocuments.filter((_, i) => i !== docIndex)
    setSuppliers(updatedSuppliers)
  }

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <CContainer fluid>
      {/* Search Bar and Add Supplier Button */}
      <CRow className="my-4">
        <CCol md={8}>
          <CFormInput
            type="text"
            placeholder="Search Supplier by Company Name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </CCol>
        <CCol md={4} className="text-end">
          <CButton color="success" onClick={toggleAddSupplierModal}>
            Add Supplier
          </CButton>
        </CCol>
      </CRow>

      {/* Supplier Profiles */}
      {filteredSuppliers.map((profile, index) => (
        <CRow className="my-4" key={index}>
          {/* Profile Summary */}
          <CCol md={4}>
            <CCard>
              <CCardHeader>
                <h5>Supplier Information</h5>
                <CButton color="danger" size="sm" onClick={() => handleDeleteSupplier(index)}>
                  Delete Supplier
                </CButton>
              </CCardHeader>
              <CCardBody className="text-center">
                <CImage
                  src="https://via.placeholder.com/150"
                  alt="Profile Picture"
                  className="mb-3"
                  width="150"
                />
                <h5>{profile.companyName}</h5>
                <p>
                  <strong>Contact Person:</strong> {profile.contactPerson}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p>
                  <strong>Address:</strong> {profile.address}
                </p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Compliance Documents */}
          <CCol md={8}>
            <CCard>
              <CCardHeader>
                <h5>Compliance Documents</h5>
              </CCardHeader>
              <CCardBody>
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Document Name</CTableHeaderCell>
                      <CTableHeaderCell>Expiry Date</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {profile.complianceDocuments.map((doc, docIndex) => (
                      <CTableRow key={docIndex}>
                        <CTableDataCell>{doc.name}</CTableDataCell>
                        <CTableDataCell>{doc.expiry}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteDocument(index, docIndex)}
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      ))}

      {/* Add Supplier Modal */}
      <CModal visible={addSupplierModal} onClose={toggleAddSupplierModal}>
        <CModalHeader closeButton>
          <CModalTitle>Add New Supplier</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Company Name</CFormLabel>
              <CFormInput
                type="text"
                value={newSupplier.companyName}
                onChange={(e) => setNewSupplier({ ...newSupplier, companyName: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Contact Person</CFormLabel>
              <CFormInput
                type="text"
                value={newSupplier.contactPerson}
                onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Email</CFormLabel>
              <CFormInput
                type="email"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Phone</CFormLabel>
              <CFormInput
                type="text"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Address</CFormLabel>
              <CFormInput
                type="text"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Compliance Document</CFormLabel>
              <CFormInput
                type="text"
                placeholder="Document Name"
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
              />
              <CFormInput
                type="date"
                placeholder="Expiry Date"
                value={newDocument.expiry}
                onChange={(e) => setNewDocument({ ...newDocument, expiry: e.target.value })}
                className="mt-2"
              />
              <CButton color="info" className="mt-2" onClick={handleAddDocument}>
                Add Document
              </CButton>
            </div>
            <div>
              <h6>Added Documents:</h6>
              {newSupplier.complianceDocuments.map((doc, index) => (
                <p key={index}>
                  {doc.name} - {doc.expiry}
                </p>
              ))}
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleAddSupplierModal}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddSupplier}>
            Add Supplier
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default SupplierProfile
