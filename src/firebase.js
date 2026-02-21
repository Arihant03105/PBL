import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCbTF0CxIJud6tezHtm14gT8am6gIyHgZg",
    authDomain: "edu-exchange03.firebaseapp.com",
    projectId: "edu-exchange03",
    storageBucket: "edu-exchange03.firebasestorage.app",
    messagingSenderId: "179222959376",
    appId: "1:179222959376:web:35cd5ef2960eec0170c195",
    measurementId: "G-DYZX5E93NT"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Cloudinary Config (for file storage)
export const CLOUDINARY_CLOUD_NAME = 'dojl2lz6l'
export const CLOUDINARY_UPLOAD_PRESET = 'mx7h89z6'
