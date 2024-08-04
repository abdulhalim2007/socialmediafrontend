import axios from "axios"
import { useRef, useState } from "react"
import { useNavigate } from "react-router"
import { Link } from 'react-router-dom'

function Register() {
    const Navigate = useNavigate()
    let emailText = useRef()
    let passwordText = useRef()
    let usernameText = useRef()
    let nameText = useRef()
    const [ok, setOk] = useState()
    const [text, setText] = useState()

    let changeHandlerName = (e) => {
        if (usernameText.current.value.length < 3) {
            setOk(false)
            setText("Username must be atleast 3 characters")
        } else {
            setText("")
        }
    }
    let changeHandlerFullName = (e) => {
        if (nameText.current.value.length < 3) {
            setOk(false)
            setText("Full Name must be atleast 3 characters")
        } else {
            setText("")
        }
    }
    let changeHandlerEmail = (e) => {
        if (!emailText.current.value.includes('@')) {
            setOk(false)
            setText("Email must be in correct format")
        } else {
            setText("")
        }
    }
    let changeHandlerPassword = (e) => {
        if (passwordText.current.value.length < 6) {
            setOk(false)
            setText("Password must be atleast 6 characters")
        } else {
            setText("")
        }
    }

    let changeHandler = (e) => {
        if (passwordText.current.value.length > 6 && emailText.current.value.includes('@') && usernameText.current.value.length > 3 && nameText.current.value.length > 3) {
            setOk(true)
        }
    }

    let clickHandler = (e) => {
        document.getElementById('buttonReg').classList.add('animate-ping')
        setTimeout(async () => {
            if (ok) {
                let res = await axios.post('auth/register', {
                    fullName: nameText.current.value,
                    username: usernameText.current.value,
                    email: emailText.current.value,
                    password: passwordText.current.value
                })
                if (!res.data.err && !res.data.msg) {
                    localStorage.setItem('user', JSON.stringify(res.data))
                    window.location.href = '/'
                } else if (res.data.msg) {
                    setText(res.data.msg)
                    setOk(false)
                }
            }
            // document.getElementById('buttonReg').classList.remove('animate-ping')
        }, 400)
        e.preventDefault()
    }

    return (
        <div className="mainContainer lg:pl-96 lg:pr-96 p-0 text-center justify-between">
            <div className="formContainer md:min-w-[500px] m-10 md:m-20 bg-white rounded-xl text-center overflow-x-hidden">
                <br />
                <span className="font-bold text-xl text-slate-600">Register</span>
                {ok === false && (
                    <>
                        <br />
                        <br />
                        <div className="text-red-600">
                            {text}
                        </div>
                    </>
                )}
                <form onSubmit={clickHandler} action="" className="p-10 pb-0">
                    <input ref={nameText} onChange={() => { changeHandlerFullName(); changeHandler() }} minLength='3' type="text" className="hover:scale-125 focus:scale-110 hover:duration-300 active:scale-75  border-2 lg:w-96 md:w-96 outline-none p-2 rounded-md focus:border-slate-400 focus:placeholder-slate-500" placeholder="Full Name" />
                    <br />
                    <br />
                    <input ref={usernameText} onChange={() => { changeHandlerName(); changeHandler() }} minLength='3' type="text" className="hover:scale-125 focus:scale-110 hover:duration-300 active:scale-75  border-2 lg:w-96 md:w-96 outline-none p-2 rounded-md focus:border-slate-400 focus:placeholder-slate-500" placeholder="Username" />
                    <br />
                    <br />
                    <input ref={emailText} onChange={() => { changeHandlerEmail(); changeHandler() }} type="email" className="hover:scale-125 focus:scale-110 hover:duration-300 active:scale-75  border-2 lg:w-96 md:w-96 outline-none p-2 rounded-md focus:border-slate-400 focus:placeholder-slate-500" placeholder="Email" />
                    <br />
                    <br />
                    <input ref={passwordText} onChange={() => { changeHandlerPassword(); changeHandler() }} type="password" className="hover:scale-125 focus:scale-110 hover:duration-300 active:scale-75  border-2 lg:w-96 md:w-96 outline-none p-2 rounded-md focus:border-slate-400 focus:placeholder-slate-500" placeholder="Password" />
                    <br /><br />
                    <button id="buttonReg" className="hover:scale-125 focus:scale-110 hover:duration-300 active:scale-75  border-2 p-2 text-white disabled:bg-slate-300 disabled:cursor-not-allowed bg-slate-500 active:bg-slate-700 rounded-lg" type="submit">Register</button>
                </form>
                <br />
                <div className="text-slate-600 hover:scale-110 mb-4 hover:duration-300 active:scale-75">
                    <Link to='/login'>Already have an account? Login here</Link>
                </div>
            </div>

        </div>
    )
}

export default Register
