import { element, exact } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Invoice = React.lazy(() => import('./views/filorder/order'))
const TruckingStatus = React.lazy(() => import('./views/trucking/TruckingStatus')) 
const Warehouse = React.lazy (() => import('./views/warehouse/Warehouse'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard',element: Dashboard },
  { path: '/invoice', name: 'Invoice',element: Invoice, exact: true},
  { path: '/truckingstatus' , name: 'TruckingStatus', element: TruckingStatus, exact: true},
  { path: '/warehouse' , name: 'Warehouse', element: Warehouse, exact:true},
 
 
 
] 

export default routes;
