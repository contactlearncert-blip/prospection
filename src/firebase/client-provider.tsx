'use client';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import { UserProvider } from './auth/use-user';
import { useMemo } from 'react';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseApp = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider {...firebaseApp}>
      <UserProvider>{children}</UserProvider>
    </FirebaseProvider>
  );
}
