import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMessages } from '../api/firestore';
import { auth } from '../utils/firebase.config';
import SendMessage from './SendMessage';
import { Message } from '../types/messagType.types';
import { getRoomById } from '../api/firestore';

const Chat: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const selectedRoomId = roomId ?? null;
  const scroll = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    if (roomId) {
      getRoomById(roomId, setRoomName);
      getMessages(roomId, setMessages);
    }
  }, [roomId]);

  return (
    <div className="flex flex-col h-full p-5">
      <h1 className="text-center font-extrabold room-name-color mb-5 text-xl">
        {roomName}
      </h1>
      <div className="flex-1 overflow-y-auto px-20 mb-20">
        {messages.map(({ id, text, photoURL, uid, displayName, createdAt }) => (
          <div
            key={id}
            className={`flex ${
              uid === auth.currentUser?.uid ? 'justify-end' : 'justify-start'
            } my-2`}
          >
            <div
              className={`relative flex items-center ${
                uid === auth.currentUser?.uid ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`absolute ${
                  uid === auth.currentUser?.uid ? '-right-14' : '-left-14'
                } top-1/2 transform -translate-y-1/2`}
              >
                <img
                  src={photoURL}
                  alt={displayName || 'User'}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>
              <div
                className={`chat-bg text-white p-3 rounded-lg max-w-xs md:max-w-md`}
              >
                <div className="text-xs opacity-75">
                  {displayName || 'Anonymous'}
                </div>
                <div>{text}</div>
                <div className="text-xs opacity-75">
                  {createdAt?.toDate().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={scroll}></div>
      </div>

      <SendMessage
        scroll={scroll}
        disabled={!auth.currentUser}
        selectedRoomId={selectedRoomId}
      />
    </div>
  );
};

export default Chat;
