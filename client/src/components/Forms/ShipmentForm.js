import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CSpinner,
  CRow,
  CCol,
} from '@coreui/react'

const BASE_URL = import.meta.env.VITE_API_URL
const SHIPMENT_API_URL = `${BASE_URL}/api/v1/shipment`

const ShipmentManagerPage = () => {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '', color: '' })

  const [modalVisible, setModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  const [formData, setFormData] = useState({
    tracking_id: '',
    shipper_company_name: '',
    shipper_contact_name: '',
    shipper_contact_email_address: '',
    shipper_contact_phone_number: '',
    shipper_company_address: '',
    consignee_company_name: '',
    consignee_contact_name: '',
    consignee_contact_email_address: '',
    consignee_contact_phone_number: '',
    consignee_company_address: '',
    shipment_description: '',
    shipment_weight: '',
    shipment_dimension_length: '',
    shipment_dimension_width: '',
    shipment_dimension_height: '',
    receiveDate: '',
    isInWarehouse: false,
    dispatch: 'Pending',
    paid: 'Unpaid',
    amount: '',
    type: 'public',
  })

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    try {
      const res = await axios.get(SHIPMENT_API_URL)
      setShipments(res.data.shipments || [])
    } catch (err) {
      console.error('Failed to fetch shipments:', err)
    }
  }

  const showToast = (message, color) => {
    setToast({ visible: true, message, color })
    setTimeout(() => setToast({ visible: false, message: '', color: '' }), 4000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const length = Number(formData.shipment_dimension_length)
      const width = Number(formData.shipment_dimension_width)
      const height = Number(formData.shipment_dimension_height)

      const payload = {
        tracking_id: formData.tracking_id,
        shipper: {
          shipper_company_name: formData.shipper_company_name,
          shipper_contact_name: formData.shipper_contact_name,
          shipper_contact_email_address: formData.shipper_contact_email_address,
          shipper_contact_phone_number: formData.shipper_contact_phone_number,
          shipper_company_address: formData.shipper_company_address,
        },
        consignee: {
          consignee_company_name: formData.consignee_company_name,
          consignee_contact_name: formData.consignee_contact_name,
          consignee_contact_email_address: formData.consignee_contact_email_address,
          consignee_contact_phone_number: formData.consignee_contact_phone_number,
          consignee_company_address: formData.consignee_company_address,
        },
        shipment: {
          shipment_description: formData.shipment_description,
          shipment_weight: Number(formData.shipment_weight),
          shipment_dimension_length: length,
          shipment_dimension_width: width,
          shipment_dimension_height: height,
          shipment_volume: length * width * height,
          shipment_value: 100,
          shipment_instructions: 'N/A',
        },
        shipping: {
          shipping_type: 'land',
          shipping_details: { land: { origin_address: 'N/A', destination_address: 'N/A' } },
        },
        receiveDate: formData.receiveDate || null,
        isInWarehouse: formData.isInWarehouse,
        dispatch: 'Pending',
        paid: 'Unpaid',
        amount: 0,
        type: 'public',
      }

      if (editMode) {
        await axios.put(`${SHIPMENT_API_URL}/${currentId}`, payload)
        showToast('Shipment updated!', 'success')
      } else {
        await axios.post(SHIPMENT_API_URL, payload)
        showToast('Shipment created!', 'success')
      }

      fetchShipments()
      setModalVisible(false)
      resetForm()
    } catch (err) {
      console.error('Error:', err)
      showToast('Error occurred', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      tracking_id: '',
      shipper_company_name: '',
      shipper_contact_name: '',
      shipper_contact_email_address: '',
      shipper_contact_phone_number: '',
      shipper_company_address: '',
      consignee_company_name: '',
      consignee_contact_name: '',
      consignee_contact_email_address: '',
      consignee_contact_phone_number: '',
      consignee_company_address: '',
      shipment_description: '',
      shipment_weight: '',
      shipment_dimension_length: '',
      shipment_dimension_width: '',
      shipment_dimension_height: '',
      receiveDate: '',
      isInWarehouse: false,
      dispatch: 'Pending',
      paid: 'Unpaid',
      amount: 0,
      type: 'public',
    })
  }
  const handleEdit = (shipment) => {
    setEditMode(true)
    setCurrentId(shipment._id)
    setFormData({
      tracking_id: shipment.tracking_id,
      shipper_company_name: shipment.shipper?.shipper_company_name || '',
      shipper_contact_name: shipment.shipper?.shipper_contact_name || '',
      shipper_contact_email_address: shipment.shipper?.shipper_contact_email_address || '',
      shipper_contact_phone_number: shipment.shipper?.shipper_contact_phone_number || '',
      shipper_company_address: shipment.shipper?.shipper_company_address || '',
      consignee_company_name: shipment.consignee?.consignee_company_name || '',
      consignee_contact_name: shipment.consignee?.consignee_contact_name || '',
      consignee_contact_email_address: shipment.consignee?.consignee_contact_email_address || '',
      consignee_contact_phone_number: shipment.consignee?.consignee_contact_phone_number || '',
      consignee_company_address: shipment.consignee?.consignee_company_address || '',
      shipment_description: shipment.shipment?.shipment_description || '',
      shipment_weight: shipment.shipment?.shipment_weight || '',
      shipment_dimension_length: shipment.shipment?.shipment_dimension_length || '',
      shipment_dimension_width: shipment.shipment?.shipment_dimension_width || '',
      shipment_dimension_height: shipment.shipment?.shipment_dimension_height || '',
    })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return
    try {
      await axios.delete(`${SHIPMENT_API_URL}/${id}`)
      showToast('Shipment deleted!', 'success')
      fetchShipments()
    } catch (err) {
      console.error('Delete error:', err)
      showToast('Failed to delete', 'danger')
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Shipments</h4>
        <CButton
          color="primary"
          onClick={() => {
            setEditMode(false)
            setCurrentId(null)
            resetForm()
            setModalVisible(true)
          }}
        >
          + New Shipment
        </CButton>
      </div>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Shipment' : 'Create Shipment'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleCreateOrUpdate}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Tracking ID"
                  name="tracking_id"
                  value={formData.tracking_id}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label="Received Date"
                    name="receiveDate"
                    value={formData.receiveDate}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
              <CCol md={6}>
                <CFormInput
                  label="Shipper Company"
                  name="shipper_company_name"
                  value={formData.shipper_company_name}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput
                  label="Shipper Contact Name"
                  name="shipper_contact_name"
                  value={formData.shipper_contact_name}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  label="Shipper Email"
                  name="shipper_contact_email_address"
                  value={formData.shipper_contact_email_address}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  label="Shipper Phone"
                  name="shipper_contact_phone_number"
                  value={formData.shipper_contact_phone_number}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Shipper Address"
                  name="shipper_company_address"
                  value={formData.shipper_company_address}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Consignee Company"
                  name="consignee_company_name"
                  value={formData.consignee_company_name}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Consignee Contact Name"
                  name="consignee_contact_name"
                  value={formData.consignee_contact_name}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput
                  label="Consignee Email"
                  name="consignee_contact_email_address"
                  value={formData.consignee_contact_email_address}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  label="Consignee Phone"
                  name="consignee_contact_phone_number"
                  value={formData.consignee_contact_phone_number}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  label="Consignee Address"
                  name="consignee_company_address"
                  value={formData.consignee_company_address}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Description"
                  name="shipment_description"
                  value={formData.shipment_description}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Weight (kg)"
                  name="shipment_weight"
                  type="number"
                  value={formData.shipment_weight}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput
                  label="Length (cm)"
                  name="shipment_dimension_length"
                  type="number"
                  value={formData.shipment_dimension_length}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  label="Width (cm)"
                  name="shipment_dimension_width"
                  type="number"
                  value={formData.shipment_dimension_width}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  label="Height (cm)"
                  name="shipment_dimension_height"
                  type="number"
                  value={formData.shipment_dimension_height}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            <div className="text-end">
              <CButton type="submit" color="success" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : editMode ? 'Update' : 'Create'}
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Tracking ID</CTableHeaderCell>
            <CTableHeaderCell>Shipper</CTableHeaderCell>
            <CTableHeaderCell>Consignee</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Weight</CTableHeaderCell>
            <CTableHeaderCell>Volume (cm³)</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {shipments.map((shipment, index) => (
            <CTableRow key={shipment._id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{shipment.tracking_id}</CTableDataCell>
              <CTableDataCell>{shipment.shipper?.shipper_company_name}</CTableDataCell>
              <CTableDataCell>{shipment.consignee?.consignee_company_name}</CTableDataCell>
              <CTableDataCell>{shipment.shipment?.shipment_description}</CTableDataCell>
              <CTableDataCell>{shipment.shipment?.shipment_weight}</CTableDataCell>
              <CTableDataCell>{shipment.shipment?.shipment_volume}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  size="sm"
                  color="info"
                  className="me-2"
                  onClick={() => handleEdit(shipment)}
                >
                  Edit
                </CButton>
                <CButton size="sm" color="danger" onClick={() => handleDelete(shipment._id)}>
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CToaster position="top-end">
        {toast.visible && (
          <CToast color={toast.color}>
            <CToastHeader closeButton>
              {toast.color === 'success' ? 'Success' : 'Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>
    </>
  )
}

export default ShipmentManagerPage
