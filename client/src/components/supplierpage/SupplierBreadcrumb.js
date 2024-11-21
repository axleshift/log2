import React from 'react'
import { useLocation } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import routes from './supplierRoutes'

const SupplierBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  // Function to get route name based on the current pathname
  const getRouteName = (pathname) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : null
  }

  // Generate breadcrumbs from the current location
  const getBreadcrumbs = (location) => {
    const segments = location.split('/').filter(Boolean) // Filter out empty strings
    const breadcrumbs = []

    // Iterate through segments to build breadcrumb items
    segments.reduce((prev, curr, index) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname)

      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index === segments.length - 1,
        })
      }

      return currentPathname
    }, '/')

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
          key={index}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  )
}

export default React.memo(SupplierBreadcrumb)
