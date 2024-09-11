import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Projects from './pages/Projects'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
const App = () => {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element = {<Home/>}/>
      <Route path='/about' element = {<About/>}/>
      <Route path='/sign-in' element = {<SignIn/>}/>
      <Route path='/sign-up' element = {<SignUp/>}/>
      <Route path='/dashboard' element = {<Dashboard/>}/>
      <Route path='/projects' element = {<Projects/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
