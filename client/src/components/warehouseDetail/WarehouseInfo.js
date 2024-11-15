import React from 'react'
import PropTypes from 'prop-types'

const WarehouseInfo = ({ warehouse }) => {
  return (
    <div>
      <h3>Warehouse Information</h3>
      <p>
        <strong>Warehouse ID:</strong> {warehouse.warehouse_id}
      </p>
      <p>
        <strong>Location:</strong> {warehouse.location}
      </p>
      <p>
        <strong>Capacity:</strong> {warehouse.capacity} units
      </p>
      <p>
        <strong>Goods Stored:</strong>{' '}
        {Array.isArray(warehouse.goods_stored) && warehouse.goods_stored.length > 0
          ? warehouse.goods_stored.join(', ')
          : 'No goods stored'}
      </p>
    </div>
  )
}

WarehouseInfo.propTypes = {
  warehouse: PropTypes.shape({
    warehouse_id: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    goods_stored: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
}

export default WarehouseInfo
