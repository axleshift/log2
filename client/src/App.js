import React, { Suspense, useEffect, Component } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import { UserProvider } from './context/UserContext.js'
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
const UserProfilePage = React.lazy(() => import('./views/pages/user/UserProfilePage'))

// Protected Route Component
function ProtectedRoute({ children }) {
  const isUserLogin = !!localStorage.getItem('token') // Check for token in localStorage
  return isUserLogin ? children : <Navigate to="/login" />
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by Error Boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>
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
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]

    if (theme) {
      setColorMode(theme)
    }

    if (!isColorModeSet()) {
      setColorMode(storedTheme)
    }
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <UserProvider>
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
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/register" name="Register Page" element={<Register />} />
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
              <Route exact path="/forgotPass" name="ForgotPass" element={<ForgotPass />} />
              <Route exact path="/profile" name="User Profile" element={<UserProfilePage />} />

              <Route
                path="*"
                name="Home"
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
    </UserProvider>
  )
}

export default App
