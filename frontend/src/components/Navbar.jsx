import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { logout } from '../services/authService'

const Navbar = () => {
  const { token, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error(err)
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-purple-600">
        SmartPark
      </Link>
      <div className="flex gap-4 items-center">
        {token ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-purple-600">
              Dashboard
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-purple-600">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-purple-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar