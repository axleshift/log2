import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'

const PRODUCT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/product`

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${PRODUCT_API_URL}/${id}`)
        if (!response.ok) throw new Error('Failed to fetch product details')
        const data = await response.json()
        console.log('🚀 Fetched Product Data:', data)
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading)
    return (
      <CContainer className="text-center py-4">
        <CSpinner color="primary" size="sm" />
        <p className="mt-2">Loading product details...</p>
      </CContainer>
    )

  if (error) return <CAlert color="danger">{error}</CAlert>

  return (
    <CContainer className="py-4">
      <CButton color="secondary" onClick={() => navigate(-1)}>
        ← Back
      </CButton>

      {product && (
        <CRow className="mt-4">
          <CCol md={6}>
            {product?.images?.length ? (
              <img
                src={product.images[0]}
                alt={product?.itemName ?? 'Product'}
                className="img-fluid rounded"
              />
            ) : (
              <p>No image available</p>
            )}
          </CCol>

          <CCol md={6}>
            <CCard>
              <CCardHeader className="fw-bold">{product?.itemName ?? 'N/A'}</CCardHeader>
              <CCardBody>
                <p>
                  <strong>Description:</strong>{' '}
                  {product?.description ?? 'No description available.'}
                </p>
                <p>
                  <strong>Category:</strong> {product?.category ?? 'Uncategorized'}
                </p>
                <p>
                  <strong>Price:</strong> $
                  {product?.price ? Number(product.price).toFixed(2) : '0.00'}
                </p>
                <p>
                  <strong>Stock Quantity:</strong> {product?.stockQuantity ?? 'N/A'}
                </p>
                <p>
                  <strong>Status:</strong> {product?.status ?? 'Unknown'}
                </p>
                <p>
                  <strong>SKU:</strong> {product?.sku ?? 'N/A'}
                </p>
                <p>
                  <strong>Weight:</strong> {product?.weight ? `${product.weight} kg` : 'N/A'}
                </p>
                <p>
                  <strong>Dimensions:</strong>{' '}
                  {product?.dimensions &&
                  (product.dimensions.length ||
                    product.dimensions.width ||
                    product.dimensions.height)
                    ? `${product.dimensions.length ?? 'N/A'} x ${product.dimensions.width ?? 'N/A'} x ${product.dimensions.height ?? 'N/A'} cm`
                    : 'N/A'}
                </p>
                <p>
                  <strong>Manufacturer:</strong> {product?.manufacturer ?? 'N/A'}
                </p>
                <p>
                  <strong>Tags:</strong> {product?.tags?.length ? product.tags.join(', ') : 'N/A'}
                </p>
                <p>
                  <strong>Color:</strong> {product?.color ?? 'N/A'}
                </p>
                <p>
                  <strong>Size:</strong> {product?.size ?? 'N/A'}
                </p>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </CContainer>
  )
}

export default ProductDetails
