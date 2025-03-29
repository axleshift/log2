import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CSpinner,
} from '@coreui/react'
import { useAuth } from '../../context/AuthContext'

const BASE_URL = import.meta.env.VITE_API_URL
const PO_API_URL = `${BASE_URL}/api/v1/purchaseOrder`
const PROCUREMENT_API_URL = `${BASE_URL}/api/v1/procurement`
const VENDOR_API_URL = `${BASE_URL}/api/v1/vendor`
const PRODUCT_API_URL = `${BASE_URL}/api/v1/product`
const WAREHOUSE_API_URL = `https://backend-log1.axleshift.com/api/v1/warehouseLoc/locations`

const PurchaseOrderPage = () => {
  const { accessToken } = useAuth()

  const [modalVisible, setModalVisible] = useState(false)
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [procurements, setProcurements] = useState([])
  const [vendors, setVendors] = useState([])
  const [productsCatalog, setProductsCatalog] = useState([])
  const [warehouses, setWarehouses] = useState([])

  const [poData, setPoData] = useState({
    procurementId: '',
    vendorId: '',
    shipTo: '',
    rfqId: '',
    poNumber: '',
    orderDate: '',
    receiveDate: '',
    carrier: '',
    additionalNotes: '',
    products: [{ productId: '', description: '', quantity: 0, unitPrice: 0 }],
  })

  const [toast, setToast] = useState({ show: false, message: '', color: '' })
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   fetchData()
  // }, [])

  const fetchData = async () => {
    try {
      const [poRes, procRes, vendorRes, prodRes, warehouseRes] = await Promise.all([
        axios.get(PO_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(PROCUREMENT_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(VENDOR_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(PRODUCT_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(WAREHOUSE_API_URL, {
          headers: {
            // Authorization: `Bearer ${accessToken}`,

            'Content-Type': 'application/json',
            'x-api-key':
              '0ad3f5c013c42d2d0537672a260978c71dcd5a7d508019d748f991deee3d65665a477e3523c6bbc83fd6a51a71dd5003',
          },
          withCredentials: true,
        }),
      ])
      setPurchaseOrders(poRes.data)
      setProcurements(procRes.data)
      setVendors(vendorRes.data)
      setProductsCatalog(prodRes.data)
      setWarehouses(warehouseRes.data)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPoData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductsChange = (e, index) => {
    const { name, value } = e.target
    const updated = [...poData.products]
    updated[index][name] = ['quantity', 'unitPrice'].includes(name) ? parseFloat(value) : value
    setPoData((prev) => ({ ...prev, products: updated }))
  }

  const addProduct = () => {
    setPoData((prev) => ({
      ...prev,
      products: [...prev.products, { productId: '', description: '', quantity: 0, unitPrice: 0 }],
    }))
  }

  const resetForm = () => {
    setPoData({
      procurementId: '',
      vendorId: '',
      shipTo: '',
      rfqId: '',
      poNumber: '',
      orderDate: '',
      receiveDate: '',
      carrier: '',
      additionalNotes: '',
      warehouse_id: '',
      products: [{ productId: '', description: '', quantity: 0, unitPrice: 0 }],
    })
  }

  const showToast = (message, color) => {
    setToast({ show: true, message, color })
    setTimeout(() => setToast({ show: false, message: '', color: '' }), 5000)
  }

  const getWarehouseName = (id) => {
    return warehouses?.data?.find((w) => w._id === id)?.warehouseName || '—'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!accessToken) return showToast('Not authenticated.', 'danger')

    setLoading(true)

    try {
      const payload = { ...poData, warehouse_id: poData.shipTo }

      if (!payload.shipTo) delete payload.shipTo
      if (!payload.rfqId) delete payload.rfqId

      if (
        !payload.products.length ||
        payload.products.some((p) => !p.productId || !p.description)
      ) {
        showToast('Each product must have a product and description', 'danger')
        setLoading(false)
        return
      }

      await axios.post(PO_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      showToast('Purchase Order Created!', 'success')
      resetForm()
      fetchData()
      setModalVisible(false)
    } catch (err) {
      console.error('❌ PO creation error:', err)
      showToast(err.response?.data?.message || 'Error creating Purchase Order', 'danger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openModal = () => {
    setModalVisible(true)
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Purchase Orders</h4>
        <CButton type="button" color="primary" onClick={() => openModal()}>
          + Create Purchase Order
        </CButton>
      </div>

      <CTable striped responsive hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>PO Number</CTableHeaderCell>
            <CTableHeaderCell>Vendor</CTableHeaderCell>
            <CTableHeaderCell>Procurement</CTableHeaderCell>
            <CTableHeaderCell>Ship To</CTableHeaderCell>
            <CTableHeaderCell>Products</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {purchaseOrders.map((po, index) => (
            <CTableRow key={po._id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{po.poNumber || '—'}</CTableDataCell>
              <CTableDataCell>{po.vendor?.businessName || '—'}</CTableDataCell>
              <CTableDataCell>{po.procurementId?.title || '—'}</CTableDataCell>
              <CTableDataCell>{getWarehouseName(po.shipTo)}</CTableDataCell>
              <CTableDataCell>
                {po.details?.map((d, i) => (
                  <div key={i}>
                    {d.description} — {d.quantity} @ {d.unitPrice}
                  </div>
                )) || '—'}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal */}
      <CModal
        visible={modalVisible}
        onClose={async () => {
          setModalVisible(false)
        }}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Create Purchase Order</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  name="poNumber"
                  value={poData.poNumber}
                  onChange={handleChange}
                  label="PO Number"
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="date"
                  name="orderDate"
                  value={poData.orderDate}
                  onChange={handleChange}
                  label="Order Date"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect
                  name="procurementId"
                  value={poData.procurementId}
                  onChange={handleChange}
                  label="Procurement"
                  required
                >
                  <option value="">Select Procurement</option>
                  {procurements.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  name="vendorId"
                  value={poData.vendorId}
                  onChange={handleChange}
                  label="Vendor"
                  required
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.businessName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {warehouses ? (
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect
                    name="shipTo"
                    value={poData.shipTo}
                    onChange={handleChange}
                    label="Ship To (Warehouse)"
                  >
                    <option value="">Select Warehouse</option>
                    {Array.isArray(warehouses?.data) &&
                      warehouses.data.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.warehouseName}
                        </option>
                      ))}
                  </CFormSelect>
                </CCol>
              </CRow>
            ) : (
              <div></div>
            )}

            <h6 className="mt-3">Products</h6>
            {poData.products.map((product, index) => (
              <CRow className="mb-3" key={index}>
                <CCol md={4}>
                  <CFormSelect
                    name="productId"
                    label="Product"
                    value={product.productId}
                    onChange={(e) => handleProductsChange(e, index)}
                    required
                  >
                    <option value="">Select Product</option>
                    {productsCatalog.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="text"
                    name="description"
                    label="Description"
                    value={product.description}
                    onChange={(e) => handleProductsChange(e, index)}
                    required
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="number"
                    name="quantity"
                    label="Qty"
                    value={product.quantity}
                    onChange={(e) => handleProductsChange(e, index)}
                    required
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="number"
                    name="unitPrice"
                    label="Unit Price"
                    value={product.unitPrice}
                    onChange={(e) => handleProductsChange(e, index)}
                    required
                  />
                </CCol>
              </CRow>
            ))}
            <CButton onClick={addProduct} color="secondary" className="mb-3">
              + Add Product
            </CButton>

            <div className="text-end">
              <CButton type="submit" color="success" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Create PO'}
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>

      <CToaster placement="top-end">
        {toast.show && (
          <CToast autohide={true} visible={true} color={toast.color}>
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

export default PurchaseOrderPage
