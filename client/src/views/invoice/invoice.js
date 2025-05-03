import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { useAuth } from '../../context/AuthContext'
import { saveAs } from 'file-saver'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const BASE_URL = import.meta.env.VITE_API_URL
const PO_API_URL = `${BASE_URL}/api/v1/purchaseOrder`
const PROCUREMENT_API_URL = `${BASE_URL}/api/v1/procurement`
const VENDOR_API_URL = `${BASE_URL}/api/v1/vendor`
const PRODUCT_API_URL = `${BASE_URL}/api/v1/product`
const WAREHOUSE_API_URL = 'https://backend-log1.axleshift.com/api/v1/warehouseLoc/locations'

const InvoicePage = () => {
  const { accessToken } = useAuth()

  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [procurements, setProcurements] = useState([])
  const [vendors, setVendors] = useState([])
  const [productsCatalog, setProductsCatalog] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [toast, setToast] = useState({ show: false, message: '', color: '' })
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [poRes, procRes, vendorRes, prodRes, warehouseRes] = await Promise.all([
        axios.get(PO_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(PROCUREMENT_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(VENDOR_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(PRODUCT_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(WAREHOUSE_API_URL, {
          headers: {
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
      setToast({ show: true, message: 'Error fetching data.', color: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  const getWarehouseName = (id) => {
    return warehouses?.data?.find((w) => w._id === id)?.warehouseName || '—'
  }

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create()
    const pageWidth = 595
    const pageHeight = 842
    let page = pdfDoc.addPage([pageWidth, pageHeight])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const { width, height } = page.getSize()
    let y = height - 50

    const columnWidths = [40, 90, 90, 90, 90, 160]
    const headers = ['#', 'PO Number', 'Vendor', 'Procurement', 'Ship To', 'Products']

    page.drawText('Purchase Orders Report', {
      x: 40,
      y,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    })
    y -= 30

    headers.forEach((header, i) => {
      page.drawText(header, {
        x: 40 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.8),
      })
    })
    y -= 20

    const wrapText = (text, maxWidth) => {
      const words = text.split(' ')
      const lines = []
      let line = ''

      words.forEach((word) => {
        const testLine = line + (line ? ' ' : '') + word
        const testWidth = font.widthOfTextAtSize(testLine, 9)
        if (testWidth > maxWidth) {
          lines.push(line)
          line = word
        } else {
          line = testLine
        }
      })

      if (line) lines.push(line)
      return lines
    }

    for (let index = 0; index < purchaseOrders.length; index++) {
      const po = purchaseOrders[index]
      const row = [
        `${index + 1}`,
        po.poNumber || '—',
        po.vendor?.businessName || '—',
        po.procurementId?.title || '—',
        getWarehouseName(po.shipTo),
        po.details?.map((d) => `${d.description} (${d.quantity} @ ${d.unitPrice})`).join('; ') ||
          '—',
      ]

      const wrapped = row.map((text, i) => wrapText(text, columnWidths[i]))
      const maxLines = Math.max(...wrapped.map((lines) => lines.length))
      const rowHeight = maxLines * 12 + 4

      if (y - rowHeight < 40) {
        page = pdfDoc.addPage([pageWidth, pageHeight])
        y = height - 40

        headers.forEach((header, i) => {
          page.drawText(header, {
            x: 40 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
            y,
            size: 10,
            font,
            color: rgb(0.2, 0.2, 0.8),
          })
        })
        y -= 20
      }

      wrapped.forEach((lines, i) => {
        lines.forEach((line, lineIndex) => {
          page.drawText(line, {
            x: 40 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
            y: y - lineIndex * 12,
            size: 9,
            font,
            color: rgb(0, 0, 0),
          })
        })
      })

      y -= rowHeight
    }

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, 'purchase_orders.pdf')
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <CButton color="primary" onClick={generatePDF} disabled={loading}>
          <CIcon icon={cilCloudDownload} className="me-2" />
          Export PDF
        </CButton>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
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
                  {po.details?.length > 0
                    ? po.details.map((d, i) => (
                        <div key={i}>
                          {d.description} — {d.quantity} @ {d.unitPrice}
                        </div>
                      ))
                    : '—'}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

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
