import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { SupplierBreadcrumb } from './index'
import { SupplierHeaderDropdown } from './index'

const SupplierHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer
        className="border-bottom px-4 d-flex align-items-center justify-content-between"
        fluid
      >
        {/* Sidebar Toggle */}
        <CHeaderToggler onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        {/* Notifications and User Actions */}
        <CHeaderNav className="d-flex align-items-center ms-auto">
          <CNavItem>
            <CNavLink href="#" aria-label="Notifications">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false} aria-label="Toggle color mode">
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          <SupplierHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <SupplierBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default SupplierHeader
