import { element } from 'prop-types'
import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Alerts = React.lazy(() => import('./views/pages/Alerts/Alerts.js'))
const Analytics = React.lazy(() => import('./views/pages/Analytics/Analytics.js'))
const DocumentTracking = React.lazy(
  () => import('./views/pages/DocumentTracking/DocumentTracking.js'),
)
const Procurement = React.lazy(() => import('./views/pages/Procurement/Procurement.js'))
const VendorManagement = React.lazy(() => import('./views/pages/VendorManagement/Vendor.js'))
const LogisticsDashboard = React.lazy(
  () => import('./views/Management/logistics/LogisticsDashboard'),
)
//const WarehouseManagement = React.lazy(() => import('./views/Warehouses/warehouse/WarehouseManagement.js'))
const IncomingDetails = React.lazy(
  () => import('./views/Management/logistics/incoming/IncomingDetails.js'),
)
const OutgoingDetails = React.lazy(
  () => import('./views/Management/logistics/outgoing/OutgoingDetails.js'),
)
const Inventory = React.lazy(() => import('./views/inventory/Inventory.js'))
const WarehouseDetail = React.lazy(() => import('./components/warehouseDetail/WarehouseDetail.js'))
const InventoryDetail = React.lazy(() => import('./components/warehouseInventory/InventoryDetail'))
const ProfilePage = React.lazy(() => import('./views/Account/Profile.js'))
const DocumentDetails = React.lazy(
  () => import('./views/pages/DocumentTracking/DocumentDetails.js'),
)
const RFQ = React.lazy(() => import('./views/pages/RFQ/RFQ.js'))
const ViewDetails = React.lazy(() => import('./views/pages/RFQ/viewdetails.js'))
const Settings = React.lazy(() => import('./views/settings/Settings.js'))

const routes = [
  { path: '/', name: 'Home', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/logistics', name: 'Logistics Dashboard', element: LogisticsDashboard },
  //{ path: '/warehouse', name: 'Warehouse Management', element: WarehouseManagement },
  { path: '/incoming', name: 'Incoming Details', element: IncomingDetails },
  { path: '/outgoing', name: 'Outgoing Details', element: OutgoingDetails },
  { path: '/warehouseDetail/:warehouse_id', name: 'Warehouse Detail', element: WarehouseDetail },
  { path: '/inventory/:warehouse_id', name: 'Inventory Detail', element: InventoryDetail },
  { path: '/inventory', name: 'Inventory', element: Inventory },
  { path: '/alerts', name: 'Alerts', element: Alerts },
  { path: '/analytics', name: 'Analytics', element: Analytics },
  { path: '/documentTracking', name: 'DocumentTracking', element: DocumentTracking },
  { path: '/procurement', name: 'Procurement', element: Procurement },
  { path: '/vendor', name: 'VendorManagement', element: VendorManagement },
  { path: '/profile', name: 'ProfilePage', element: ProfilePage },
  { path: '/DocumentDetails/:id', name: 'DocumentDetails', element: DocumentDetails },
  { path: '/RFQ', name: 'RFQ', element: RFQ },
  { path: '/viewdetails', name: 'ViewDetails', element: ViewDetails },
  { path: '/settings', name: 'Settings', element: Settings },
]

export default routes
