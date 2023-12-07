import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SignIn from './SignIn';
import SignOut from './SignOut';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase.config';

interface NavbarProps {
  newRoomName: string;
  setNewRoomName: React.Dispatch<React.SetStateAction<string>>;
  createRoom: () => Promise<void>;
}

const Navbar: React.FC<NavbarProps> = ({
  newRoomName,
  setNewRoomName,
  createRoom,
}) => {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const inChatRoom = location.pathname.startsWith('/room/');
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCreateRoom = () => {
    if (newRoomName.trim().length >= 5) {
      createRoom();
    } else {
      alert('Room name must be at least 5 characters long.');
    }
  };

  return (
    <div
      className={`navbar-bg text-white p-4 flex justify-between items-center ${
        isScrolled ? 'sticky top-0 z-50' : ''
      }`}
    >
      {inChatRoom ? (
        <Link to="/">
          <span> Chat Rooms</span>
        </Link>
      ) : user ? (
        <div>
          <input
            type="text"
            placeholder=" Room Name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="mr-2 p-2 text-black rounded"
          />
          <button
            className="btn-bg text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
        </div>
      ) : (
        <span>Chat Rooms</span>
      )}
      {user ? <SignOut /> : <SignIn />}
    </div>
  );
};

export default Navbar;
