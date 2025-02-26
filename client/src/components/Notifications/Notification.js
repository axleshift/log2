import React from 'react'
import { useEffect, useState } from 'react'
import socket from '../../utils/socket.js'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    socket.on('procurementApproved', (data) => {
      console.log('Procurement approved:', data)
      setNotifications((prev) => [...prev, data.message])
    })

    return () => {
      socket.off('procurementApproved')
    }
  }, [])

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif}</li>
        ))}
      </ul>
    </div>
  )
}

export default Notifications
