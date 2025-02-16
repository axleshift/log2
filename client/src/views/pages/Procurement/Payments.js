import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CButton,
  CSpinner,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
} from '@coreui/react'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/payments`)
        if (!response.ok) {
          throw new Error('Failed to fetch payments')
        }
        const data = await response.json()
        setPayments(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const handleView = (payment) => {
    setSelectedPayment(payment)
    setViewModalVisible(true)
  }

  const handleEdit = (payment) => {
    setSelectedPayment(payment)
    setEditModalVisible(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/payments/${selectedPayment._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: selectedPayment.paymentId,
            amount: selectedPayment.amount,
            status: selectedPayment.status,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to update payment')
      }

      const updatedPayment = await response.json()

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === updatedPayment._id ? updatedPayment : payment,
        ),
      )

      setEditModalVisible(false)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <CCard>
        <CCardHeader>Payments</CCardHeader>
        <CCardBody className="text-center">
          <CSpinner color="primary" />
          <p>Loading payments...</p>
        </CCardBody>
      </CCard>
    )
  }

  if (error) {
    return (
      <CCard>
        <CCardHeader>Payments</CCardHeader>
        <CCardBody className="text-center text-danger">
          <p>Error: {error}</p>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CCard>
      <CCardHeader>Payments</CCardHeader>
      <CCardBody>
        <CTable bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Vendor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                <td>{index + 1}</td>
                <td>{payment.paymentId}</td>
                <td>${payment.amount}</td>
                <td>{payment.status}</td>
                <td>{payment.vendor ? payment.vendor.name : 'No vendor assigned'}</td>
                <td>
                  <CButton color="info" onClick={() => handleView(payment)}>
                    View
                  </CButton>
                  <CButton color="warning" className="ms-2" onClick={() => handleEdit(payment)}>
                    Edit
                  </CButton>
                </td>
              </tr>
            ))}
          </tbody>
        </CTable>
      </CCardBody>

      {/* View Modal */}
      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)}>
        <CModalHeader>Payment Details</CModalHeader>
        <CModalBody>
          {selectedPayment && (
            <div>
              <p>
                <strong>Payment ID:</strong> {selectedPayment.paymentId}
              </p>
              <p>
                <strong>Amount:</strong> ${selectedPayment.amount}
              </p>
              <p>
                <strong>Status:</strong> {selectedPayment.status}
              </p>
              <p>
                <strong>Vendor:</strong>{' '}
                {selectedPayment.vendor ? selectedPayment.vendor.name : 'No vendor assigned'}
              </p>{' '}
              {/* Updated field */}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Modal */}
      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader>Edit Payment</CModalHeader>
        <CModalBody>
          {selectedPayment && (
            <CForm onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  label="Payment ID"
                  value={selectedPayment.paymentId}
                  disabled
                />
              </div>
              <div className="mb-3">
                <CFormInput
                  type="number"
                  label="Amount"
                  value={selectedPayment.amount}
                  onChange={(e) =>
                    setSelectedPayment({ ...selectedPayment, amount: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  label="Status"
                  value={selectedPayment.status}
                  onChange={(e) =>
                    setSelectedPayment({ ...selectedPayment, status: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  label="Vendor"
                  value={
                    selectedPayment.vendor ? selectedPayment.vendor.name : 'No vendor assigned'
                  }
                  disabled
                />
              </div>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
                  Cancel
                </CButton>
                <CButton type="submit" color="primary">
                  Save Changes
                </CButton>
              </CModalFooter>
            </CForm>
          )}
        </CModalBody>
      </CModal>
    </CCard>
  )
}

export default Payments
