import { red } from "@material-ui/core/colors"
import axios from "axios"
import { useContext } from "react"
import { useRef, useState } from "react"
import { useNavigate } from "react-router"
import Sidebar from "../../components/Sidebar/sidebar"
import Topbar from "../../components/Topbar/topbar"
import { UserContext } from "../../context/UserContext"
import './addChat.css'

function AddChat() {
    let ref = useRef()
    const [users, setUsers] = useState()
    const { user: currentUser } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const pf = process.env.REACT_APP_PUBLIC_FOLDER
    let Navigate = useNavigate()

    const changeHandler = (e) => {
        setLoading(true)
        axios.get(`/post/search?query=${e.target.value}`)
            .then(res => {
                setLoading(false)
                if (!res.err) {
                    setUsers(res.data.users)
                }
                console.log(res.data.users)
            })

    }

    const clickHandler = (e) => {
        let id = e.target.getAttribute('data-id')
        let name = e.target.getAttribute('data-name')
        console.log(name)
        console.log(id)

        axios.post('/chat/add', {
            id1: currentUser._id,
            id2: id,
            name: [currentUser.fullName, name]
        }).then(res => {
            if (!res.data.err && !res.data.msg) {
                console.log(res.data)
                Navigate('/chat')
            }
        })
    }

    return (
        <div>
            <Topbar />
            <div className="flex flex-row">
                <Sidebar page='chat' />
                <div className="w-screen">
                    <div className="header p-6 w-screen">
                        <span className="font-bold">Add Chat</span>
                    </div>
                    <div className="main">
                        <form className="m-10 flex flex-col">
                            <input ref={ref} onChange={changeHandler} type="text" className="inputSearch w-3/4 pb-2" placeholder="Search Users...." />
                        </form>
                        {ref.current?.value && (
                            <div className="m-10 flex flex-col">
                                {users?.length ? users.map(u => (
                                    <div onClick={clickHandler} data-id={`${u._id}`} data-name={`${u.fullName}`} className="p-4 flex item hover:bg-gray-200 active:bg-gray-300">
                                        <img src={`${pf}${u.profilePicture}`} className="w-12 h-12 rounded-full object-cover" />
                                        <div className="flex flex-col ml-2">
                                            <span className="font-bold">{u.fullName}</span>
                                            <span className="text-gray-500">@{u.username}</span>
                                        </div>
                                    </div>
                                )) : loading ? <img src={`${pf}icons/loading.gif`} className="ml-[45%] h-12 w-12" /> : <span className="">No Users</span>}

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddChat