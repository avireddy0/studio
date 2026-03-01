import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  FirebaseStorage,
} from 'firebase/storage'
import { getFirebaseStorage } from './firebase'

function requireStorage(): FirebaseStorage {
  const s = getFirebaseStorage()
  if (!s) throw new Error('Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY.')
  return s
}

export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const storageRef = ref(requireStorage(), path)
  const task = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      snapshot => {
        if (onProgress) {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress(percent)
        }
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(requireStorage(), path)
  return getDownloadURL(storageRef)
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(requireStorage(), path)
  await deleteObject(storageRef)
}
