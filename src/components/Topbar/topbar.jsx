import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Close from '@material-ui/icons/Close'
import './topbar.css'
import { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import Home from '@material-ui/icons/Home';
import { useNavigate } from 'react-router'
import Chat from '@material-ui/icons/Chat';

function Topbar({ query, search }) {
    const [clicked, setClicked] = useState(false)
    const pf = process.env.REACT_APP_PUBLIC_FOLDER
    const { user } = useContext(UserContext)
    const Navigate = useNavigate()
    const ref = useRef()

    useEffect(() => {
        document.getElementsByTagName('button')[0].addEventListener('click', () => {
            let elem = document.getElementById('dropdownDivider')
            if (elem.classList.contains('hidden')) {
                elem.classList.remove('hidden')
            } else {
                elem.classList.add('hidden')
            }
            // console.log('click')
        })
    }, []);

    const clickHandler = (e) => {
        localStorage.removeItem('user')
        window.location.reload()
    }

    return (
        <>
            <div className="bg-gray-300 flex flex-row p-10 sticky text-black h-28 justify-between nav opacity-[0.96]">
                <span className={`font-bold -mt-1 text-[25px] md:ml-20 select-none text-gray-500 ${search && "hidden md:block"}`}>Halsco</span>
                <form className={`${!search ? "md:block hidden" : "block"}`} onSubmit={e => {
                    if (ref.current.value.trim()) {
                        Navigate(`/search/${ref.current.value}`)
                    }
                    e.preventDefault()
                }}>
                    <input ref={ref} defaultValue={query && query} className={`outline-gray-300 pt-2 ${!search && "ml-10"} hover:scale-110 active:scale-90 hover:duration-300 md:ml-20 md:w-[300px] w-[120%] pb-2 pl-2 rounded-full text-black outline-none focus:outline-slate-500`} placeholder="Search..." type="text" />
                </form>
                <div className='text-gray-500 myDiv md:hidden justify-end cursor-pointer hover:bg-slate-400 hover:text-white hover:rounded-lg pl-2 pr-2' onClick={() => {
                    let elem = document.getElementById('drawer')
                    if (!clicked) {
                        // elem.classList.remove('hidden')
                        elem.classList.add('opened')
                        elem.classList.add('nav-open')
                        setClicked(true)
                        // elem.classList.add('nav-open')
                    } else {
                        // elem.classList.add('hidden')
                        elem.classList.remove('opened')
                        setClicked(false)
                        elem.classList.remove('nav-open')
                        elem.classList.add('nav-close')
                    }
                }}>
                    {clicked ? <Close className='' /> : <MenuIcon className='' />}
                </div>
                <div className='md:flex md:flex-col hidden'>
                    <button id="dropdownDividerButton" className='md:block flex-shrink-0 hidden ml-20 -mt-[2px] pr-20' data-dropdown-toggle="dropdownDivider" type="button">
                        <img src={`${pf}${user.profilePicture}`} className='rounded-full flex-shrink-0 w-10 h-10' />
                    </button>
                    <div id="dropdownDivider" className="relative hidden mt-2 z-10 w-44 text-base list-none bg-white rounded divide-y divide-slate-100 shadow dark:bg-slate-700">
                        <ul className="py-1" aria-labelledby="dropdownButton">
                            <li className='cursor-pointer'>
                                <a onClick={clickHandler} className="block py-2 px-4 text-sm text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 dark:text-slate-200 dark:hover:text-white">Sign out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="drawer" className={`bg-slate-300 md:hidden xs:w-[70vw] text-gray-500 h-screen nav-close`}>
                <hr />
                <div className='p-4 flex pb-12 pt-12 bg-gray-300'>
                    <img src={`${pf}${user.profilePicture}`} className='hover:scale-125 hover:duration-300 active:scale-75 rounded-full w-12 h-12 object-cover flex-shrink-0' />
                    <div className="flex flex-col">
                        <span className='pl-4 flex-shrink-0'>{user.fullName}</span>
                        <span className='pl-2 flex-shrink-0'>{user.email}</span>
                    </div>

                </div>
                <hr />
                <ul className='p-4'>
                    <Link to={`/`}>
                        <li className='hover:scale-110 hover:duration-150 p-4 search cursor-pointer rounded-lg'>
                            <Home /> &nbsp; Home
                        </li>
                    </Link>
                    <Link to={`/search`}>
                        <li className='hover:scale-110 hover:duration-150 p-4 search cursor-pointer rounded-lg'>
                            <SearchIcon /> &nbsp; Search
                        </li>
                    </Link>
                    <Link to={`/profile/${user.username}`}>
                        <li className='hover:scale-110 hover:duration-150 p-4 search cursor-pointer rounded-lg'>
                            <AccountCircle /> &nbsp; Profile
                        </li>
                    </Link>
                    <Link to={`/chat`}>
                        <li className='hover:scale-110 hover:duration-150 p-4 search cursor-pointer rounded-lg'>
                            <Chat /> &nbsp; Chat
                        </li>
                    </Link>
                    <li className='hover:scale-110 hover:duration-150 p-4 profile cursor-pointer rounded-lg' onClick={clickHandler}>
                        <ExitToApp /> &nbsp; Logout
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Topbar
