import React, { useEffect, useState, useRef } from 'react';
import WebSocketInstance from '@/services/websocket';
import classApi from '@/api/classroomApi';
import Avatar from '@mui/material/Avatar';

const ChatRoom = ({ classId, userId }) => {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const webSocketInstanceRef = useRef(null);
  const messageContainerRef = useRef(null);
  const current_user = JSON.parse(localStorage.getItem('User'));

  useEffect(() => {
    const fetchMessages = async (classId) => {
      try {
        const response = await classApi.fetchMessages(classId);
        setMessages(response);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages(classId);

    if (!webSocketInstanceRef.current) {
      webSocketInstanceRef.current = WebSocketInstance;
      webSocketInstanceRef.current.connect(classId, userId);

      webSocketInstanceRef.current.addMessageListener((message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      });
    }

    return () => {
      if (webSocketInstanceRef.current) {
        webSocketInstanceRef.current.disconnect();
        webSocketInstanceRef.current = null;
      }
    };
  }, [classId, userId]);

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const message = {
        message: messageInput,
      };
      if (webSocketInstanceRef.current) {
        webSocketInstanceRef.current.sendMessage(message);

      }
      setMessageInput('');
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 w-[80%] text-white">
      <header className="p-4 bg-gray-900 text-center">
        <h2 className="text-2xl font-semibold">Chat Room</h2>
      </header>
      <main ref={messageContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages && messages.map((msg, index) => (
          <div key={index} className="flex items-start gap-2.5">
            <Avatar />
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-[#4dcff0] rounded-e-xl rounded-es-xl dark:bg-gray-700">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {msg.username ? msg.username : msg.user.name}
                </span>
                {msg.timestamp && (
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                {msg.message ? msg.message : msg.content}
              </p>
            </div>
          </div>
        ))}
      </main>
      <footer className="p-4 bg-gray-900 flex">
        <input
          type="text"
          value={messageInput}
          onChange={handleInputChange}
          className="flex-1 p-2 rounded-l bg-gray-700 border border-gray-600 focus:outline-none focus:border-gray-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-600 rounded-r hover:bg-blue-500 transition-colors duration-300"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatRoom;
