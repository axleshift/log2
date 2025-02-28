import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
const InviteVendors = ({ vendors, selectedVendors, onVendorSelection }) => {
  return (
    <>
      <h5>Invite Vendors</h5>
      <Select
        isMulti
        options={vendors.map((vendor) => ({
          value: vendor._id,
          label: `${vendor.businessName} (${vendor.userId?.email})`,
        }))}
        onChange={onVendorSelection}
        value={selectedVendors.map((vendorId) => {
          const vendor = vendors.find((v) => v._id === vendorId)
          return vendor
            ? { value: vendor._id, label: `${vendor.businessName} (${vendor.userId?.email})` }
            : null
        })}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: '#f8f9fa',
            borderColor: '#ced4da',
            boxShadow: 'none',
            '&:hover': { borderColor: '#80bdff' },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'white',
            border: '1px solid #ced4da',
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? '#007bff' : isFocused ? '#e9ecef' : 'white',
            color: isSelected ? 'white' : 'black',
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#007bff',
            color: 'white',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: 'white',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: 'white',
            '&:hover': { backgroundColor: '#0056b3', color: 'white' },
          }),
        }}
      />
    </>
  )
}

InviteVendors.propTypes = {
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      businessName: PropTypes.string.isRequired,
      userId: PropTypes.shape({
        email: PropTypes.string,
      }),
    }),
  ).isRequired,
  selectedVendors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onVendorSelection: PropTypes.func.isRequired,
}
export default InviteVendors
