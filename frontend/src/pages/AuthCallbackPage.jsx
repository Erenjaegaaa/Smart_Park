import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import useAuthStore from '../store/authStore'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        navigate('/login')
        return
      }

      const session = data.session
      const user = session.user

      // Save token to auth store
      setAuth(user, session.access_token)

      // Check if profile is complete
      const { data: profile } = await supabase
        .from('profiles')
        .select('vehicle_number')
        .eq('id', user.id)
        .single()

      if (!profile || !profile.vehicle_number) {
        // Google user — go to complete profile page
        navigate('/complete-profile')
      } else {
        // Profile complete — go to dashboard
        navigate('/dashboard')
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-2 h-2 bg-[#FF3D00] mx-auto mb-4 animate-pulse" />
        <p className="font-jetbrains text-xs uppercase tracking-wider text-[#737373]">
          Signing you in...
        </p>
      </div>
    </div>
  )
}