import React, { useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import ProductCatalog from '../../../components/product/Catalog'

function ProductPage() {
  const [activeTab, setActiveTab] = useState(1)
  const [selectedProductId, setSelectedProductId] = useState(null)

  const handleViewDetails = (productId) => {
    setSelectedProductId(productId)
    setActiveTab(2)
  }

  return (
    <CContainer className="py-4">
      <CRow>
        <CCol>
          <CCard className="shadow-sm">
            <CCardBody>
              <h1 className="text-2xl fw-bold pb-3">Product Page</h1>

              {/* Tab Navigation */}
              <CNav variant="tabs" role="tablist">
                <CNavItem>
                  <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
                    Product Catalog
                  </CNavLink>
                </CNavItem>
              </CNav>

              {/* Tab Content */}
              <CTabContent>
                <CTabPane role="tabpanel" visible={activeTab === 1}>
                  <ProductCatalog onViewDetails={handleViewDetails} />
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductPage
