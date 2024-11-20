import React from 'react'
import PropTypes from 'prop-types'

const InfoBlock = ({ title, fields }) => (
  <div className="info-block">
    <strong>{title}</strong>
    <br />
    {fields.map(({ label, value }) => (
      <div key={label}>
        <strong>{label}:</strong> {value || 'N/A'}
        <br />
      </div>
    ))}
    <br />
  </div>
)

InfoBlock.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
}

const ShippingDetails = ({ type, details }) => {
  if (!type || !details) return <p>No shipping details available.</p>

  const renderAirDetails = () => (
    <>
      <strong>Origin Airport:</strong> {details.origin_airport || 'N/A'} <br />
      <strong>Destination Airport:</strong> {details.destination_airport || 'N/A'} <br />
      <strong>Departure Date:</strong>{' '}
      {details.preferred_departure_date
        ? new Date(details.preferred_departure_date).toLocaleDateString()
        : 'Unknown'}{' '}
      <br />
      <strong>Arrival Date:</strong>{' '}
      {details.preferred_arrival_date
        ? new Date(details.preferred_arrival_date).toLocaleDateString()
        : 'Unknown'}{' '}
      <br />
    </>
  )

  const renderLandDetails = () => (
    <>
      <strong>Origin Address:</strong> {details.origin_address || 'N/A'} <br />
      <strong>Destination Address:</strong> {details.destination_address || 'N/A'} <br />
      <strong>Pickup Date:</strong>{' '}
      {details.pickup_date ? new Date(details.pickup_date).toLocaleDateString() : 'Unknown'} <br />
      <strong>Delivery Date:</strong>{' '}
      {details.delivery_date ? new Date(details.delivery_date).toLocaleDateString() : 'Unknown'}{' '}
      <br />
    </>
  )

  const renderSeaDetails = () => (
    <>
      <strong>Loading Port:</strong> {details.loading_port || 'N/A'} <br />
      <strong>Discharge Port:</strong> {details.discharge_port || 'N/A'} <br />
      <strong>Sailing Date:</strong>{' '}
      {details.sailing_date ? new Date(details.sailing_date).toLocaleDateString() : 'Unknown'}{' '}
      <br />
      <strong>Estimated Arrival Date:</strong>{' '}
      {details.estimated_arrival_date
        ? new Date(details.estimated_arrival_date).toLocaleDateString()
        : 'Unknown'}{' '}
      <br />
    </>
  )

  const typeDetailsMap = {
    air: renderAirDetails,
    land: renderLandDetails,
    sea: renderSeaDetails,
  }

  return (
    <div className="mt-3">
      <strong>{`${type.charAt(0).toUpperCase()}${type.slice(1)} Shipping:`}</strong>
      <br />
      {typeDetailsMap[type] ? typeDetailsMap[type]() : <p>Unsupported shipping type.</p>}
    </div>
  )
}

ShippingDetails.propTypes = {
  type: PropTypes.string.isRequired,
  details: PropTypes.shape({
    origin_airport: PropTypes.string,
    destination_airport: PropTypes.string,
    preferred_departure_date: PropTypes.string,
    preferred_arrival_date: PropTypes.string,
    origin_address: PropTypes.string,
    destination_address: PropTypes.string,
    pickup_date: PropTypes.string,
    delivery_date: PropTypes.string,
    loading_port: PropTypes.string,
    discharge_port: PropTypes.string,
    sailing_date: PropTypes.string,
    estimated_arrival_date: PropTypes.string,
  }).isRequired,
}

const InventoryDetails = ({ item }) => {
  if (!item) return <p>No inventory details available.</p>

  return (
    <div>
      <InfoBlock
        title="Shipper Information"
        fields={[
          { label: 'Company Name', value: item.shipper?.shipper_company_name },
          { label: 'Contact Name', value: item.shipper?.shipper_contact_name },
          { label: 'Email Address', value: item.shipper?.shipper_contact_email_address },
          { label: 'Phone Number', value: item.shipper?.shipper_contact_phone_number },
          { label: 'Company Address', value: item.shipper?.shipper_company_address },
        ]}
      />
      <InfoBlock
        title="Consignee Information"
        fields={[
          { label: 'Company Name', value: item.consignee?.consignee_company_name },
          { label: 'Contact Name', value: item.consignee?.consignee_contact_name },
          { label: 'Email Address', value: item.consignee?.consignee_contact_email_address },
          { label: 'Phone Number', value: item.consignee?.consignee_contact_phone_number },
          { label: 'Company Address', value: item.consignee?.consignee_company_address },
        ]}
      />
      <InfoBlock
        title="Shipment Information"
        fields={[
          {
            label: 'Dimensions (LxWxH)',
            value: `${item.shipment?.shipment_dimension_length || 'N/A'} x ${item.shipment?.shipment_dimension_width || 'N/A'} x ${item.shipment?.shipment_dimension_height || 'N/A'}`,
          },
          { label: 'Volume', value: item.shipment?.shipment_volume || 'N/A' },
          { label: 'Value', value: item.shipment?.shipment_value || 'N/A' },
          { label: 'Instructions', value: item.shipment?.shipment_instructions || 'N/A' },
        ]}
      />
      <ShippingDetails type={item.shipping?.shipping_type} details={item.shipping?.details} />
    </div>
  )
}

InventoryDetails.propTypes = {
  item: PropTypes.shape({
    shipper: PropTypes.shape({
      shipper_company_name: PropTypes.string,
      shipper_contact_name: PropTypes.string,
      shipper_contact_email_address: PropTypes.string,
      shipper_contact_phone_number: PropTypes.string,
      shipper_company_address: PropTypes.string,
    }),
    consignee: PropTypes.shape({
      consignee_company_name: PropTypes.string,
      consignee_contact_name: PropTypes.string,
      consignee_contact_email_address: PropTypes.string,
      consignee_contact_phone_number: PropTypes.string,
      consignee_company_address: PropTypes.string,
    }),
    shipment: PropTypes.shape({
      shipment_dimension_length: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      shipment_dimension_width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      shipment_dimension_height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      shipment_volume: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      shipment_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      shipment_instructions: PropTypes.string,
    }),
    shipping: PropTypes.shape({
      shipping_type: PropTypes.string,
      details: PropTypes.object,
    }),
  }).isRequired,
}

export default InventoryDetails
