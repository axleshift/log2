import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CAlert,
} from '@coreui/react'

const PRODUCT_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/product`

function ProductCatalog() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(PRODUCT_API_URL)
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products.filter((product) => {
      const isCategoryMatch = selectedCategory === 'All' || product.category === selectedCategory
      const isPriceMatch = product.unitPrice >= priceRange[0] && product.unitPrice <= priceRange[1]

      const isSearchMatch =
        (product.itemName && product.itemName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description &&
          product.description.toLowerCase().includes(searchQuery.toLowerCase()))

      return isCategoryMatch && isPriceMatch && isSearchMatch
    })
    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, priceRange, products])

  return (
    <CContainer className="py-4">
      <h2 className="fw-bold text-center pb-4">Product Catalog</h2>

      {/* Filters */}
      <CRow className="mb-4">
        <CCol md={4}>
          <input
            type="text"
            placeholder="Search by name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
        </CCol>
        <CCol md={4}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Footwear">Footwear</option>
            <option value="Apparel">Apparel</option>
          </select>
        </CCol>
        <CCol md={4}>
          <label>
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="form-range"
          />
        </CCol>
      </CRow>

      {/* Error Handling */}
      {error && <CAlert color="danger">{error}</CAlert>}

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center">
          <CSpinner color="primary" size="sm" />
          <p className="mt-2">Loading products...</p>
        </div>
      ) : (
        <CRow className="g-4">
          {filteredProducts.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <CCol key={product._id} md={4}>
                <CCard className="shadow-sm">
                  <CCardHeader className="fw-bold">{product.itemName}</CCardHeader>
                  <CCardBody>
                    <p className="text-muted">
                      {product.description || 'No description available.'}
                    </p>
                    <p className="small">
                      <strong>Category:</strong> {product.category || 'Uncategorized'}
                    </p>
                    <p className="small">
                      <strong>Price:</strong> $
                      {product.unitPrice ? Number(product.unitPrice).toFixed(2) : '0.00'}
                    </p>
                    <p className="small">
                      <strong>Stock:</strong> {product.stockQuantity ?? 'N/A'}
                    </p>
                    <p className="small">
                      <strong>Vendor:</strong> {product.vendorId?.name || 'N/A'}
                    </p>
                    <CButton
                      color="primary"
                      className="mt-2"
                      onClick={() => onViewDetails(product._id)}
                    >
                      View Details
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            ))
          )}
        </CRow>
      )}
    </CContainer>
  )
}

export default ProductCatalog
