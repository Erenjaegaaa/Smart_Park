import supabase from '../config/supabaseClient.js'

export const authenticate = async (req, res, next) => {
  try {
    const jwt = req.headers.authorization?.split(' ')[1]
    if (!jwt) return res.status(401).json({ error: 'No token provided' })

    const { data, error } = await supabase.auth.getUser(jwt)
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = data.user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}