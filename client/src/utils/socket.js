import { io } from 'socket.io-client'

const socket = io('https://backend-log2.axleshift.com', {
  withCredentials: true,
})

export default socket
