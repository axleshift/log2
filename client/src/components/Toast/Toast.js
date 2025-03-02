import React, { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const showToast = (message, type = 'default') => {
    switch (type) {
      case 'success':
        toast.success(message)
        break
      case 'error':
        toast.error(message)
        break
      case 'info':
        toast.info(message)
        break
      case 'warning':
        toast.warning(message)
        break
      default:
        toast(message)
        break
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useToast = () => useContext(ToastContext)
