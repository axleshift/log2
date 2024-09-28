import { element, exact } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Invoice = React.lazy(() => import('./views/filorder/order'))
const OrderStatus = React.lazy(() => import('./views/orderstatus/OrderStatus')) 
const VehicleReserv = React.lazy (() => import ('./views/vehiclereserv/VehicleReserv'))
const FleetManage = React.lazy(() => import ('./views/fleetmanage/FleetManage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard',element: Dashboard },
  { path: '/invoice', name: 'Invoice',element: Invoice, exact: true},
  { path: '/orderstatus' , name: 'OrderStatus', element: OrderStatus, exact: true},
  { path: '/vehiclereserv' , name: 'VehicleReserv', element: VehicleReserv, exact: true},
  { path: '/fleetmanage' , name: 'FleetManage' ,element: FleetManage, exact: true},
] 

export default routes;
