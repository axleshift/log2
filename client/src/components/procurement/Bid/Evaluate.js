import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react'

const BID_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/bid`

function EvaluateBids() {
  const [bids, setBids] = useState([])

  useEffect(() => {
    axios.get(`${BID_API_URL}/list`).then((res) => setBids(res.data))
  }, [])

  const handleEvaluate = async (bidId) => {
    try {
      await axios.post(`${BID_API_URL}/evaluate`, { bidId })
      alert('Bid evaluated successfully')
    } catch (error) {
      console.error('Error evaluating bid:', error)
    }
  }

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>Evaluate Bids</CCardHeader>
        <CCardBody>
          <CTable striped hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Deadline</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {bids.map((bid) => (
                <CTableRow key={bid.id}>
                  <CTableDataCell>{bid.id}</CTableDataCell>
                  <CTableDataCell>{bid.title}</CTableDataCell>
                  <CTableDataCell>{bid.deadline}</CTableDataCell>
                  <CTableDataCell>
                    <CButton size="sm" color="primary" onClick={() => handleEvaluate(bid.id)}>
                      Evaluate
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}
export default EvaluateBids
