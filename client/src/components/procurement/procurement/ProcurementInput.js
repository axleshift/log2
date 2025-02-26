import React from 'react'
import PropTypes from 'prop-types'
import { CFormInput, CFormTextarea, CFormSelect } from '@coreui/react'

const ProcurementInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  options = [],
  rows = 3,
  disabled = false,
}) => {
  if (type === 'textarea') {
    return (
      <CFormTextarea
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        disabled={disabled}
        aria-label={label}
      />
    )
  }

  if (type === 'select') {
    return (
      <CFormSelect
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-label={label}
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </CFormSelect>
    )
  }

  return (
    <CFormInput
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      label={label}
      required={required}
      disabled={disabled}
      aria-label={label}
    />
  )
}

ProcurementInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'number', 'date', 'textarea', 'select']),
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.string),
  rows: PropTypes.number,
  disabled: PropTypes.bool,
}

export default ProcurementInput
