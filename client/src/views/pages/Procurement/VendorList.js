import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from '@coreui/react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function VendorList() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_URL}/api/v1/vendors`)
        setVendors(res.data || [])
      } catch (error) {
        console.error('Error fetching vendors:', error)
        setVendors([])
      } finally {
        setLoading(false)
      }
    }
    fetchVendors()
  }, [])

  const handleApproval = async (vendorId) => {
    setActionLoading(vendorId)
    try {
      const response = await axios.put(`${API_URL}/api/v1/vendors/approve/${vendorId}`)
      if (response.status === 200) {
        setVendors((prevVendors) =>
          prevVendors.map((vendor) =>
            vendor._id === vendorId ? { ...vendor, status: 'Approved' } : vendor,
          ),
        )
      } else {
        console.error('Error approving vendor:', response.statusText)
      }
    } catch (error) {
      console.error('Error approving vendor:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelApproval = async (vendorId) => {
    setActionLoading(vendorId)
    try {
      const response = await axios.put(`${API_URL}/api/v1/vendors/cancel-approval/${vendorId}`)
      if (response.status === 200) {
        setVendors((prevVendors) =>
          prevVendors.map((vendor) =>
            vendor._id === vendorId ? { ...vendor, status: 'Pending' } : vendor,
          ),
        )
      } else {
        console.error('Error canceling approval:', response.statusText)
      }
    } catch (error) {
      console.error('Error canceling approval:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor)
    setModalVisible(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Pending':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>Vendor Profiles</CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="d-flex justify-content-center">
              <CSpinner color="primary" />
            </div>
          ) : (
            <CTable striped responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Company</CTableHeaderCell>
                  <CTableHeaderCell>Full Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Phone</CTableHeaderCell>
                  <CTableHeaderCell>Address</CTableHeaderCell>
                  <CTableHeaderCell>Website</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <CTableRow key={vendor._id}>
                      <CTableDataCell>{vendor.businessName}</CTableDataCell>
                      <CTableDataCell>{vendor.fullName}</CTableDataCell>
                      <CTableDataCell>{vendor.email}</CTableDataCell>
                      <CTableDataCell>{vendor.contactNumber}</CTableDataCell>
                      <CTableDataCell>{vendor.businessAddress}</CTableDataCell>
                      <CTableDataCell>{vendor.website}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color={getStatusColor(vendor.status)}>{vendor.status}</CButton>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton size="sm" color="info" onClick={() => handleViewDetails(vendor)}>
                          View Details
                        </CButton>
                        {vendor.status === 'Approved' ? (
                          <CButton
                            size="sm"
                            color="warning"
                            onClick={() => handleCancelApproval(vendor._id)}
                            disabled={actionLoading === vendor._id}
                          >
                            Cancel Approval
                          </CButton>
                        ) : (
                          <CButton
                            size="sm"
                            color="success"
                            onClick={() => handleApproval(vendor._id)}
                            disabled={actionLoading === vendor._id}
                          >
                            Approve
                          </CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      No vendors found.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>Vendor Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedVendor && (
            <>
              <p>
                <strong>Company:</strong> {selectedVendor.businessName}
              </p>
              <p>
                <strong>Full Name:</strong> {selectedVendor.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedVendor.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedVendor.contactNumber}
              </p>
              <p>
                <strong>Address:</strong> {selectedVendor.businessAddress}
              </p>
              <p>
                <strong>Website:</strong> {selectedVendor.website}
              </p>
              <p>
                <strong>Status:</strong> {selectedVendor.status}
              </p>
              <p>
                <strong>Documents:</strong>{' '}
                <a
                  href={selectedVendor.documents.companyProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </a>
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default VendorList
