import supabase from '../config/supabaseClient.js'

// ── unchanged ──────────────────────────────────────────────────────────────
export const registerUser = async (email, password, firstName, lastName, phoneNumber, vehicleNumber) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        vehicle_number: vehicleNumber
      }
    }
  })
  if (error) throw error
  return data
}

// ── unchanged ──────────────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

// ── FIXED: added redirectTo so Google redirects correctly after login ──────
export const googleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:5173/auth/callback'
    }
  })
  if (error) throw error
  return data
}

// ── NEW: saves Page 2 form data into profiles table after Google login ─────
export const completeGoogleProfile = async (userId, firstName, lastName, phoneNumber, vehicleNumber, avatarUrl) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      vehicle_number: vehicleNumber,
      avatar_url: avatarUrl || null
    }, { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error
  return data
}

// ── unchanged ──────────────────────────────────────────────────────────────
export const logoutUser = async (jwt) => {
  const { data, error: getUserError } = await supabase.auth.getUser(jwt)
  if (getUserError) throw getUserError
  const { error } = await supabase.auth.admin.signOut(data.user.id)
  if (error) throw error
}

// ── unchanged ──────────────────────────────────────────────────────────────
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

// ── unchanged ──────────────────────────────────────────────────────────────
export const deleteAccount = async (userId) => {
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) throw error
}