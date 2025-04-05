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

const InvoicePage = () => {
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

export default InvoicePage
