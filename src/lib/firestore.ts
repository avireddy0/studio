import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  CollectionReference,
  DocumentReference,
  QueryConstraint,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore'
import { getFirebaseDb } from './firebase'

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserProfile = {
  displayName: string | null
  email: string | null
  photoURL: string | null
  role: 'admin' | 'user' | 'viewer'
  createdAt: Timestamp
  lastLogin: Timestamp
}

export type Project = {
  name: string
  description: string
  status: 'active' | 'archived' | 'draft'
  owner: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type SavedQuery = {
  query: string
  response: string
  userId: string
  createdAt: Timestamp
  metadata: Record<string, unknown>
}

export type Document = {
  name: string
  type: string
  size: number
  storageUrl: string
  userId: string
  projectId: string
  createdAt: Timestamp
  status: 'processing' | 'ready' | 'error'
}

// ─── Typed Collection References (lazy — safe for SSR) ───────────────────────

export function usersCol(): CollectionReference<UserProfile> {
  return collection(getFirebaseDb(), 'users') as CollectionReference<UserProfile>
}

export function projectsCol(): CollectionReference<Project> {
  return collection(getFirebaseDb(), 'projects') as CollectionReference<Project>
}

export function queriesCol(): CollectionReference<SavedQuery> {
  return collection(getFirebaseDb(), 'queries') as CollectionReference<SavedQuery>
}

export function documentsCol(): CollectionReference<Document> {
  return collection(getFirebaseDb(), 'documents') as CollectionReference<Document>
}

export function userDoc(uid: string): DocumentReference<UserProfile> {
  return doc(getFirebaseDb(), 'users', uid) as DocumentReference<UserProfile>
}

export function projectDoc(projectId: string): DocumentReference<Project> {
  return doc(getFirebaseDb(), 'projects', projectId) as DocumentReference<Project>
}

export function queryDoc(queryId: string): DocumentReference<SavedQuery> {
  return doc(getFirebaseDb(), 'queries', queryId) as DocumentReference<SavedQuery>
}

export function documentDoc(docId: string): DocumentReference<Document> {
  return doc(getFirebaseDb(), 'documents', docId) as DocumentReference<Document>
}

// ─── Generic CRUD Helpers ────────────────────────────────────────────────────

export async function getDocument<T>(ref: DocumentReference<T>): Promise<T | null> {
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export async function setDocument<T>(
  ref: DocumentReference<T>,
  data: WithFieldValue<T>
): Promise<void> {
  await setDoc(ref, data)
}

export async function updateDocument<T>(
  ref: DocumentReference<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
): Promise<void> {
  await updateDoc(ref, data)
}

export async function deleteDocument<T>(ref: DocumentReference<T>): Promise<void> {
  await deleteDoc(ref)
}

// ─── Collection Query Helpers ────────────────────────────────────────────────

export async function queryCollection<T>(
  col: CollectionReference<T>,
  constraints: QueryConstraint[]
): Promise<Array<{ id: string } & T>> {
  const q = query(col, ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export { where, orderBy, limit }
