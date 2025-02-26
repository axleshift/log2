import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CButton } from '@coreui/react'

const NextStep = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div>
      <h2>Procurement Request Approved</h2>
      <p>Would you like to create an RFQ or proceed directly to a PO?</p>

      <CButton color="primary" onClick={() => navigate(`/rfq/create/${id}`)}>
        Create RFQ
      </CButton>
      <CButton color="success" onClick={() => navigate(`/po/create/${id}`)}>
        Proceed to PO
      </CButton>
    </div>
  )
}

export default NextStep
