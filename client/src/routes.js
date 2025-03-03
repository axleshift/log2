import { lazy } from 'react'

// DASHBOARD & GENERAL PAGES
const Dashboard = lazy(() => import('./views/dashboard/Dashboard'))
const Alerts = lazy(() => import('./views/pages/Alerts/Alerts.js'))
const Analytics = lazy(() => import('./views/pages/Analytics/Analytics.js'))
const DocumentTracking = lazy(() => import('./views/pages/DocumentTracking/DocumentTracking.js'))
const DocumentDetails = lazy(() => import('./views/pages/DocumentTracking/DocumentDetails.js'))
const ProfilePage = lazy(() => import('./views/Account/Profile.js'))
const Settings = lazy(() => import('./views/settings/Settings.js'))

// LOGISTICS MANAGEMENT
const LogisticsDashboard = lazy(() => import('./views/Management/logistics/LogisticsDashboard'))
const IncomingDetails = lazy(
  () => import('./views/Management/logistics/incoming/IncomingDetails.js'),
)
const OutgoingDetails = lazy(
  () => import('./views/Management/logistics/outgoing/OutgoingDetails.js'),
)
const Inventory = lazy(() => import('./views/inventory/Inventory.js'))

// PROCUREMENT SECTION
const ProcurementPage = lazy(() => import('./views/pages/Procurement/Procurement.js'))
const ProcurementDetails = lazy(
  () => import('./components/procurement/procurement/ProcurementDetails.js'),
)
const RFQManagement = lazy(() => import('./views/pages/Procurement/RFQManagement.js'))
const RFQDetails = lazy(() => import('./components/procurement/procurement/RFQDetails.js'))
const BuyerRFQDetails = lazy(() => import('./views/pages/Procurement/SubmitQuote.js'))

const ProductCatalog = lazy(() => import('./views/pages/Procurement/product.js'))
const ProductDetails = lazy(() => import('./components/product/ProductDetails.js'))
const ProductCreation = lazy(() => import('./components/product/Creation.js'))

const VendorManagement = lazy(() => import('./views/pages/Procurement/Vendor.js'))
const PurchaseManagement = lazy(() => import('./views/pages/Procurement/PurchaseManagement.js'))
const ShipmentsAndTracking = lazy(() => import('./views/pages/Procurement/Shipments.js'))

const CreateRFQ = lazy(() => import('./components/procurement/procurement/CreateRFQ.js'))
const CreatePO = lazy(() => import('./components/procurement/procurement/CreatePO.js'))

const ApprovalList = lazy(() => import('./views/pages/Procurement/ApprovalList.js'))

// VENDOR SECTION
const VendorRFQList = lazy(() => import('./views/pages/VendorManagement/Vendor.js'))
const VendorRFQDetails = lazy(() => import('./views/pages/VendorManagement/VendorRFQDetails.js'))

const routes = [
  // GENERAL ROUTES
  { path: '/', name: 'Home', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/alerts', name: 'Alerts', element: Alerts },
  { path: '/analytics', name: 'Analytics', element: Analytics },
  { path: '/documentTracking', name: 'Document Tracking', element: DocumentTracking },
  { path: '/documentDetails/:id', name: 'Document Details', element: DocumentDetails },
  { path: '/profile', name: 'Profile', element: ProfilePage },
  { path: '/settings/user-management', name: 'Settings', element: Settings },

  // LOGISTICS ROUTES
  { path: '/logistics', name: 'Logistics Dashboard', element: LogisticsDashboard },
  { path: '/logistics/incoming', name: 'Incoming Shipments', element: IncomingDetails },
  { path: '/logistics/outgoing', name: 'Outgoing Shipments', element: OutgoingDetails },
  { path: '/inventory', name: 'Inventory', element: Inventory },

  // PROCUREMENT ROUTES
  { path: '/procurement', name: 'Procurement Dashboard', element: ProcurementPage },
  { path: '/procurement/:id', name: 'Procurement Details', element: ProcurementDetails },

  // RFQ MANAGEMENT
  { path: '/procurement/rfq-management', name: 'RFQ Management', element: RFQManagement },
  { path: '/procurement/rfq/:id', name: 'RFQ Details', element: RFQDetails },
  { path: '/procurement/rfq/submit/:id', name: 'Submit Quote', element: BuyerRFQDetails },

  // PRODUCT MANAGEMENT
  { path: '/procurement/product-catalog', name: 'Product Catalog', element: ProductCatalog },
  { path: '/procurement/product/:id', name: 'Product Details', element: ProductDetails },
  { path: '/procurement/product/new', name: 'New Product', element: ProductCreation },

  // VENDOR MANAGEMENT
  { path: '/procurement/vendors', name: 'Vendor Management', element: VendorManagement },

  // PURCHASE ORDER & PAYMENTS
  { path: '/procurement/po-payments', name: 'Purchase Management', element: PurchaseManagement },

  // RFQ & PO CREATION
  { path: '/rfq/create/:id', name: 'Create RFQ', element: CreateRFQ },
  { path: '/po/create/:id', name: 'Create PO', element: CreatePO },

  // APPROVALS
  { path: '/admin/approval', name: 'Approval List', element: ApprovalList },

  // VENDOR ROUTES
  { path: '/vendor/rfqs', name: 'Vendor RFQ List', element: VendorRFQList },
  { path: '/vendor/rfqs/:id', name: 'Vendor RFQ Details', element: VendorRFQDetails },
  { path: '/vendor/shipments', name: 'Shipments Tracking', element: ShipmentsAndTracking },
]

export default routes
