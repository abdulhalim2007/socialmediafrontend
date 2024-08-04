import { useRef, useState } from "react"
import { useNavigate } from "react-router"
import { Link } from 'react-router-dom'
import axios from "axios"

function Login() {
    const Navigate = useNavigate()
    let emailText = useRef()
    let passwordText = useRef()
    const [ok, setOk] = useState()
    const [text, setText] = useState('Password should be atleast 6 characters')

    let changeHandler = (e) => {
        if (passwordText.current.value.length < 6) setOk(false)
        else if (passwordText.current.value.length > 6) setOk(true)
    }

    let clickHandler = (e) => {
        document.getElementById('button').classList.add('animate-ping')
        document.getElementById('mainContainer').classList.add('animate-ping')
        setTimeout(async () => {
            document.getElementById('button').classList.remove('animate-ping')
            document.getElementById('mainContainer').classList.remove('animate-ping')
            let res = await axios.post('auth/login', { email: emailText.current.value, password: passwordText.current.value })
            if (!res.data.err && !res.data.msg) {
                localStorage.setItem('user', JSON.stringify(res.data))
                window.location.href = '/'
            } else if (res.data.msg) {
                setText(res.data.msg)
                setOk(false)
            }
        }, 1300)

        e.preventDefault()
    }
    return (
        <div id="mainContainer" className="mainContainer lg:pl-96 lg:pr-96 text-center justify-between overflow-x-hidden">
            <div className="formContainer md:min-w-[500px] m-10 md:m-20 bg-white rounded-xl text-center overflow-x-hidden">
                <br />
                <span className="font-bold text-xl text-slate-600">Login</span>
                {ok === false && (
                    <>
                        <br />
                        <br />
                        <div className="text-red-600">
                            {text}
                        </div>
                    </>
                )}
                <form onSubmit={clickHandler} className="p-10 pb-0">
                    <input ref={emailText} type="email" className="hover:scale-125 focus:scale-110 hover:duration-300 active:scale-75 border-2 lg:w-96 md:w-96 outline-none p-2 rounded-md focus:border-slate-400 focus:placeholder-slate-500" placeholder="Email" />
                    <br />
                    <br />
                    <input onChange={changeHandler} ref={passwordText} type="password" minLength='6' className="hover:scale-125 focus:scale-110 hover:duration-300 active:scale-75  border-2 lg:w-96 md:w-96 outline-none p-2 rounded-md focus:border-slate-400 focus:placeholder-slate-500" placeholder="Password" />
                    <br /><br />
                    <input id="button" disabled={!ok} className="hover:scale-125 focus:scale-110 hover:duration-300 active:scale-75  border-2 p-2 text-white bg-slate-500 disabled:cursor-not-allowed disabled:bg-slate-200 active:bg-slate-700 rounded-lg" type="submit" value='Login' />
                </form>
                <br />
                <div className="text-slate-600 mb-4 hover:scale-125 hover:duration-300 active:scale-75">
                    <Link to='/register'>Dont have an account? Register here</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
