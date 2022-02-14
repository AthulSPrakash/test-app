import '../styles/sign.css'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'

function Login({userLoggedIn, userData}) {

    const url = process.env.REACT_APP_API_URL
    const clientId = process.env.REACT_APP_OAUTH_ID
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [message, setMessage] = useState('') 

    const handleChange = (e) => {
        setMessage('')
        setFormData(prevFormData=>{
            return({
                ...prevFormData,
                [e.target.name]: e.target.value
            })
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let status

        if(formData.email && formData.password){
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }
            fetch(`${url}/api/login`, requestOptions)
            .then(res => {
                status = res.status
                return res.json()
            }).then(data =>{
                if(status===200){
                    userData(data)
                    userLoggedIn(true)
                }else setMessage(data)
            }).catch(err => {
                setMessage('Connection error')
                console.log(err)
            })
        }else{
            setMessage('Missing field')
        }
    }

    //Google auth
    const onSuccess = async res => {
        // console.log('[login success] User:', res)
        const token = {token: res.tokenId}
        let status

        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
             },
            body: JSON.stringify(token)
        }
        fetch(`${url}/api/gauth`, requestOptions)
        .then(response => {
            status = response.status
            return response.json() 
        })
        .then(data =>{
            if(status===200){
                userData(data)
                userLoggedIn(true)
            }else setMessage(data)
        }).catch(err =>{
            setMessage('Connection error')
            console.log(err)
        })
    }
    
    const onFailure = res => {
        setMessage('Login failed')
        console.log('[login error]:', res)
    }
    //------------   

    return (
        <div className='login-page'>
            <nav className='login-nav'>
                <NavLink 
                    to={'/'}
                    className='home-btn'
                >
                    <i className="fa-solid fa-house"></i>
                </NavLink>
            </nav>
            <div className='gauth'>
                <GoogleLogin
                    clientId={clientId}
                    buttonText='Login with Google'
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    className='google'
                />
            </div>
            <p className='or'>Or</p>
            <form className='login-form'>
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder='Email'
                    required={true}
                />
                <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder='Password'
                    required={true}
                />
                <button 
                    className='sign-btn'
                    onClick={handleSubmit}
                >
                    Login
                </button>
            </form>
            <div className='ntfnl'>
                <p className='msg'>{message}</p>
            </div>
        </div>
    )
}

export default Login
