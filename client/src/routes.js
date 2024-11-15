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
const WarehouseHInventory = React.lazy(
  () => import('./components/warehouseInventory/WarehouseHInventory.js'),
)
const WarehouseIInventory = React.lazy(
  () => import('./components/warehouseInventory/WarehouseIInventory.js'),
)
const SortingPage = React.lazy(() => import('./views/sorting/SortingPage'))

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
  { path: '/warehouse-h-inventory', name: 'Warehouse H Inventory', element: WarehouseHInventory },
  { path: '/warehouse-i-inventory', name: 'Warehouse I Inventory', element: WarehouseIInventory },
  { path: '/sorting', name: 'Sorting Page', element: SortingPage },
]

export default routes
