import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiRequest } from '../utils/api'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  role: 'EB' | 'CORE' | 'MEMBER'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const data = await apiRequest('/auth/me')
      setUser(data.user)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = () => {
    apiRequest('/auth')
      .then(data => {
        if (data && data.url) {
          window.location.href = data.url
        }
      })
      .catch(err => {
        console.error('Failed to get OAuth URL:', err)
      })
  }

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'DELETE' })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
