import * as authService from '../services/authService.js'

// ── unchanged ──────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone_number, vehicle_number } = req.body
    if (!email || !password || !first_name || !last_name || !phone_number || !vehicle_number) {
      return res.status(400).json({
        error: 'All fields required: email, password, first_name, last_name, phone_number, vehicle_number'
      })
    }
    const data = await authService.registerUser(
      email, password, first_name, last_name, phone_number, vehicle_number
    )
    res.status(201).json({
      message: 'Registration successful',
      user: data.user
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// ── unchanged ──────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }
    const data = await authService.loginUser(email, password)
    res.status(200).json({
      message: 'Login successful',
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user
    })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}

// ── unchanged ──────────────────────────────────────────────────────────────
export const googleAuth = async (req, res) => {
  try {
    const data = await authService.googleSignIn()
    res.status(200).json({ url: data.url })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// ── NEW: receives Page 2 form data after Google login ─────────────────────
export const completeProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, vehicle_number, avatar_url } = req.body

    if (!first_name || !last_name || !phone_number || !vehicle_number) {
      return res.status(400).json({
        error: 'All fields required: first_name, last_name, phone_number, vehicle_number'
      })
    }

    const profile = await authService.completeGoogleProfile(
      req.user.id,
      first_name,
      last_name,
      phone_number,
      vehicle_number,
      avatar_url || null
    )

    res.status(200).json({
      message: 'Profile completed successfully',
      profile
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// ── unchanged ──────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    const jwt = req.headers.authorization?.split(' ')[1]
    if (!jwt) return res.status(401).json({ error: 'No token provided' })
    await authService.logoutUser(jwt)
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// ── unchanged ──────────────────────────────────────────────────────────────
export const profile = async (req, res) => {
  try {
    const data = await authService.getProfile(req.user.id)
    res.status(200).json({ profile: data })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// ── unchanged ──────────────────────────────────────────────────────────────
export const deleteAccount = async (req, res) => {
  try {
    await authService.deleteAccount(req.user.id)
    res.status(200).json({ message: 'Account deleted successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}