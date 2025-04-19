import React from 'react'
import NotificationList from './NotificationList'
import { getMyNotifications } from '@/services/server/notification.server'

async function page() {

    const notifications = await getMyNotifications()
  return (
    <div>
        <NotificationList notifications={notifications} />
    </div>
  )
}

export default page