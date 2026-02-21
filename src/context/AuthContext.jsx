import { createContext, useContext, useEffect, useState } from 'react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    // Register new user
    async function register(email, password, profileData) {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        // Save extra profile data to Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
            name: profileData.name,
            email: email,
            rollno: profileData.rollno,
            semester: profileData.semester,
            uid: result.user.uid,
            createdAt: new Date().toISOString(),
            uploads: 0,
            downloads: 0,
        })
        return result
    }

    // Login
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    // Logout
    function logout() {
        return signOut(auth)
    }

    // Login with Google
    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const user = result.user

        // Check if user profile exists in Firestore, if not create it
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                name: user.displayName,
                email: user.email,
                rollno: '',
                semester: '',
                uid: user.uid,
                createdAt: new Date().toISOString(),
                uploads: 0,
                downloads: 0,
                photoURL: user.photoURL
            })
        }
        return result
    }

    // Fetch user profile from Firestore
    async function fetchUserProfile(uid) {
        const snap = await getDoc(doc(db, 'users', uid))
        if (snap.exists()) setUserProfile(snap.data())
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                setCurrentUser(user)
                if (user) {
                    await fetchUserProfile(user.uid)
                } else {
                    setUserProfile(null)
                }
            } catch (err) {
                console.error("Error in auth state change:", err)
            } finally {
                setLoading(false)
            }
        })
        return unsubscribe
    }, [])

    const value = { currentUser, userProfile, register, login, logout, fetchUserProfile, loginWithGoogle }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
