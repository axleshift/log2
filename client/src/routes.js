import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Order = React.lazy(() => import('./views/order/order'))
const Docutrack = React.lazy(() => import('./views/document tracking/Docutrack')) 
const VehicleReserv = React.lazy (() => import ('./views/vehiclereserv/VehicleReserv'))
const FleetManage = React.lazy(() => import ('./views/fleetmanage/FleetManage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/dashboard', name: 'Order', element: Order },
  { path: '/docutrack' , name: 'Docutrack', element: Docutrack },
  { path: '/vehiclereserv' , name: 'VehicleReserv', element: VehicleReserv},
  { path: '/fleetmanage' , name: 'FleetManage' ,element: FleetManage},
]

export default routes
