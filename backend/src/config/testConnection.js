import supabase from './supabaseClient.js'

const { data, error } = await supabase
  .from('parking_slots')
  .select('*')
  .limit(1)

if (error) {
  console.error('Connection failed:', error.message)
} else {
  console.log('Connected to Supabase successfully!')
  console.log('Data:', data)
}