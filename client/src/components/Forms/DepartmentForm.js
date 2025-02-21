import React from 'react'
import { useFormContext } from 'react-hook-form'
import { CInputGroup, CInputGroupText, CFormInput, CAlert, CFormSelect } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBuilding, cilDescription } from '@coreui/icons'

function DepartmentForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div>
      <h5>Department Details</h5>

      {/* Department Name Dropdown */}
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilBuilding} />
        </CInputGroupText>
        <CFormSelect {...register('departmentName', { required: 'Department Name is required' })}>
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Admin">Admin</option>
          <option value="Logistics">Logistics</option>
        </CFormSelect>
      </CInputGroup>
      {errors.departmentName && <CAlert color="danger">{errors.departmentName.message}</CAlert>}

      {/* Department Description */}
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilDescription} />
        </CInputGroupText>
        <CFormInput
          placeholder="Department Description"
          {...register('departmentDescription', { required: 'Department Description is required' })}
        />
      </CInputGroup>
      {errors.departmentDescription && (
        <CAlert color="danger">{errors.departmentDescription.message}</CAlert>
      )}
    </div>
  )
}

export default DepartmentForm
