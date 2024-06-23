import React, { useEffect } from 'react';
import useNotificationStore from '@/store/notificationStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationList = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMark= ()=>{
    try{
    markAllAsRead();
    fetchNotifications();
    toast.success("All Notifications marked")
    }
    catch(error){
        toast.error("Error in Marking-all !")
    }
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <div className="bg-[#151829] shadow-md rounded-lg p-6">
        {notifications&&(
          <>
              <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Notifications</h2>
          {notifications.length > 0 && (
            <button
              onClick={handleMark}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Mark all as read
            </button>
          )}
        </div>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notification) => {
              const date = new Date(notification.timestamp);
              const formattedDate = !isNaN(date) ? date.toLocaleString() : 'Invalid Date';

              return (
                <li
                  key={notification.id}
                  className={`p-4 border rounded-lg ${notification.is_read ? 'bg-gray-100' : 'bg-[#0a1020]'} shadow-sm`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-lg">{notification.message}</p>
                    <span className="text-gray-500 text-sm">{formattedDate}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-2xl font-medium">No Notifications!</p>
          </div>
        )}
          </>

        )}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  );
};

export default NotificationList;
