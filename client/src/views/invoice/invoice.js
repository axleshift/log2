import React, { useEffect, useState, useCallback, useMemo } from 'react'
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

const wrapText = (font, text, maxWidth, fontSize) => {
  const words = text.split(' ')
  const lines = []
  let line = ''

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word
    const testWidth = font.widthOfTextAtSize(testLine, fontSize)
    if (testWidth > maxWidth) {
      if (line) lines.push(line)
      line = word
    } else {
      line = testLine
    }
  })
  if (line) lines.push(line)
  return lines
}

const drawTableHeaders = (page, headers, columnWidths, startX, y, font, fontSize) => {
  headers.forEach((header, i) => {
    const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0)
    page.drawText(header, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.8) })
  })
}

const drawTableRow = (page, rowTexts, columnWidths, startX, y, font, fontSize) => {
  const wrappedCols = rowTexts.map((text, i) => wrapText(font, text, columnWidths[i], fontSize))
  const maxLines = Math.max(...wrappedCols.map((lines) => lines.length))
  const rowHeight = maxLines * (fontSize + 3) + 4

  wrappedCols.forEach((lines, colIndex) => {
    const x = startX + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0)
    lines.forEach((line, lineIndex) => {
      page.drawText(line, {
        x,
        y: y - lineIndex * (fontSize + 3),
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      })
    })
  })

  return rowHeight
}

const InvoicePage = () => {
  const { accessToken } = useAuth()

  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', color: '' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [poRes, warehouseRes] = await Promise.all([
        axios.get(PO_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } }),
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
      setWarehouses(warehouseRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
      setToast({ show: true, message: 'Failed to load data', color: 'danger' })
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const warehouseMap = useMemo(() => {
    const map = {}
    warehouses?.data?.forEach((w) => {
      map[w._id] = w.warehouseName
    })
    return map
  }, [warehouses])

  const getWarehouseName = (id) => warehouseMap[id] || '—'

  const calculateRowHeight = (rowTexts, columnWidths, font, fontSize) => {
    const wrappedCols = rowTexts.map((text, i) => wrapText(font, text, columnWidths[i], fontSize))
    const maxLines = Math.max(...wrappedCols.map((lines) => lines.length))
    return maxLines * (fontSize + 3) + 4
  }

  const generatePDF = async () => {
    setLoading(true)
    try {
      const pdfDoc = await PDFDocument.create()
      const pageWidth = 595
      const pageHeight = 842
      let page = pdfDoc.addPage([pageWidth, pageHeight])
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const fontSizeHeader = 10
      const fontSizeText = 9
      const marginLeft = 40
      const marginTop = 50
      let y = pageHeight - marginTop

      const columnWidths = [40, 90, 90, 90, 90, 160]
      const headers = ['#', 'PO Number', 'Vendor', 'Procurement', 'Ship To', 'Products']

      // Title
      page.drawText('Purchase Orders Report', {
        x: marginLeft,
        y,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      })
      y -= 30

      // Headers
      drawTableHeaders(page, headers, columnWidths, marginLeft, y, font, fontSizeHeader)
      y -= 20

      for (let index = 0; index < purchaseOrders.length; index++) {
        const po = purchaseOrders[index]
        const row = [
          String(index + 1),
          po.poNumber || '—',
          po.vendor?.businessName || '—',
          po.procurementId?.title || '—',
          getWarehouseName(po.shipTo),
          po.details && po.details.length > 0
            ? po.details.map((d) => `${d.description} (${d.quantity} @ ${d.unitPrice})`).join(', ')
            : '—',
        ]

        const rowHeight = calculateRowHeight(row, columnWidths, font, fontSizeText)

        if (y - rowHeight < 40) {
          page = pdfDoc.addPage([pageWidth, pageHeight])
          y = pageHeight - marginTop
          drawTableHeaders(page, headers, columnWidths, marginLeft, y, font, fontSizeHeader)
          y -= 20
        }

        drawTableRow(page, row, columnWidths, marginLeft, y, font, fontSizeText)
        y -= rowHeight
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, 'PurchaseOrdersReport.pdf')

      setToast({ show: true, message: 'PDF generated successfully!', color: 'success' })
    } catch (error) {
      console.error('PDF generation failed:', error)
      setToast({ show: true, message: 'Failed to generate PDF', color: 'danger' })
    } finally {
      setLoading(false)
    }
  }

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
          <CToast
            autohide
            visible
            color={toast.color}
            onClose={() => setToast({ ...toast, show: false })}
          >
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
