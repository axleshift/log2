import React, { Suspense, useEffect, Component } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import PropTypes from 'prop-types'
import './scss/style.scss'
import { AuthProvider } from './context/AuthContext.js'
import ProtectedRoute from './components/Protected/ProtectedRoute.js'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const VendorLogin = React.lazy(() => import('./views/pages/login/VendorLogin'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const ForgotPass = React.lazy(() => import('./views/pages/forgotPass/ForgotPass'))
const Landing = React.lazy(() => import('./views/pages/landing/Landing.js'))
const ContactUs = React.lazy(() => import('./views/pages/contactUs/contact-us.js'))
const NoticeDetails = React.lazy(() => import('./views/pages/NoticeDetails/notice-details.js'))
const NoticeToProceedDetails = React.lazy(
  () => import('./views/pages/NoticeToProceed/notice-to-proceed.js'),
)

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by Error Boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <Navigate to="/404" replace />
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme) // Redux state for theme

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0]

    if (theme) {
      setColorMode(theme)
    } else if (!isColorModeSet()) {
      setColorMode(storedTheme) // Keep Redux-managed theme
    }
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="d-flex justify-content-center align-items-center vh-100">
              <CSpinner color="primary" variant="grow" />
              <div>Loading...</div>
            </div>
          }
        >
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/VendorLogin" element={<VendorLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/404" element={<Page404 />} />
              <Route path="/500" element={<Page500 />} />
              <Route path="/forgotPass" element={<ForgotPass />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/notice-details/:id" element={<NoticeDetails />} />
              <Route path="/notice-to-proceed/:id" element={<NoticeToProceedDetails />} />
              <Route path="/" element={<Landing />} />

              {/* Protected Routes */}
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <DefaultLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
