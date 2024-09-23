import { element, exact } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Order = React.lazy(() => import('./views/filorder/order'))
const Docutrack = React.lazy(() => import('./views/document tracking/Docutrack')) 
const VehicleReserv = React.lazy (() => import ('./views/vehiclereserv/VehicleReserv'))
const FleetManage = React.lazy(() => import ('./views/fleetmanage/FleetManage'))

const routes = [
 
  { path: '/dashboard', name: 'Dashboard',element: Dashboard ,exact: true  },
  { path: '/order', name: 'Order',element: Order, exact: true},
  { path: '/docutrack' , name: 'Docutrack', element: Docutrack, exact: true},
  { path: '/vehiclereserv' , name: 'VehicleReserv', element: VehicleReserv, exact: true},
  { path: '/fleetmanage' , name: 'FleetManage' ,element: FleetManage, exact: true},
] 

export default routes;
