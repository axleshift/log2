import { element } from 'prop-types'
import React, { Suspense } from 'react'

// Lazy loading components
const SupplierProfile = React.lazy(() => import('../../views/supplierprofile/supplierprofile'))
const SuppliersPage = React.lazy(() => import('../../views/pages/supplier/supplierpage'))
const OrdersSection = React.lazy(() => import('../../views/orderssection/orderssection'))
const InvoiceAndPaymentStatus = React.lazy(() => import('../../views/Status/Status'))
const SupportHelpdesk = React.lazy(() => import('../../views/Support/supporthelpdesk'))

const routes = [
  { path: '*', name: 'Home', element: SuppliersPage },
  { path: 'supplierprofile', name: 'SupplierProfile', element: SupplierProfile },
  { path: 'orderssection', name: 'OrdersSection', element: OrdersSection },
  { path: 'status', name: 'InvoiceAndPaymentStatus', element: InvoiceAndPaymentStatus },
  { path: 'support', name: 'SupportHelpdesk', element: SupportHelpdesk },
]

export default routes
