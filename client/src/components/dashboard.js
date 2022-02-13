import '../styles/dashboard.css'
import { useState, useEffect } from "react"
import { useGoogleLogout } from 'react-google-login'
import { Draggable, Droppable } from 'react-drag-and-drop'
import uuid from 'react-uuid'

function Dashboard({userData}) {

    const clientId = process.env.REACT_APP_OAUTH_ID
    const backendUrl = process.env.REACT_APP_API_URL

    const [resumes, setResumes] = useState()
    const [preview ,setPreview] = useState(false)
    const [createBox ,setCreateBox] = useState(false)
    const [deleteBox ,setDeleteBox] = useState(false)
    const [catgName, setCatgName] = useState('')
    const [category, setCategory] = useState(userData.data || [])
    const [temp, setTemp] = useState()

    const { signOut } = useGoogleLogout({
        clientId,
        // onLogoutSuccess,
        // onFailure
    })
    
    const showMenu = () => {
        document.querySelector('.settings-box').classList.toggle('visible')
        document.querySelector('.settings-btn').classList.toggle('invert')
    }
    
    const logout = () => {
        signOut()
        localStorage.clear()
        window.location.href = '/'
    }

    function fetchResume(){
        const requestOptions = {
            method: 'GET',
            headers: { 'X-Master-Key': process.env.REACT_APP_TEST_API_KEY}
        }
        fetch(process.env.REACT_APP_TEST_API_URL, requestOptions)
        .then(res=>res.json())
        .then(data=>{
            setResumes(data.record)
        }).catch(err=>console.log(err))
    }

    useEffect(()=>{
        fetchResume()
        // eslint-disable-next-line
    },[])

    useEffect(()=>{
        const pdf = document.querySelector('.preview-container')
        if(!preview) pdf.style.display = 'none'
        else pdf.style.display = 'block'
    },[preview])

    const showPdf = url => {
        document.querySelector('.preview').src = url
        setPreview(prevState=>!prevState)
    }

    const closePreview = () => {
        setPreview(prevState=>!prevState)
    }

    useEffect(()=>{
        const box = document.querySelector('.create-box')
        if(!createBox) box.style.display = 'none'
        else box.style.display = 'flex'
    },[createBox])

    const openCreateBox = () => {
        document.querySelector('.save-category').classList.add('visible')
        document.querySelector('.warning').classList.add('visible')

        setCreateBox(prevState=>!prevState) 
    }

    const handleChange = e => {
        setCatgName(e.target.value)
    }

    const create = () => {
        // eslint-disable-next-line
        const exist = category.map(i=>{
            if(i.name===catgName) return i.name
        })
        if(category.length && exist.includes(catgName)){
            setCatgName('')
            console.log('Category already exist')
            return
        }else{
            setCategory(prevState=>{
                return([
                    ...prevState,
                    {
                        name: catgName,
                        items: []
                    }
                ])
            })
            setCatgName('')
            setCreateBox(prevState=>!prevState)
        }
    }

    const cancelCreate = () => {
        setCatgName('')
        setCreateBox(prevState=>!prevState) 
    }

    useEffect(()=>{
        const box = document.querySelector('.delete-box')
        if(!deleteBox) box.style.display = 'none'
        else box.style.display = 'flex'
    },[deleteBox])

    const deleteOverlay = data => {
        document.querySelector('.save-category').classList.add('visible')
        document.querySelector('.warning').classList.add('visible')

        setTemp(data)
        setDeleteBox(prevState=>!prevState)
    }

    const confirmDelete = () => {
        setCategory(category.filter(i=>i!==temp))
        setDeleteBox(prevState=>!prevState)
    }

    const cancelDelete = () => {
        setDeleteBox(prevState=>!prevState)
    }

    const categorise = (e, name) => {

        // eslint-disable-next-line
        category.filter(i=>{
            if(i.name===name){
                // eslint-disable-next-line
                if(i.items.includes(e.pdf)) return 
                else {
                    document.querySelector('.save-category').classList.add('visible')
                    document.querySelector('.warning').classList.add('visible')

                    return i.items.push(e.pdf)
                }
            }
        })
        const newData = category.filter(i=>i)
        setCategory(newData)
    }

    const saveData = () => {
        const reqData = {
            email: userData.email,
            resumes: category
        }

        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'auth-token': userData.token
            },
            body: JSON.stringify(reqData)
        }
        fetch(`${backendUrl}/api/save`, requestOptions)
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
        }).catch(err=>console.log(err))

        document.querySelector('.save-category').classList.remove('visible')
        document.querySelector('.warning').classList.remove('visible')
    }

    const removeFile = (e, name) => {

        // eslint-disable-next-line
        category.filter(i=>{
            if(i.name===name){
                if(i.items.includes(e.file)){
                    const index = i.items.indexOf(e.file)
                    i.items.splice(index, 1)

                    document.querySelector('.save-category').classList.add('visible')
                    document.querySelector('.warning').classList.add('visible')
                }
                // eslint-disable-next-line
                else return
            }
        })
        const newData = category.filter(i=>i)
        setCategory(newData)
    }

    const [changeIndex, setChangeIndex] = useState([])

    useEffect(()=>{
        if(changeIndex.length>2){
            setChangeIndex(changeIndex.slice(-2))
        }
    },[changeIndex])

    const tempVar = url => {
        if(changeIndex.includes(url)) return
        setChangeIndex(prevState=>{
            return([
                ...prevState,
                url
            ])
        })
    }

    const reArrange = (name) => {
        // eslint-disable-next-line
        category.filter(i=>{
            if(i.name===name){
                const index1 = i.items.indexOf(changeIndex[0])
                const index2 = i.items.indexOf(changeIndex[1])
                i.items.splice(index1, 1, changeIndex[1])
                i.items.splice(index2, 1, changeIndex[0])

                document.querySelector('.save-category').classList.add('visible')
                document.querySelector('.warning').classList.add('visible')
            }
        })
        const newData = category.filter(i=>i)
        setCategory(newData)
    }

    return (
        <div className='dashboard'>
            <header className='dash-header'>
                <img className='profile-pic' src={userData.image} alt='profile'/>
                <h1 className='user-name'>{userData.name}</h1>
                <button className='settings-btn' onClick={showMenu}>
                    <span className='dots'></span>
                    <span className='dots'></span>
                    <span className='dots'></span>
                    <span className='dots'></span>
                    <span className='dots'></span>
                    <span className='dots'></span>
                    <span className='dots'></span>
                    <span className='dots'></span>
                    <span className='dots'></span>
                </button>
            </header>
            <main className='dash-main'>
                <div className='resume-list'>
                    <h2>Resumes</h2>
                    {resumes && <ul className='pdf-list'>
                        {resumes.map(i=>{
                            const url = i.resume
                            const name = i.name
                            return(
                                <Draggable
                                    key={resumes.indexOf(i)}
                                    type='pdf'
                                    data={url}
                                >
                                    <li 
                                        className='pdf' 
                                        onClick={()=>showPdf(url)} 
                                    >
                                        <i className="fa-solid fa-file-lines"></i>
                                        <p className='name'>{name}</p>
                                    </li>
                                </Draggable>
                            )
                        })}
                    </ul>}
                </div>
                <div className='category-container'>
                    <div className='category-nav'>
                        <h2>Categories</h2>
                        <button onClick={openCreateBox} className='new-category'>New +</button>
                        <button onClick={saveData} className='save-category'>
                            Save Changes <span style={{color: 'crimson'}}>*</span>
                        </button>
                        <i className='warning'><small>* Your edits are waiting to be saved</small></i>
                    </div>
                    <div className='category-wrapper'>

                        {category.map(i=>{
                            return(
                                <div key={category.indexOf(i)}>
                                    <div className='catg-nav'>
                                        <p className='category-name'>{i.name}</p>
                                            <button onClick={()=>deleteOverlay(i)} className='close-btn'>
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                    </div>
                                    <Droppable
                                        className='category'
                                        types={['pdf']}
                                        onDrop={(e)=>categorise(e,i.name)}
                                    >   
                                        {i.items.map(x=>{
                                            const name  = x.match(/[^/]*$/i)
                                            return(
                                                <Draggable 
                                                    key={uuid()}
                                                    type='file'
                                                    data={x}
                                                >
                                                    <Droppable onDrop={()=>reArrange(i.name)}>
                                                        <li 
                                                            onMouseEnter={()=>tempVar(x)}
                                                            className='pdf-cat' 
                                                            onClick={()=>showPdf(x)} 
                                                        >
                                                            <span className='bars'></span>
                                                            <span className='bars'></span>
                                                            <span className='bars'></span>
                                                        </li>
                                                        <p className='pdf-name'>{name[0]}</p>
                                                    </Droppable>
                                                </Draggable>
                                            )
                                        })}
                                        <Droppable
                                            className='trash'
                                            types={['file']}
                                            onDrop={(e)=>removeFile(e,i.name)}
                                            title='Trash'
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </Droppable>
                                    </Droppable>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* settings menu */}
                <div className='settings-box'>
                    <div className='settings'>
                        <button title='Profile' className='logout-btn'>
                            <i className="fa-solid fa-user"></i>
                        </button>
                        <button title='Settings' className='logout-btn'>
                            <i className="fa-solid fa-gear"></i>
                        </button>
                        <button title='Logout' className='logout-btn' onClick={logout}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </button>
                        <button title='About' className='logout-btn'>
                            <i className="fa-solid fa-circle-exclamation"></i>
                        </button>
                    </div>
                </div>
                
                {/* preview container */}
                <div className='preview-container'>
                    <button className='preview-close' onClick={closePreview}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <iframe className='preview' title='resume'></iframe>
                </div>

                {/* create category pop up */}
                <div className='create-box'>
                    <div className='box'>
                        <input
                            id='catg'
                            type='text'
                            value={catgName}
                            onChange={handleChange}
                            name='category'
                            placeholder='Category name' 
                        />
                        <div className='btn-box'>
                            <button className='box-cancel' onClick={cancelCreate}>Cancel</button>
                            <button className='box-create' onClick={create}>Create</button>
                        </div>
                    </div>
                </div>

                {/* delete category pop up */}
                <div className='delete-box'>
                    <div className='box'>
                        <h3>Delete Category</h3>
                        <div className='btn-box'>
                            <button className='cancel-btn' onClick={cancelDelete}>Cancel</button>
                            <button className='delete-btn' onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default Dashboard
