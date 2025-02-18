import { lazy } from 'react'

const Dashboard = lazy(() => import('./views/dashboard/Dashboard'))
const Alerts = lazy(() => import('./views/pages/Alerts/Alerts.js'))
const Analytics = lazy(() => import('./views/pages/Analytics/Analytics.js'))
const DocumentTracking = lazy(() => import('./views/pages/DocumentTracking/DocumentTracking.js'))
const LogisticsDashboard = lazy(() => import('./views/Management/logistics/LogisticsDashboard'))
const IncomingDetails = lazy(
  () => import('./views/Management/logistics/incoming/IncomingDetails.js'),
)
const OutgoingDetails = lazy(
  () => import('./views/Management/logistics/outgoing/OutgoingDetails.js'),
)
const Inventory = lazy(() => import('./views/inventory/Inventory.js'))
const ProfilePage = lazy(() => import('./views/Account/Profile.js'))
const DocumentDetails = lazy(() => import('./views/pages/DocumentTracking/DocumentDetails.js'))
const Settings = lazy(() => import('./views/settings/Settings.js'))

// BIDDING SECTION
const BiddingManagement = lazy(() => import('./views/pages/Procurement/Bidding.js'))

// PROCUREMENT SECTION
const Procurement = lazy(() => import('./views/pages/Procurement/RFQManagement.js'))
const PurchaseManagement = lazy(() => import('./views/pages/Procurement/PurchaseManagement.js'))
const Payments = lazy(() => import('./views/pages/Procurement/Payments.js'))
const product = lazy(() => import('./views/pages/Procurement/product.js'))
const ContractManagement = lazy(() => import('./views/pages/Procurement/Contract.js'))
const Vendors = lazy(() => import('./views/pages/Procurement/Vendor.js'))
const ProductDetails = lazy(() => import('./components/product/ProductDetails.js'))
//const ProductCreation = lazy(() => import('./components/product/Creation.js'))

const RFQManagement = lazy(() => import('./views/pages/Procurement/RFQManagement.js'))

const RFQDetails = lazy(() => import('./components/procurement/RFQ/RFQDetails.js'))

// VENDOR SECTION
const Vendor = lazy(() => import('./views/pages/VendorManagement/Vendor.js'))
const VendorBidList = lazy(() => import('./views/pages/VendorManagement/VendorBidList.js'))
//const SubmitQuotes = lazy(() => import('./views/pages/VendorManagement/SubmitQuote.js'));
const RFQVendorManagement = lazy(() => import('./views/pages/VendorManagement/RFQVendors.js'))

const routes = [
  { path: '/', name: 'Home', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/logistics', name: 'Logistics Dashboard', element: LogisticsDashboard },
  { path: '/incoming', name: 'Incoming Details', element: IncomingDetails },
  { path: '/outgoing', name: 'Outgoing Details', element: OutgoingDetails },
  { path: '/inventory', name: 'Inventory', element: Inventory },
  { path: '/alerts', name: 'Alerts', element: Alerts },
  { path: '/analytics', name: 'Analytics', element: Analytics },
  { path: '/documentTracking', name: 'DocumentTracking', element: DocumentTracking },
  { path: '/profile', name: 'ProfilePage', element: ProfilePage },
  { path: '/DocumentDetails/:id', name: 'DocumentDetails', element: DocumentDetails },
  { path: '/settings/user-management', name: 'Settings', element: Settings },

  // PROCUREMENT PATH SECTION -_-
  { path: '/procurement/rfq-management', name: 'Procurement', element: Procurement },
  {
    path: '/procurement/purchaseManagement',
    name: 'Purchase Management',
    element: PurchaseManagement,
  },
  { path: '/procurement/payments-invoices', name: 'Payments', element: Payments },
  { path: '/procurement/product-catalog', name: 'Product', element: product },
  { path: '/procurement/product/:id', name: 'Product Details', element: ProductDetails },
  //{ path: '/procurement/product/new', name: 'Product Creation', element: ProductCreation },

  {
    path: '/procurement/procurement/contracts',
    name: 'Contract Management',
    element: ContractManagement,
  },
  { path: '/procurement/RFQ/Management', name: 'RFQ Management', element: RFQManagement },
  { path: '/procurement/bidding', name: 'Bidding Management', element: BiddingManagement },
  { path: '/procurement/vendors', name: 'Vendor Management', element: Vendors },
  { path: '/procurement/rfqs/:id', name: 'RFQDetails', element: RFQDetails },

  // VENDOR RELATED PATH SECTION :P
  { path: '/vendor/vendor-manage', name: 'Vendor', element: Vendor },
  { path: '/vendor/bidList', name: 'VendorBidList', element: VendorBidList },
  { path: '/rfqs/:id', name: 'SubmitQuoteForm', element: RFQVendorManagement },
]

export default routes
