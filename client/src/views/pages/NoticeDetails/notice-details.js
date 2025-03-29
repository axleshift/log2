import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CSpinner,
} from '@coreui/react'

const NoticeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`http://localhost:5058/api/v1/awards/${id}`)
        const data = await res.json()
        setNotice(data)
      } catch (err) {
        console.error('Failed to fetch notice:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotice()
  }, [id])

  if (loading) {
    return (
      <CContainer className="text-center mt-5">
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  if (!notice || !notice.title) {
    return (
      <CContainer className="text-center mt-5">
        <h3>Notice not found</h3>
        <CButton color="primary" onClick={() => navigate(-1)}>
          Go Back
        </CButton>
      </CContainer>
    )
  }

  return (
    <CContainer className="py-5">
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardBody>
              <CCardTitle className="mb-3">
                <h4>{notice.title}</h4>
              </CCardTitle>
              <CCardText>
                <strong>Amount:</strong> PHP {parseFloat(notice.amount).toLocaleString()}
              </CCardText>
              <CCardText>
                <strong>Date:</strong> {new Date(notice.date).toLocaleDateString()}
              </CCardText>
              <CCardText>
                <strong>Details:</strong> {notice.details || 'No additional details.'}
              </CCardText>
              <CButton color="primary" onClick={() => navigate(-1)}>
                Go Back
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default NoticeDetails
