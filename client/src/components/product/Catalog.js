import React, { useEffect, useState } from 'react'
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
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [categories, setCategories] = useState([])
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

        const uniqueCategories = ['All', ...new Set(data.map((p) => p.category).filter(Boolean))]
        setCategories(uniqueCategories)

        const maxPrice = Math.max(...data.map((p) => parseFloat(p.price || 0)), 20000)
        setPriceRange([0, maxPrice])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const term = searchQuery.toLowerCase()

    const filtered = products.filter((product) => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory

      const price = parseFloat(product.price || 0)
      const priceMatch = price >= priceRange[0] && price <= priceRange[1]

      const searchMatch =
        !term ||
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)

      return categoryMatch && priceMatch && searchMatch
    })

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, priceRange, products])

  const onViewDetails = (productId) => navigate(`/procurement/product/${productId}`)
  const onAddProduct = () => navigate('/procurement/product/new')

  return (
    <CContainer className="py-4">
      <CRow className="align-items-center mb-4">
        <CCol md={8}>
          <h2 className="fw-bold">Product Catalog</h2>
        </CCol>
        <CCol md={4} className="text-end">
          <CButton color="success" onClick={onAddProduct}>
            + Add Product
          </CButton>
        </CCol>
      </CRow>

      {/* Filters */}
      <CRow className="mb-4">
        <CCol md={4}>
          <input
            type="text"
            placeholder="Search..."
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </CCol>
        <CCol md={4}>
          <label>
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max={priceRange[1]}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="form-range"
          />
        </CCol>
      </CRow>

      {/* Results */}
      {error && <CAlert color="danger">{error}</CAlert>}
      {loading ? (
        <div className="text-center">
          <CSpinner color="primary" />
          <p>Loading products...</p>
        </div>
      ) : (
        <CRow className="g-4">
          {filteredProducts.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <CCol key={product._id} md={4}>
                <CCard className="shadow-sm">
                  {product.images?.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                  )}
                  <CCardHeader className="fw-bold">{product.name}</CCardHeader>
                  <CCardBody>
                    <p className="text-muted">{product.description?.slice(0, 60)}...</p>
                    <p>
                      <strong>Category:</strong> {product.category || 'Uncategorized'}
                    </p>
                    <p>
                      <strong>Price:</strong> ${parseFloat(product.price || 0).toFixed(2)}
                    </p>
                    <p>
                      <strong>Stock:</strong> {product.stockQuantity ?? 'N/A'}
                    </p>
                    <CButton color="primary" onClick={() => onViewDetails(product._id)}>
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
