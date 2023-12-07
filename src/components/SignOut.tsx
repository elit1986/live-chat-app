import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase.config';

const SignOut: React.FC = () => {
  return (
    <div>
      <button onClick={() => signOut(auth)}>Sign Out</button>
    </div>
  );
};

export default SignOut;
