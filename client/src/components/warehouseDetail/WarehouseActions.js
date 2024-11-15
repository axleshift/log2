import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CButton } from '@coreui/react'

const WarehouseActions = ({ warehouse }) => {
  const navigate = useNavigate()

  const handleInventoryNavigation = () => {
    const routeMap = {
      'Warehouse H': '/warehouse-h-inventory',
      'Warehouse I': '/warehouse-i-inventory',
    }

    navigate(routeMap[warehouse.name] || '/default-inventory')
  }

  return (
    <div className="d-flex justify-content-between mt-4">
      <CButton color="primary" onClick={() => window.history.back()}>
        Back to List
      </CButton>
      <CButton color="secondary" onClick={handleInventoryNavigation}>
        Go to {warehouse.name} Inventory
      </CButton>
    </div>
  )
}

WarehouseActions.propTypes = {
  warehouse: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
}

export default WarehouseActions
