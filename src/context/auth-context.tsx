'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
} from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import { getFirebaseAuth } from '@/lib/firebase'
import { userDoc, setDocument, updateDocument } from '@/lib/firestore'

type AuthContextValue = {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const googleProvider = new GoogleAuthProvider()

async function ensureUserProfile(user: User, isNew = false): Promise<void> {
  const ref = userDoc(user.uid)
  const now = Timestamp.now()

  if (isNew) {
    await setDocument(ref, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: 'user',
      createdAt: now,
      lastLogin: now,
    })
  } else {
    await updateDocument(ref, { lastLogin: now })
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), firebaseUser => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    setError(null)
    try {
      const result = await signInWithPopup(getFirebaseAuth(), googleProvider)
      const isNew = result.user.metadata.creationTime === result.user.metadata.lastSignInTime
      await ensureUserProfile(result.user, isNew)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
      throw err
    }
  }

  async function signInWithEmail(email: string, password: string) {
    setError(null)
    try {
      const result = await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
      await ensureUserProfile(result.user, false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
      throw err
    }
  }

  async function signUp(email: string, password: string) {
    setError(null)
    try {
      const result = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
      await ensureUserProfile(result.user, true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-up failed')
      throw err
    }
  }

  async function signOut() {
    setError(null)
    try {
      await firebaseSignOut(getFirebaseAuth())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-out failed')
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signInWithEmail, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
