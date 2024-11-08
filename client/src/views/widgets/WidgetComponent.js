import React, { useEffect, useState } from 'react'
import { CRow, CCol } from '@coreui/react'
import { CWidgetStatsF } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChartPie, cilArrowRight } from '@coreui/icons'
import { Link } from 'react-router-dom'

const WidgetComponent = () => {
  const [incomingShipments, setIncomingShipments] = useState(0)
  const [outgoingShipments, setOutgoingShipments] = useState(0)
  const [warehouse, setWarehouse] = useState(0)

  useEffect(() => {
    const fetchShipmentData = async () => {
      const incomingData = await fetch('/api/incoming-shipments')
      const outgoingData = await fetch('/api/outgoing-shipments')
      const warehouseData = await fetch('/api/warehouse')

      const incomingCount = await incomingData.json()
      const outgoingCount = await outgoingData.json()
      const warehouseCount = await warehouseData.json()

      setIncomingShipments(incomingCount)
      setOutgoingShipments(outgoingCount)
      setWarehouse(warehouseCount)
    }

    fetchShipmentData()
  }, [])

  return (
    <>
      <CRow>
        <CCol xs={6}>
          <CWidgetStatsF
            className="mb-3"
            color="info"
            footer={
              <Link to="/logistics">
                View more
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </Link>
            }
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Shipments Overview"
            value={`Incoming: ${incomingShipments}, Outgoing: ${outgoingShipments}`}
          />
        </CCol>
        <CCol xs={6}>
          <CWidgetStatsF
            className="mb-3"
            color="info"
            footer={
              <Link to="/warehouse">
                View more
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </Link>
            }
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Warehouse Overview"
            value={`Current Capacity: ${warehouse}`}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default WidgetComponent
