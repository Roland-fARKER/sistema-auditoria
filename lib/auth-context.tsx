"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "./firebase"
import { onAuthStateChanged, type User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

export type UserRole = "admin" | "supervisor" | "auditor" | "user"

export interface AuthUser extends User {
  role?: UserRole
  fullName?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()
            const role = (userData.role || "user") as UserRole
            const fullName = userData.fullName || ""
            setUser({ ...currentUser, role, fullName })
          } else {
            // If no user document, default to user role
            setUser({ ...currentUser, role: "user" })
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Auth error")
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await auth.signOut()
      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout error")
    }
  }

  return <AuthContext.Provider value={{ user, loading, error, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
