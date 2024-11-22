import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CImage,
} from '@coreui/react'

import { SupplierSidebarNav } from './SupplierSidebarNav'
import navigation from './_nav'

const SupplierSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const handleSidebarVisibility = (visible) => {
    dispatch({ type: 'set', sidebarShow: visible })
  }

  const toggleSidebarUnfoldable = () => {
    dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={handleSidebarVisibility}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CImage
            fluid
            src="/image/logo.png" // Path from 'public' folder
            className="sidebar-brand-full"
            height={30}
          />
          <CImage
            src="/image/favicon.png" // Path from 'public' folder
            className="sidebar-brand-narrow"
            height={30}
          />
        </CSidebarBrand>
        <CCloseButton className="d-lg-none" dark onClick={() => handleSidebarVisibility(false)} />
      </CSidebarHeader>

      <SupplierSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={toggleSidebarUnfoldable} />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(SupplierSidebar)
