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

// Only initialize on the client side to avoid SSR prerender errors
function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApp()
  return initializeApp(firebaseConfig)
}

let _auth: Auth | null = null
let _db: Firestore | null = null
let _storage: FirebaseStorage | null = null

export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getFirebaseApp())
  return _auth
}

export function getFirebaseDb(): Firestore {
  if (!_db) _db = getFirestore(getFirebaseApp())
  return _db
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getFirebaseApp())
  return _storage
}

// Convenience re-exports for modules that import directly
// These are safe to call in 'use client' components
export const app = typeof window !== 'undefined' ? getFirebaseApp() : null as unknown as FirebaseApp
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : null as unknown as Auth
export const db = typeof window !== 'undefined' ? getFirebaseDb() : null as unknown as Firestore
export const storage = typeof window !== 'undefined' ? getFirebaseStorage() : null as unknown as FirebaseStorage

export const analytics = typeof window !== 'undefined'
  ? import('firebase/analytics').then(({ getAnalytics, isSupported }) =>
      isSupported().then(yes => yes ? getAnalytics(getFirebaseApp()) : null)
    )
  : null
