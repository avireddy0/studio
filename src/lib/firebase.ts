import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-7741937329-54916',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const isConfigured = !!firebaseConfig.apiKey

function getFirebaseApp(): FirebaseApp | null {
  if (!isConfigured) return null
  if (getApps().length) return getApp()
  return initializeApp(firebaseConfig)
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp()
  return app ? getAuth(app) : null
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp()
  return app ? getFirestore(app) : null
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const app = getFirebaseApp()
  return app ? getStorage(app) : null
}

export const app = typeof window !== 'undefined' ? getFirebaseApp() : null
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : null
export const db = typeof window !== 'undefined' ? getFirebaseDb() : null
export const storage = typeof window !== 'undefined' ? getFirebaseStorage() : null

export const analytics = typeof window !== 'undefined' && isConfigured
  ? import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
      const firebaseApp = getFirebaseApp()
      return firebaseApp ? isSupported().then(yes => yes ? getAnalytics(firebaseApp) : null) : null
    })
  : null
