import React from 'react';
import { auth, db } from '../utils/firebase.config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const SignIn: React.FC = () => {
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userProfileRef = doc(db, 'users', user.uid);
      await setDoc(
        userProfileRef,
        {
          displayName: user.displayName,
          email: user.email,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  }

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign In </button>
    </div>
  );
};

export default SignIn;
