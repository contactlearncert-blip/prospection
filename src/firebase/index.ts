'use client';
import { getFirebaseConfig } from './config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { useMemo } from 'react';
import type { Query, DocumentData } from 'firebase/firestore';

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  const firebaseConfig = getFirebaseConfig();
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // Monkey-patching auth methods for easier use
  Object.assign(auth, {
    signUp: createUserWithEmailAndPassword,
    signIn: signInWithEmailAndPassword,
    signOut: () => firebaseSignOut(auth),
    signInWithGoogle: () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    },
    signInWithApple: () => {
        const provider = new OAuthProvider('apple.com');
        return signInWithPopup(auth, provider);
    }
  });


  return { firebaseApp: app, auth, firestore };
}

export function useMemoFirebase<T>(
  createQuery: () => Query<DocumentData> | null,
  deps: any[]
): Query<DocumentData> | null {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(createQuery, deps);
}

declare module 'firebase/auth' {
    interface Auth {
        signUp: typeof createUserWithEmailAndPassword;
        signIn: typeof signInWithEmailAndPassword;
        signOut: () => Promise<void>;
        signInWithGoogle: () => Promise<any>;
        signInWithApple: () => Promise<any>;
    }
}
