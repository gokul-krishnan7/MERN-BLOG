import { Navbar, TextInput } from 'flowbite-react'
import React from 'react'
// import { AIoulineSearch } from 'react-icons'
import { Link } from 'react-router-dom'
const Header = () => {
  return (
  <Navbar className='border-b-2 '>
    <Link to= "" className='self-center font-semibold dark:text-white text-sm sm:text-xl whitespace-nowrap'> 
    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg  text-white'>gk</span>
    notes
   
  </Link>
  <form >
      <TextInput
      type='text'
      placeholder='search'
      // rightIcon={<AIoulineSearch/>}
      
      />
    </form>
  </Navbar>
  )
}

export default Header
