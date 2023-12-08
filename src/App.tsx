import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import RoomCard from './components/RoomCard';
import Navbar from './components/Navbar';
import { auth } from './utils/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createRoom, getRooms, getUsers } from './api/firestore';
import { UserAuthType } from './types/userAuthType.types';
import { Room } from './types/roomType.types';

const App: React.FC = () => {
  const [user] = useAuthState(auth) as [
    UserAuthType | null,
    boolean,
    Error | undefined
  ];
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [users, setUsers] = useState<UserAuthType[]>([]);

  useEffect(() => {
    getRooms(setRooms);
  }, []);

  const handleCreateRoom = async () => {
    if (user && newRoomName) {
      await createRoom(newRoomName, user);
      setNewRoomName('');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers();
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  return (
    <Router>
      <Navbar
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        createRoom={handleCreateRoom}
      />

      <Routes>
        <Route
          path="/"
          element={
            <div className="p-4 grid grid-cols-4 gap-4">
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    id={room.id}
                    roomName={room.name}
                    createdAt={room.createdAt}
                    creatorName={room.creatorName}
                  />
                ))}
              </div>
              <div className="col-span-1 ml-20 ">
                <h2 className="text-3xl align-left font-bold my-5 text-white">
                  Users
                </h2>
                {users.map((user) => (
                  <div key={user.uid} className="mb-10">
                    <div>
                      <p className="font-bold align-left text-white">
                        {user.displayName}
                      </p>
                      <p className="font-bold align-left  text-white">
                        {user.email}
                      </p>
                      <p className=" align-left  text-white">
                        {user.createdAt?.toDate().toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <Route path="/room/:roomId" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
