import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner, CAlert, CCard, CCardHeader, CCardBody, CButton } from '@coreui/react'
import axios from 'axios'
import InventoryItem from './InventoryItem'

const INVENTORY_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/inventory`

const InventoryDetail = () => {
  const { warehouse_id } = useParams()
  const navigate = useNavigate()
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    const fetchInventory = async () => {
      if (!warehouse_id) {
        setError('Invalid warehouse ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(`${INVENTORY_API_URL}/warehouse/${warehouse_id}`)
        const data = response.data

        if (Array.isArray(data)) {
          setInventory(data)
          if (data.length === 0) {
            setError('No inventory available for this warehouse')
          }
        } else {
          setError('Inventory data is missing or malformed')
        }
      } catch (err) {
        console.error('Error fetching inventory:', err)
        setError('Failed to load inventory. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [warehouse_id])

  if (loading) {
    return (
      <CContainer
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer className="py-4">
        <CAlert color="danger" className="text-center">
          {error}
        </CAlert>
      </CContainer>
    )
  }

  return (
    <CContainer className="py-4">
      <CButton color="secondary" size="sm" onClick={handleBack} className="mb-3">
        Back
      </CButton>

      <CCard>
        <CCardHeader>
          <h3 className="text-center">Inventory for Warehouse {warehouse_id}</h3>
        </CCardHeader>
        <CCardBody>
          {inventory.length > 0 ? (
            inventory.map((item, index) => <InventoryItem key={index} item={item} />)
          ) : (
            <CAlert color="info" className="text-center">
              No inventory available for this warehouse
            </CAlert>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default InventoryDetail
