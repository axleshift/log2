import React, { Suspense, useEffect, Component } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import PropTypes from 'prop-types'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const ForgotPass = React.lazy(() => import('./views/pages/forgotPass/ForgotPass'))
const Landing = React.lazy(() => import('./views/pages/landing/Landing.js'))
const SuppliersLogin = React.lazy(() => import('./views/pages/login/supplierslogin.js'))

function ProtectedRoute({ children }) {
  const isUserLogin = document.cookie.split('; ').some((row) => row.startsWith('token='))
  const isDevMode = process.env.NODE_ENV === 'development' // MAKE SURE TO UNCOMMENT PROCESS TO BYPASS LOGIN :D

  // Allow access if in development mode
  return isDevMode || isUserLogin ? children : <Navigate to="/login" />
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

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
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0]

    if (theme) {
      setColorMode(theme)
    } else if (!isColorModeSet()) {
      setColorMode(storedTheme)
    }
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
            <div>Loading...</div>
          </div>
        }
      >
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/500" element={<Page500 />} />
            <Route path="/forgotPass" element={<ForgotPass />} />
            <Route path="/supplierslogin" element={<SuppliersLogin />} />
            <Route path="/" element={<Landing />} />

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
    </BrowserRouter>
  )
}

export default App
