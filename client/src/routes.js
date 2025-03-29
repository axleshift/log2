import { element } from 'prop-types'
import { lazy } from 'react'
import CreateAwardNotice from './views/pages/Award/award.js'
import VendorQuotes from './views/pages/Quotes/Quotes.js'
import ShipmentsList from './views/pages/shipment/ShipmentList.js'
import CreateAnnouncement from './views/pages/Announcement/announcement.js'
import CreateNotification from './views/pages/Notification/Notification.js'

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

// PROCUREMENT SECTION
const product = lazy(() => import('./views/pages/Procurement/product.js'))
const VendorManagement = lazy(() => import('./views/pages/Procurement/Vendor.js'))
const ProductDetails = lazy(() => import('./components/product/ProductDetails.js'))
const ProductCreation = lazy(() => import('./components/product/Creation.js'))
const RFQManagement = lazy(() => import('./views/pages/Procurement/RFQManagement.js'))
const ProcurementPage = lazy(() => import('./views/pages/Procurement/Procurement.js'))
const ProcurementDetails = lazy(
  () => import('./components/procurement/procurement/ProcureDetails.js'),
)
const RFQDetails = lazy(() => import('./components/procurement/procurement/RFQDetails.js'))
const PurchaseManagement = lazy(() => import('./views/pages/Procurement/PurchaseManagement.js'))
const ShipmentsAndTracking = lazy(() => import('./views/pages/Procurement/Shipments.js'))
const CreateRFQ = lazy(() => import('./components/procurement/procurement/CreateRFQ.js'))
const CreatePO = lazy(() => import('./components/procurement/procurement/CreatePO.js'))
const ApprovalList = lazy(() => import('./views/pages/Procurement/ApprovalList.js'))
const SubmittedQuotesPage = lazy(() => import('./views/pages/Procurement/SubmitQuote.js'))

// VENDOR SECTION
const VendorRFQList = lazy(() => import('./views/pages/VendorManagement/Vendor.js'))
const VendorRFQDetails = lazy(() => import('./views/pages/VendorManagement/VendorRFQDetails.js'))

const routes = [
  { path: '/', name: 'Home', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/award', name: 'Award', element: CreateAwardNotice },
  { path: '/announcement', name: 'Announcement', element: CreateAnnouncement },
  { path: '/notification', name: 'Notification', element: CreateNotification },
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
  { path: '/procurement/rfq-management', name: 'RFQManagement', element: RFQManagement },
  { path: '/procurement/product-catalog', name: 'Product', element: product },
  { path: '/procurement/product/:id', name: 'Product Details', element: ProductDetails },
  { path: '/procurement/product/new', name: 'Product Creation', element: ProductCreation },
  { path: '/procurement/procurement', name: 'ProcurementPage', element: ProcurementPage },
  { path: '/procurement/:id', name: 'ProcurementDetails', element: ProcurementDetails },
  { path: '/procurement/rfq/:id', name: 'RFQDetails', element: RFQDetails },
  { path: '/procurement/vendors', name: 'Vendor Management', element: VendorManagement },
  { path: '/procurement/po-payments', name: 'Purchase Management', element: PurchaseManagement },
  { path: '/procurement/shipments', name: 'Shipments Tracking', element: ShipmentsAndTracking },
  { path: '/rfq/create/:id', name: 'RFQ', element: CreateRFQ },
  { path: '/po/create/:id', name: 'PO', element: CreatePO },
  { path: '/admin/approval', name: ' Approval Page', element: ApprovalList },
  { path: '/procurement/submit-quote', name: 'Submit Quote Page', element: SubmittedQuotesPage },

  // VENDOR RELATED PATH SECTION :P
  { path: '/vendor/rfqs', name: 'Vendor RFQ List', element: VendorRFQList },
  { path: '/vendor/quotes', name: 'Quotes Request', element: VendorQuotes },
  { path: '/vendor/shipments', name: 'Shipment and Delivery', element: ShipmentsList },
  { path: '/vendor/rfqs/:id', name: 'Vendor RFQ Details', element: VendorRFQDetails },
]

export default routes
