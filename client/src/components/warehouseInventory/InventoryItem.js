import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CButton, CCollapse } from '@coreui/react'
import InventoryDetails from './InventoryDetails'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const InventoryItem = ({ item }) => {
  const [openDetails, setOpenDetails] = useState(null)

  const toggleDetails = () => {
    setOpenDetails(openDetails === null ? item.tracking_id : null)
  }

  return (
    <div>
      {/* Inventory Card */}
      <CCard className="mb-3">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <strong>Tracking ID:</strong> {item.tracking_id || 'N/A'}
          </div>
          <CButton color="info" size="sm" onClick={toggleDetails} className="ms-2">
            {openDetails === item.tracking_id ? 'Hide Details' : 'See Details'}
          </CButton>
        </CCardHeader>
        <CCardBody>
          <strong>Description:</strong>{' '}
          {item.shipment?.shipment_description || 'No description available'} <br />
          <CCollapse visible={openDetails === item.tracking_id}>
            <InventoryDetails
              item={{
                ...item,
                warehouse_id: item.warehouse_id?._id || item.warehouse_id,
              }}
            />
          </CCollapse>
        </CCardBody>
      </CCard>
    </div>
  )
}

InventoryItem.propTypes = {
  item: PropTypes.shape({
    tracking_id: PropTypes.string.isRequired,
    shipment: PropTypes.shape({
      shipment_description: PropTypes.string,
    }),
    warehouse_id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  }).isRequired,
}

export default InventoryItem
