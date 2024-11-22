import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
} from '@coreui/react'

// Set the warehouse API URL
const WAREHOUSE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/warehouse`

const InventoryForm = () => {
  // Form state with initial values
  const [inventory, setInventory] = useState({
    shipper: {
      shipper_company_name: '',
      shipper_contact_name: '',
      shipper_contact_email_address: '',
      shipper_contact_phone_number: '',
      shipper_company_address: '',
    },
    consignee: {
      consignee_company_name: '',
      consignee_contact_name: '',
      consignee_contact_email_address: '',
      consignee_contact_phone_number: '',
      consignee_company_address: '',
    },
    shipment: {
      shipment_description: '',
      shipment_weight: '',
      shipment_dimension_length: '',
      shipment_dimension_width: '',
      shipment_dimension_height: '',
      shipment_volume: '',
      shipment_value: '',
      shipment_instructions: '',
    },
    shipping: {
      shipping_type: '',
      details: {
        air: {
          origin_airport: '',
          destination_airport: '',
          preferred_departure_date: '',
          preferred_arrival_date: '',
          flight_type: '',
        },
        land: {
          origin_address: '',
          destination_address: '',
          pickup_date: '',
          delivery_date: '',
          vehicle_type: '',
        },
        sea: {
          loading_port: '',
          discharge_port: '',
          sailing_date: '',
          estimated_arrival_date: '',
          cargo_type: '',
        },
      },
    },
    tracking_id: '',
    warehouse: '',
  })

  // State to manage warehouses and loading/error
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch warehouses on component mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoading(true)
        const response = await axios.get(WAREHOUSE_API_URL)
        if (response.status >= 200 && response.status < 300) {
          setWarehouses(response.data)
        } else {
          throw new Error('Failed to fetch warehouses')
        }
      } catch (err) {
        setError('Failed to load warehouses')
      } finally {
        setLoading(false)
      }
    }
    fetchWarehouses()
  }, [])

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target
    const keys = name.split('.')

    if (keys.length === 2) {
      setInventory((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
      }))
    } else if (keys.length === 3) {
      setInventory((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          details: {
            ...prev[keys[0]].details,
            [keys[1]]: { ...prev[keys[0]].details[keys[1]], [keys[2]]: value },
          },
        },
      }))
    } else {
      setInventory((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Validate form fields
  const validateForm = () => {
    if (!inventory.tracking_id) {
      alert('Tracking ID is required')
      return false
    }

    if (!inventory.warehouse) {
      alert('Warehouse is required')
      return false
    }

    if (!inventory.shipment || Object.values(inventory.shipment).some((field) => !field)) {
      alert('All shipment fields are required')
      return false
    }

    return true
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!inventory.warehouse) {
      alert('Please select a warehouse.')
      return
    }

    try {
      const updatedInventory = {
        ...inventory,
        warehouse: { _id: inventory.warehouse }, // Ensure warehouse ID is correctly set
      }

      const response = await axios.post('http://localhost:5058/api/v1/inventory', updatedInventory)
      alert('Inventory added successfully!')

      setInventory({
        shipper: {
          shipper_company_name: '',
          shipper_contact_name: '',
          shipper_contact_email_address: '',
          shipper_contact_phone_number: '',
          shipper_company_address: '',
        },
        consignee: {
          consignee_company_name: '',
          consignee_contact_name: '',
          consignee_contact_email_address: '',
          consignee_contact_phone_number: '',
          consignee_company_address: '',
        },
        shipment: {
          shipment_description: '',
          shipment_weight: '',
          shipment_dimension_length: '',
          shipment_dimension_width: '',
          shipment_dimension_height: '',
          shipment_volume: '',
          shipment_value: '',
          shipment_instructions: '',
        },
        shipping: { shipping_type: '', details: { air: {}, land: {}, sea: {} } },
        tracking_id: '',
        warehouse: '',
      })
    } catch (error) {
      console.error(error)
      alert('Failed to add inventory.')
    }
  }

  return (
    <CCard>
      <CCardHeader>Add Inventory</CCardHeader>
      <CCardBody>
        {loading && <CSpinner />}
        {error && <CAlert color="danger">{error}</CAlert>}
        <CForm onSubmit={handleSubmit}>
          {/* Tracking ID */}
          <h5>Tracking ID</h5>
          <CFormInput
            name="tracking_id"
            value={inventory.tracking_id}
            onChange={handleChange}
            placeholder="Tracking ID"
            required
          />

          {/* Shipper Information */}
          <h5>Shipper Information</h5>
          <CFormInput
            name="shipper.shipper_company_name"
            value={inventory.shipper.shipper_company_name}
            onChange={handleChange}
            placeholder="Company Name"
            required
          />
          <CFormInput
            name="shipper.shipper_contact_name"
            value={inventory.shipper.shipper_contact_name}
            onChange={handleChange}
            placeholder="Contact Name"
            required
          />
          <CFormInput
            name="shipper.shipper_contact_email_address"
            value={inventory.shipper.shipper_contact_email_address}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <CFormInput
            name="shipper.shipper_contact_phone_number"
            value={inventory.shipper.shipper_contact_phone_number}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          <CFormInput
            name="shipper.shipper_company_address"
            value={inventory.shipper.shipper_company_address}
            onChange={handleChange}
            placeholder="Address"
            required
          />

          {/* Consignee Information */}
          <h5>Consignee Information</h5>
          <CFormInput
            name="consignee.consignee_company_name"
            value={inventory.consignee.consignee_company_name}
            onChange={handleChange}
            placeholder="Company Name"
            required
          />
          <CFormInput
            name="consignee.consignee_contact_name"
            value={inventory.consignee.consignee_contact_name}
            onChange={handleChange}
            placeholder="Contact Name"
            required
          />
          <CFormInput
            name="consignee.consignee_contact_email_address"
            value={inventory.consignee.consignee_contact_email_address}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <CFormInput
            name="consignee.consignee_contact_phone_number"
            value={inventory.consignee.consignee_contact_phone_number}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          <CFormInput
            name="consignee.consignee_company_address"
            value={inventory.consignee.consignee_company_address}
            onChange={handleChange}
            placeholder="Address"
            required
          />

          {/* Shipment Information */}
          <h5>Shipment Information</h5>
          <CFormInput
            name="shipment.shipment_description"
            value={inventory.shipment.shipment_description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <CFormInput
            name="shipment.shipment_weight"
            value={inventory.shipment.shipment_weight}
            onChange={handleChange}
            placeholder="Weight"
            type="number"
            required
          />
          <CFormInput
            name="shipment.shipment_dimension_length"
            value={inventory.shipment.shipment_dimension_length}
            onChange={handleChange}
            placeholder="Length"
            type="number"
            required
          />
          <CFormInput
            name="shipment.shipment_dimension_width"
            value={inventory.shipment.shipment_dimension_width}
            onChange={handleChange}
            placeholder="Width"
            type="number"
            required
          />
          <CFormInput
            name="shipment.shipment_dimension_height"
            value={inventory.shipment.shipment_dimension_height}
            onChange={handleChange}
            placeholder="Height"
            type="number"
            required
          />
          <CFormInput
            name="shipment.shipment_volume"
            value={inventory.shipment.shipment_volume}
            onChange={handleChange}
            placeholder="Volume"
            type="number"
            required
          />
          <CFormInput
            name="shipment.shipment_value"
            value={inventory.shipment.shipment_value}
            onChange={handleChange}
            placeholder="Value"
            type="number"
            required
          />
          <CFormInput
            name="shipment.shipment_instructions"
            value={inventory.shipment.shipment_instructions}
            onChange={handleChange}
            placeholder="Instructions"
            required
          />

          {/* Shipping Information */}
          <h5>Shipping Information</h5>
          <CFormSelect
            name="shipping.shipping_type"
            value={inventory.shipping.shipping_type}
            onChange={handleChange}
          >
            <option value="">Select Shipping Type</option>
            <option value="air">Air</option>
            <option value="land">Land</option>
            <option value="sea">Sea</option>
          </CFormSelect>
          {/* Additional fields for air, land, and sea shipping options go here... */}

          {/* Warehouse Selection */}
          <h5>Select Warehouse</h5>
          <CFormSelect name="warehouse" value={inventory.warehouse} onChange={handleChange}>
            <option value="">Select a Warehouse</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse._id} value={warehouse._id}>
                {warehouse.name}
              </option>
            ))}
          </CFormSelect>

          {/* Submit Button */}
          <CButton type="submit" color="primary">
            Submit
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default InventoryForm
