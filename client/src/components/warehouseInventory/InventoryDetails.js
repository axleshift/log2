import React from 'react'
import PropTypes from 'prop-types'

const InfoBlock = ({ title, fields }) => (
  <div className="info-block">
    <strong>{title}</strong>
    <br />
    {fields &&
      fields.map(({ label, value }) => (
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
      value: PropTypes.string,
    }),
  ).isRequired,
}

const ShippingDetails = ({ type, details }) => {
  if (!type || !details) return <p>No shipping details available.</p>

  const renderAirDetails = () => (
    <>
      <strong>Origin Airport:</strong> {details.air?.origin_airport || 'N/A'} <br />
      <strong>Destination Airport:</strong> {details.air?.destination_airport || 'N/A'} <br />
      <strong>Departure Date:</strong>{' '}
      {details.air?.preferred_departure_date
        ? new Date(details.air.preferred_departure_date).toLocaleDateString()
        : 'Unknown'}{' '}
      <br />
      <strong>Arrival Date:</strong>{' '}
      {details.air?.preferred_arrival_date
        ? new Date(details.air.preferred_arrival_date).toLocaleDateString()
        : 'Unknown'}{' '}
      <br />
    </>
  )

  const renderLandDetails = () => (
    <>
      <strong>Origin Address:</strong> {details.land?.origin_address || 'N/A'} <br />
      <strong>Destination Address:</strong> {details.land?.destination_address || 'N/A'} <br />
      <strong>Pickup Date:</strong>{' '}
      {details.land?.pickup_date
        ? new Date(details.land.pickup_date).toLocaleDateString()
        : 'Unknown'}{' '}
      <br />
      <strong>Delivery Date:</strong>{' '}
      {details.land?.delivery_date
        ? new Date(details.land.delivery_date).toLocaleDateString()
        : 'Unknown'}{' '}
      <br />
    </>
  )

  const renderSeaDetails = () => (
    <>
      <strong>Loading Port:</strong> {details.sea?.loading_port || 'N/A'} <br />
      <strong>Discharge Port:</strong> {details.sea?.discharge_port || 'N/A'} <br />
      <strong>Sailing Date:</strong>{' '}
      {details.sea?.sailing_date
        ? new Date(details.sea.sailing_date).toLocaleDateString()
        : 'Unknown'}{' '}
      <br />
      <strong>Estimated Arrival Date:</strong>{' '}
      {details.sea?.estimated_arrival_date
        ? new Date(details.sea.estimated_arrival_date).toLocaleDateString()
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
    air: PropTypes.shape({
      origin_airport: PropTypes.string,
      destination_airport: PropTypes.string,
      preferred_departure_date: PropTypes.string,
      preferred_arrival_date: PropTypes.string,
    }),
    land: PropTypes.shape({
      origin_address: PropTypes.string,
      destination_address: PropTypes.string,
      pickup_date: PropTypes.string,
      delivery_date: PropTypes.string,
    }),
    sea: PropTypes.shape({
      loading_port: PropTypes.string,
      discharge_port: PropTypes.string,
      sailing_date: PropTypes.string,
      estimated_arrival_date: PropTypes.string,
    }),
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
          { label: 'Description', value: item.shipment?.shipment_description },
          { label: 'Weight', value: item.shipment?.shipment_weight },
          {
            label: 'Dimensions (LxWxH)',
            value: `${item.shipment?.shipment_dimension_length || 'N/A'} x ${item.shipment?.shipment_dimension_width || 'N/A'} x ${item.shipment?.shipment_dimension_height || 'N/A'}`,
          },
          { label: 'Volume', value: item.shipment?.shipment_volume },
          { label: 'Value', value: item.shipment?.shipment_value },
          { label: 'Instructions', value: item.shipment?.shipment_instructions },
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
      shipment_description: PropTypes.string,
      shipment_weight: PropTypes.number,
      shipment_dimension_length: PropTypes.number,
      shipment_dimension_width: PropTypes.number,
      shipment_dimension_height: PropTypes.number,
      shipment_volume: PropTypes.number,
      shipment_value: PropTypes.number,
      shipment_instructions: PropTypes.string,
    }),
    shipping: PropTypes.shape({
      shipping_type: PropTypes.string,
      details: PropTypes.shape({
        air: PropTypes.shape({
          origin_airport: PropTypes.string,
          destination_airport: PropTypes.string,
          preferred_departure_date: PropTypes.string,
          preferred_arrival_date: PropTypes.string,
        }),
        land: PropTypes.shape({
          origin_address: PropTypes.string,
          destination_address: PropTypes.string,
          pickup_date: PropTypes.string,
          delivery_date: PropTypes.string,
        }),
        sea: PropTypes.shape({
          loading_port: PropTypes.string,
          discharge_port: PropTypes.string,
          sailing_date: PropTypes.string,
          estimated_arrival_date: PropTypes.string,
        }),
      }).isRequired,
    }),
    tracking_id: PropTypes.string,
    warehouse_id: PropTypes.string,
  }).isRequired,
}

export default InventoryDetails
