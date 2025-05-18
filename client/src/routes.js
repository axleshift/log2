import { lazy } from 'react'
import { element } from 'prop-types'

// Direct imports
import CreateAwardNotice from './views/pages/Award/award.js'
import ShipmentsList from './views/pages/shipment/ShipmentList.js'
import CreateAnnouncement from './views/pages/Announcement/announcement.js'
import CreateNotification from './views/pages/Notification/Notification.js'
import BudgetRequestPage from './views/pages/budgetRequest/budgetRequest.js'
import InvoicePage from './views/invoice/invoice.js'
import ChatbotCard from './views/pages/chatbot/chatbot.js'

// Lazy-loaded components
const Dashboard = lazy(() => import('./views/dashboard/Dashboard'))
const Alerts = lazy(() => import('./views/pages/Alerts/Alerts.js'))
const Analytics = lazy(() => import('./views/pages/Analytics/Analytics.js'))
const Inventory = lazy(() => import('./views/inventory/Inventory.js'))
const ProfilePage = lazy(() => import('./views/Account/Profile.js'))
const Settings = lazy(() => import('./views/settings/Settings.js'))

// Procurement
const product = lazy(() => import('./views/pages/Procurement/product.js'))
const ProductDetails = lazy(() => import('./components/product/ProductDetails.js'))
const ProductCreation = lazy(() => import('./components/product/Creation.js'))
const RFQManagement = lazy(() => import('./views/pages/Procurement/RFQManagement.js'))
const ProcurementPage = lazy(() => import('./views/pages/Procurement/Procurement.js'))
const ProcurementDetails = lazy(
  () => import('./components/procurement/procurement/ProcureDetails.js'),
)
const RFQDetails = lazy(() => import('./components/procurement/procurement/RFQDetails.js'))
const PurchaseManagement = lazy(() => import('./views/pages/Procurement/PurchaseManagement.js'))
const CreateRFQ = lazy(() => import('./components/procurement/procurement/CreateRFQ.js'))
const ApprovalList = lazy(() => import('./views/pages/Procurement/ApprovalList.js'))
const SubmittedQuotesPage = lazy(() => import('./views/pages/Procurement/SubmitQuote.js'))
const DeliveryTrackingWithList = lazy(() => import('./views/pages/Procurement/Shipments.js'))

// Vendor Management
const VendorRFQList = lazy(() => import('./views/pages/VendorManagement/Vendor.js'))
const VendorRFQDetails = lazy(() => import('./views/pages/VendorManagement/VendorRFQDetails.js'))
const Vendors = lazy(() => import('./views/pages/Procurement/VendorManagement.js'))
const ShipmentsAndTracking = lazy(() => import('./views/pages/shipment/ShipmentManagement.js'))

// Routes
const routes = [
  { path: '/', name: 'Home', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/award', name: 'Award', element: CreateAwardNotice },
  { path: '/announcement', name: 'Announcement', element: CreateAnnouncement },
  { path: '/notification', name: 'Notification', element: CreateNotification },
  { path: '/inventory', name: 'Inventory', element: Inventory },
  { path: '/alerts', name: 'Alerts', element: Alerts },
  { path: '/analytics', name: 'Analytics', element: Analytics },
  { path: '/profile', name: 'ProfilePage', element: ProfilePage },
  { path: '/settings/user-management', name: 'Settings', element: Settings },

  // Procurement
  { path: '/procurement/rfq-management', name: 'RFQ Management', element: RFQManagement },
  { path: '/procurement/product-catalog', name: 'Product Catalog', element: product },
  { path: '/budget/request', name: 'Budget Request', element: BudgetRequestPage },
  { path: '/procurement/product/:id', name: 'Product Details', element: ProductDetails },
  { path: '/procurement/product/new', name: 'Create Product', element: ProductCreation },
  { path: '/procurement', name: 'Procurement Dashboard', element: ProcurementPage },
  { path: '/procurement/:id', name: 'Procurement Details', element: ProcurementDetails },
  { path: '/procurement/rfq/:id', name: 'RFQ Details', element: RFQDetails },
  { path: '/procurement/po-payments', name: 'Purchase Management', element: PurchaseManagement },
  { path: '/vendor/shipments', name: 'Shipment Tracking', element: ShipmentsAndTracking },
  { path: '/rfq/create/:id', name: 'Create RFQ', element: CreateRFQ },
  { path: '/admin/approval', name: 'Approval List', element: ApprovalList },
  { path: '/procurement/submit-quote', name: 'Submit Quote', element: SubmittedQuotesPage },
  {
    path: '/procurement/shipments',
    name: 'Shipments List and Tracking',
    element: DeliveryTrackingWithList,
  },

  // Vendor Section
  { path: '/vendor/quotes', name: 'Vendor RFQs', element: VendorRFQList },
  { path: '/vendor/invoice', name: 'Invoice Page', element: InvoicePage },
  { path: '/vendor/communication', name: 'Vendor Communication', element: ChatbotCard },
  { path: '/vendor/shipments-records', name: 'Vendor Shipments', element: ShipmentsList },
  { path: '/vendor/rfqs/:id', name: 'Vendor RFQ Details', element: VendorRFQDetails },
  { path: '/vendor/management', name: 'VendorManagement', element: Vendors },
]

export default routes
