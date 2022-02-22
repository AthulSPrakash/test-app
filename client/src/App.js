import './styles/App.css'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Dashboard from './components/dashboard'
import Reg from './components/reg'
import Login from './components/login'
import Error from './components/err'
import Home from './components/home'


function App() {
  const [userDetail, setUserDetail] = useState()
  const navigate = useNavigate()

  const navStyle = isActive => {
    return{
      textDecoration: 'none',
      fontWeight: '600',
      color: isActive? 'var(--txt-alt)' : 'var(--txt)',
      fontFamily: 'Arial, Helvetica, sans-serif',
      background: isActive ? '#f1f1f1' : 'none',
      letterSpacing: '0.05em',
      padding: '0.5em 0.75em',
      borderRadius: '3px'
    }
  }

  const userDetails = data => {
    setUserDetail(data)
  }

  const userLoggedIn = x =>{
    const nav = document.querySelector('.app-nav')
    if(x){
      nav.style.display = 'none'
      navigate('dashboard')
    }
  }

  return (
    <div className="App">
      <nav className='app-nav'>
        <NavLink 
          to={'/login'}
          style={({isActive})=>navStyle(isActive)}
        >
          Login
        </NavLink>
        <NavLink 
          to={'/register'}
          style={({isActive})=>navStyle(isActive)}
        >
          Register
        </NavLink>
      </nav>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='dashboard' element={<Dashboard userData={userDetail}/>} />
          <Route path='register' element={<Reg userLoggedIn={userLoggedIn} userData={userDetails}/>} />
          <Route path='login' element={<Login userLoggedIn={userLoggedIn} userData={userDetails}/>} />
          <Route path='*' element={<Error/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
