import Sidebar from "../../components/Sidebar/sidebar"
import Topbar from "../../components/Topbar/topbar"
import AddCircleOutlineOutlined from '@material-ui/icons/AddCircleOutlineOutlined'
import './chat.css'
import { useEffect } from "react"
import axios from "axios"
import { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { useState, useRef } from "react"
import { useNavigate } from "react-router"

function Chat() {
    const pf = process.env.REACT_APP_PUBLIC_FOLDER
    let { user: currentUser } = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const [chats, setChats] = useState()
    const Navigate = useNavigate()
    const messagesEndRef = useRef(null)

    useEffect(() => {
        setLoading(true)
        axios.get(`/chat/get/${currentUser._id}`)
            .then(res => {
                setLoading(false)
                if (!res.err) {
                    let chatPre = res.data
                    let chatPost = chatPre.map(chat => {
                        if (chat.user1._id !== currentUser._id) {
                            chat.user = chat.user1
                            delete chat.user1
                            delete chat.user2
                            if (chat.chatName[0] !== currentUser.fullName) {
                                chat.chatName = chat.chatName[0]
                                return chat
                            } else if (chat.chatName[0] === currentUser.fullName) {
                                chat.chatName = chat.chatName[1]
                                return chat
                            }
                        } else if (chat.user1._id === currentUser._id) {
                            chat.user = chat.user2
                            delete chat.user1
                            delete chat.user2
                            if (chat.chatName[0] !== currentUser.fullName) {
                                chat.chatName = chat.chatName[0]
                                return chat
                            } else if (chat.chatName[0] === currentUser.fullName) {
                                chat.chatName = chat.chatName[1]
                                return chat
                            }
                        }
                    })
                    console.log(chatPost)
                    setChats(chatPost)
                }
            })
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chats])

    return (
        <div className="h-screen">
            <Topbar />
            <div className="flex flex-row">
                <Sidebar page='chat' />
                <div className="flex flex-col w-screen ">
                    <div className="flex w-full justify-between header h-20 p-8 pt-6">
                        <span className="font-bold font-lg">Inbox</span>
                        <AddCircleOutlineOutlined onClick={(e) => {
                            Navigate('/chat/add')
                        }} className="hover:scale-125 hover:duration-300 active:scale-75 cursor-pointer hover:text-slate-700 active:text-slate-800" />
                    </div>
                    {chats?.length ? chats.map(c => (
                        <div onClick={(e) => {
                            Navigate(`/chat/id/${c._id}`)
                        }} className="p-4 chat flex hover:bg-slate-300 active:bg-slate-400">
                            <img src={`${pf}${c.user.profilePicture}`} alt="img" className="rounded-full w-12 h-12 object-cover" />
                            <div className="flex flex-col ml-4">
                                <span className="font-semibold text-md">{c.chatName}</span>
                                <span className="text-slate-500 text-sm">{`@${c.user.username}`}</span>
                            </div>
                        </div>
                    )) : loading ? <img src={`${pf}icons/loading.gif`} alt='loading' className="w-16 h-16 ml-[46%] mt-10" /> : <span className="m-5">No chats :(</span>}

                </div>
            </div>
        </div>
    )
}

export default Chat