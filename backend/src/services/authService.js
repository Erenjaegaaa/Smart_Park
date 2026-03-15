import supabase from '../config/supabaseClient.js'

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

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export const googleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  if (error) throw error
  return data
}

export const logoutUser = async (jwt) => {
  const { data, error: getUserError } = await supabase.auth.getUser(jwt)
  if (getUserError) throw getUserError
  const { error } = await supabase.auth.admin.signOut(data.user.id)
  if (error) throw error
}

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export const deleteAccount = async (userId) => {
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) throw error
}