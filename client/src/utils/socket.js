import { io } from 'socket.io-client'

const socket = io('http://localhost:5058', {
  withCredentials: true,
})

export default socket
