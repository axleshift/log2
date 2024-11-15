import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CCard, CCardBody, CSpinner, CAlert } from '@coreui/react'
import WarehouseInfo from '../warehouseDetail/WarehouseInfo'
import WarehouseActions from '../warehouseDetail/WarehouseActions'

const WAREHOUSE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/warehouse`

const WarehouseDetail = () => {
  const { warehouse_id } = useParams()
  const navigate = useNavigate()
  const [warehouse, setWarehouse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWarehouseDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${WAREHOUSE_API_URL}/${warehouse_id}`)
        if (!response.ok) throw new Error('Failed to fetch warehouse details')
        const data = await response.json()
        setWarehouse(data)
        setError(null)
      } catch (err) {
        setError('Failed to load warehouse details')
      } finally {
        setLoading(false)
      }
    }
    fetchWarehouseDetails()
  }, [warehouse_id])

  return (
    <CContainer>
      <h1>Warehouse Details</h1>

      {/* Loading state */}
      {loading && (
        <CRow className="justify-content-center">
          <CCol md="4" className="text-center">
            <CSpinner color="primary" />
            <p>Loading...</p>
          </CCol>
        </CRow>
      )}

      {/* Error message */}
      {error && (
        <CRow className="justify-content-center">
          <CCol md="8">
            <CAlert color="danger">{error}</CAlert>
          </CCol>
        </CRow>
      )}

      {/* Render WarehouseInfo and WarehouseActions components */}
      {warehouse && !loading && !error && (
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCard>
              <CCardBody>
                <WarehouseInfo warehouse={warehouse} />

                <WarehouseActions warehouse={warehouse} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </CContainer>
  )
}

export default WarehouseDetail
