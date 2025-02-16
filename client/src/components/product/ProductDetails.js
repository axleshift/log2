import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CContainer, CCard, CCardBody, CCardHeader, CSpinner, CAlert } from '@coreui/react'

const PRODUCT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/product`

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${PRODUCT_API_URL}/${id}`)
        if (!response.ok) throw new Error('Failed to fetch product details')
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <CSpinner />
  if (error) return <CAlert color="danger">{error}</CAlert>

  return (
    <CContainer>
      <CCard>
        <CCardHeader>{product.itemName}</CCardHeader>
        <CCardBody>
          <p>{product.description}</p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Price:</strong> ${product.unitPrice}
          </p>
          <p>
            <strong>Stock:</strong> {product.stockQuantity}
          </p>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default ProductDetails
