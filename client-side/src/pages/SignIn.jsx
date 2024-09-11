import { Button, Label, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignIn = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null) // Reset error before new submission
    try {
      const res = await fetch("api/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send formData in the request body
      })

      if (!res.ok) {
        throw new Error('Failed to sign up') // Handle non-200 responses
      }

      const data = await res.json()
      setSuccess('Signup successful!') 
      // Set success message
      // navigate("/login")
      console.log('Signup successful:', data)
    } catch (error) {
      setError('Signup failed. Please try again.') // Set error message
      console.log('Error:', error)
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex max-w-3xl'>
        <div>logo</div>
        <div>
          <form className='gap-4' onSubmit={handleSubmit}>
            <div className=''>
              <Label value="User Name" />
              <TextInput
                type="text"
                placeholder="username"
                id="userName"
                onChange={handleChange}
                value={formData.username}
              />
            </div>
            <div className=''>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="email"
                id="email"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div className=''>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="password"
                id="password"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            <Button type="submit" className='text-dark mx-0 m-3'>
              Submit
            </Button>

            <Link to="/login">
              Already have an account?
            </Link>

            {error && <p className='text-red-500'>{error}</p>}
            {success && <p className='text-green-500'>{success}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn
