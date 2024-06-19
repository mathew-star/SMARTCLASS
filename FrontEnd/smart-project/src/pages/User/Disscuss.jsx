import ChatRoom from '@/components/User/ChatRoom'
import React from 'react'
import { useParams } from 'react-router-dom'

function Disscuss() {
    const {classId}=useParams()
    const current_user = JSON.parse(localStorage.getItem('User'))

  return (
    <div className='flex justify-center'>
      <ChatRoom classId={classId} userId={current_user.id} />
    </div>
  )
}

export default Disscuss
