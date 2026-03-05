import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDSPSqVXiaSuuAtnsoD1_J_tVuIuJedXU4",
  authDomain: "studio-7741937329-54916.firebaseapp.com",
  projectId: "studio-7741937329-54916",
  storageBucket: "studio-7741937329-54916.firebasestorage.app",
  messagingSenderId: "662762029619",
  appId: "1:662762029619:web:198552864cd97bd3acd946",
  measurementId: "G-L1PE6JZ9JP",
};

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
