'use client'
import { notificationServices } from '@/services/client/notification.client';
import { INotificationTypes } from '@/types/notificationTypes';
import React, { useEffect, useState } from 'react';

// interface NotificationPageProps {
//   notifications:INotificationTypes[];
// }

const NotificationList: React.FC= () => {
  const [notificationList, setNotificationList] = useState<INotificationTypes[]>([]);

  useEffect(()=>{
   async function fetchNotifications(){
      try {
        const notifications = await notificationServices.getMyNotifications()
        setNotificationList(notifications)
      } catch (error) {
        console.log(error)
      }
    }
    fetchNotifications()
  },[])
  // Split notifications into read and unread
  const unreadNotifications = notificationList.filter(notif => !notif.isRead);
  const readNotifications = notificationList.filter(notif => notif.isRead);

  // Mark a single notification as read
  const markAsRead = async (notificationId: string) => {
    try {
    await notificationServices.readANotifications(notificationId)
      
      setNotificationList(prev => prev.map(notif => 
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      ));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationServices.readAllNotifications()
      
      setNotificationList(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Function to determine icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return (
          <div className="bg-green-500 rounded-full p-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'ERROR':
        return (
          <div className="bg-red-500 rounded-full p-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'WARNING':
        return (
          <div className="bg-yellow-500 rounded-full p-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'INFO':
      default:
        return (
          <div className="bg-cyan-500 rounded-full p-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  // Function to render a single notification
  const renderNotification = (notification: INotificationTypes, isRead: boolean) => (
    <div 
      key={notification._id} 
      className={`flex items-start gap-4 p-4 rounded-lg mb-3 border transition ${
        isRead ? 
        'bg-gray-800 border-gray-700 opacity-70' : 
        'bg-gray-800 border-gray-700'
      }`}
    >
      <div className="flex-shrink-0">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${isRead ? 'text-gray-300' : 'text-white'}`}>
            {notification.title}
          </h3>
          <span className="text-xs text-gray-400">
            {new Date(notification.createdAt).toLocaleDateString()} 
            {' '}
            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-gray-400 mt-1">{notification.message}</p>
      </div>
      {!isRead && (
        <button 
          onClick={() => markAsRead(notification._id)}
          className="flex-shrink-0 text-sm text-cyan-500 hover:text-cyan-400"
        >
          Mark as read
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadNotifications.length > 0 && (
            <button 
              onClick={markAllAsRead}
              className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 px-4 py-2 rounded-md font-medium transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Unread notifications section */}
        {unreadNotifications.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">New</h2>
              <span className="bg-cyan-500 text-gray-900 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {unreadNotifications.length}
              </span>
            </div>
            <div>
              {unreadNotifications.map(notification => renderNotification(notification, false))}
            </div>
          </div>
        )}

        {/* Read notifications section */}
        {readNotifications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-300">Earlier</h2>
              <span className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {readNotifications.length}
              </span>
            </div>
            <div>
              {readNotifications.map(notification => renderNotification(notification, true))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {notificationList.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex bg-gray-800 rounded-full p-6 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No notifications yet</h3>
            <p className="text-gray-400">When you get notifications, they will show up here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList