import { initializeApp, getApp, getApps, type App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccount) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT environment variable');
}

const appOptions = {
    credential: credential.cert(JSON.parse(serviceAccount)),
};

export function getFirebaseAdminApp(): App {
    if (getApps().length > 0) {
        return getApp();
    }
    return initializeApp(appOptions);
}
