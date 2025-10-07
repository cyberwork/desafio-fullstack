import { useEffect, useState } from 'react'
import { User } from '../types'
import { getUser } from '../services/userService'

export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return <div>Carregando dados do usuário...</div>
  }

  if (!user) {
    return <div>Erro ao carregar dados do usuário</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Dados do Usuário</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Nome:</label>
          <p className="text-gray-800">{user.name}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Email:</label>
          <p className="text-gray-800">{user.email}</p>
        </div>
      </div>
    </div>
  )
}
