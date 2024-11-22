import React from 'react'
import PropTypes from 'prop-types'

const WarehouseInfo = ({ warehouse }) => {
  const capacity = warehouse.capacity || 'Not available'
  const location = warehouse.location || 'Unknown location'
  const customCapacity = warehouse.customCapacity || null

  return (
    <div>
      <h3>Warehouse Information</h3>
      <p>
        <strong>Warehouse ID:</strong> {warehouse.warehouse_id || 'Unknown ID'}
      </p>
      <p>
        <strong>Location:</strong> {location}
      </p>
      <p>
        <strong>Capacity:</strong> {capacity} {customCapacity && `(Custom: ${customCapacity})`}
      </p>
      <p>
        <strong>Type of Goods:</strong> {warehouse.type_of_goods || 'Not specified'}
      </p>
    </div>
  )
}

WarehouseInfo.propTypes = {
  warehouse: PropTypes.shape({
    warehouse_id: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customCapacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type_of_goods: PropTypes.string,
  }).isRequired,
}

export default WarehouseInfo
