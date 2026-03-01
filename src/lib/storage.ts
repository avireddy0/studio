import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './firebase'

export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const storageRef = ref(storage, path)
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
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}
