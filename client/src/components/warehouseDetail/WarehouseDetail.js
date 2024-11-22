import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CSpinner, CAlert, CButton } from '@coreui/react'
import axios from 'axios'
import WarehouseInfo from '../warehouseDetail/WarehouseInfo'

const WAREHOUSE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/warehouse`

const WarehouseDetail = () => {
  const { warehouse_id } = useParams()
  const navigate = useNavigate()
  const [warehouse, setWarehouse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWarehouseDetails = async () => {
      if (!warehouse_id) {
        setError('Invalid warehouse ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(`${WAREHOUSE_API_URL}/${warehouse_id}`)
        const warehouseData = response.data

        if (warehouseData) {
          setWarehouse(warehouseData)
        } else {
          setError('Warehouse not found')
        }
      } catch (err) {
        console.error('Error fetching warehouse details:', err)
        setError('Failed to load warehouse data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchWarehouseDetails()
  }, [warehouse_id])

  if (loading) {
    return (
      <CContainer>
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer>
        <CAlert color="danger">{error}</CAlert>
      </CContainer>
    )
  }

  return (
    <CContainer>
      <h1>Warehouse Details</h1>
      <CRow>
        <CCol lg={8}>
          {warehouse ? (
            <WarehouseInfo warehouse={warehouse} />
          ) : (
            <p>No warehouse data available.</p>
          )}
        </CCol>

        <CCol lg={4}>
          <CButton
            color="info"
            className="mt-3"
            onClick={() => navigate(`/inventory/${warehouse_id}`)}
          >
            View Inventory
          </CButton>
          <CButton color="secondary" className="mt-3" onClick={() => navigate(-1)}>
            Back to List
          </CButton>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default WarehouseDetail
