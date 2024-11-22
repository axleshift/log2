import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from './supplierRoutes'

const SupplierContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route key={idx} path={route.path} name={route.name} element={<route.element />} />
              )
            )
          })}
          {/* Redirect to Supplier page or show a 404 page */}
          <Route path="*" element={<Navigate to="/supplierpage" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(SupplierContent)
