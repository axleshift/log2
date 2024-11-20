import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CButton, CCollapse } from '@coreui/react'
import InventoryDetails from './InventoryDetails'
import PropTypes from 'prop-types'

const InventoryItem = ({ item }) => {
  const [openDetails, setOpenDetails] = useState(null)

  const toggleDetails = () => {
    setOpenDetails(openDetails === null ? item.tracking_id : null)
  }

  return (
    <CCard className="mb-3">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Tracking ID:</strong> {item.tracking_id || 'N/A'}
        <CButton color="info" onClick={toggleDetails}>
          {openDetails === item.tracking_id ? 'Hide Details' : 'See Details'}
        </CButton>
      </CCardHeader>
      <CCardBody>
        <strong>Description:</strong>{' '}
        {item.shipment?.shipment_description || 'No description available'} <br />
        <CCollapse visible={openDetails === item.tracking_id}>
          <InventoryDetails item={item} />
        </CCollapse>
      </CCardBody>
    </CCard>
  )
}

InventoryItem.propTypes = {
  item: PropTypes.shape({
    tracking_id: PropTypes.string.isRequired,
    shipment: PropTypes.shape({
      shipment_description: PropTypes.string,
    }),
  }).isRequired,
}

export default InventoryItem
