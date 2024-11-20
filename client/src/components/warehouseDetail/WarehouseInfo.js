import React from 'react'
import PropTypes from 'prop-types'

const WarehouseInfo = ({ warehouse }) => {
  const goodsStored = Array.isArray(warehouse.goods_stored)
    ? warehouse.goods_stored
    : warehouse.goods_stored
      ? warehouse.goods_stored.split(',').map((item) => item.trim())
      : []

  const capacity = warehouse.capacity || 'Not available'
  const location = warehouse.location || 'Unknown location'

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
        <strong>Capacity:</strong> {capacity} units
      </p>
      <p>
        <strong>Goods Stored:</strong>{' '}
        {goodsStored.length > 0 ? goodsStored.join(', ') : 'No goods stored'}
      </p>
    </div>
  )
}

WarehouseInfo.propTypes = {
  warehouse: PropTypes.shape({
    warehouse_id: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    capacity: PropTypes.string,
    goods_stored: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  }).isRequired,
}

export default WarehouseInfo
