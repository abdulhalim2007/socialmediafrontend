import './sidebar.css'
import Home from '@material-ui/icons/Home'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Chat from '@material-ui/icons/Chat'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'

function Sidebar({ page }) {
    const { user } = useContext(UserContext)
    return (
        <div className=' bg-slate-300 h-screen sidebar xl:pl-4 xl:pr-4 pr-0 pl-0 min-w-[200px] text-slate-600 md:w-2/6 lg:w-2/12 hidden md:flex md:flex-col lg:flex lg:flex-col'>
            <ul className='list'>
                <Link to='/'>
                    <li className={`item rounded-lg ${page === "home" && 'bg-gray-300 text-gray-500'} mb-2 hover:scale-110 active:scale-75 hover:bg-gray-400 hover:text-white active:bg-gray-500 active:text-white`}>
                        <Home />
                        <span className="text">&nbsp;&nbsp;&nbsp;Home</span>
                    </li>
                </Link>
                <Link to={`/profile/${user.username}`}>
                    <li className={`item rounded-lg ${page === "profile" && 'bg-gray-300 text-gray-500'} mb-2 hover:scale-110 active:scale-75 hover:bg-gray-400 hover:text-white active:bg-gray-500 active:text-white`}>
                        <AccountCircle />
                        <span className="text">&nbsp;&nbsp;&nbsp;Profile</span>
                    </li>
                </Link>
                <Link to='/chat'>
                    <li className={`item rounded-lg ${page === "chat" && 'bg-gray-300 text-gray-500'} mb-2 hover:scale-110 active:scale-75 hover:bg-gray-400 hover:text-white active:bg-gray-500 active:text-white`}>
                        <Chat />
                        <span className="text">&nbsp;&nbsp;&nbsp;Chat</span>
                    </li>
                </Link>
            </ul>
        </div>
    )
}

export default Sidebar
