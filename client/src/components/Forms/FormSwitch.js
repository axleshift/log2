import React from 'react'
import PropTypes from 'prop-types'
import { CFormSwitch, CTooltip } from '@coreui/react'

const CustomSwitch = ({ id, label, checked, onChange, description = '' }) => {
  return (
    <div className="mb-3">
      <CTooltip content={description} placement="right">
        <CFormSwitch id={id} label={label} checked={checked} onChange={onChange} />
      </CTooltip>
      <small className="text-muted">{description}</small>
    </div>
  )
}

CustomSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  description: PropTypes.string,
}

export default CustomSwitch
