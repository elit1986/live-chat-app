import React from 'react';
import { Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface RoomCardProps {
  id: string;
  roomName: string;
  createdAt: Timestamp | null;
  creatorName: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
  id,
  roomName,
  createdAt,
  creatorName,
}) => {
  const formattedDate = createdAt
    ? createdAt.toDate().toLocaleString()
    : 'Date not available';

  return (
    <Link to={`/room/${id}`}>
      <div className="p-6 card-bg rounded-lg shadow-md m-2 cursor-pointer popin-effect">
        <h3 className="text-xl font-bold room-name-color">{roomName}</h3>
        <p className="text-sm room-text-color">Created by: {creatorName}</p>
        <p className="text-sm room-text-color">Created on: {formattedDate}</p>
      </div>
    </Link>
  );
};

export default RoomCard;
