import React, { useState } from 'react';
import { auth } from '../utils/firebase.config';
import { sendMessage } from '../api/firestore';

interface SendMessageProps {
  scroll: React.RefObject<HTMLDivElement>;
  disabled: boolean;
}

const SendMessage: React.FC<
  SendMessageProps & { selectedRoomId: string | null }
> = ({ scroll, disabled, selectedRoomId }) => {
  const [msg, setMsg] = useState<string>('');

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser || !selectedRoomId) return;

    const { uid, photoURL } = auth.currentUser;
    await sendMessage(selectedRoomId, uid, photoURL || '', msg);
    setMsg('');
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full input-bg pb-4 px-10 mt-10">
      <form onSubmit={handleSendMessage} className="flex items-center">
        <input
          className="flex-1 navbar-bg text-white rounded-l-full py-4 px-4 outline-none"
          placeholder={
            auth.currentUser ? 'Message...' : 'Please Sign in to chat'
          }
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || msg.trim() === ''}
          className="btn-bg text-white rounded-r-full py-4 px-6"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
