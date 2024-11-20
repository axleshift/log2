import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Lazy loading components
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const LogisticsDashboard = React.lazy(
  () => import('./views/Management/logistics/LogisticsDashboard'),
)
const WarehouseManagement = React.lazy(
  () => import('./views/Warehouses/warehouse/WarehouseManagement.js'),
)
const IncomingDetails = React.lazy(
  () => import('./views/Management/logistics/incoming/IncomingDetails.js'),
)
const OutgoingDetails = React.lazy(
  () => import('./views/Management/logistics/outgoing/OutgoingDetails.js'),
)
const Profile = React.lazy(() => import('./views/pages/profile/profile.js'))
const WH1 = React.lazy(() => import('./views/inventory/WHInventory/WH1.js'))
const WarehouseDetail = React.lazy(() => import('./components/warehouseDetail/WarehouseDetail.js'))
const InventoryDetail = React.lazy(() => import('./components/warehouseInventory/InventoryDetail'))

const routes = [
  { path: '/', name: 'Home', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/logistics', name: 'Logistics Dashboard', element: LogisticsDashboard },
  { path: '/warehouse', name: 'Warehouse Management', element: WarehouseManagement },
  { path: '/incoming', name: 'Incoming Details', element: IncomingDetails },
  { path: '/outgoing', name: 'Outgoing Details', element: OutgoingDetails },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/WH1', name: 'Inventory', element: WH1 },
  { path: '/warehouseDetail/:warehouse_id', name: 'Warehouse Detail', element: WarehouseDetail },
  { path: '/inventory/:warehouse_id', name: 'Inventory Detail', element: InventoryDetail },
]

export default routes
