import Header from "../../components/Header/header"
import Sidebar from "../../components/Sidebar/sidebar"
import Topbar from "../../components/Topbar/topbar"
import Send from "@material-ui/icons/Send"
import './message.css'
import { useEffect, useState, useRef, useContext } from "react"
import axios from "axios"
import { useParams } from "react-router"
import { UserContext } from '../../context/UserContext'
import io, { Socket } from 'socket.io-client'

function Message() {
    const pf = process.env.REACT_APP_PUBLIC_FOLDER
    const { id } = useParams()
    const socket = io()
    let ref = useRef()
    const [chats, setChats] = useState()
    const [userTyping, setUserTyping] = useState(false)
    const [messages, setMessages] = useState()
    const { user: currentUser } = useContext(UserContext)

    useEffect(() => {
        axios.get(`/chat/${id}`)
            .then(async res => {
                if (!res.err) {
                    let chat = res.data
                    if (chat.user1._id !== currentUser._id) {
                        chat.user = chat.user1
                        delete chat.user1
                        delete chat.user2
                        if (chat.chatName[0] !== currentUser.fullName) {
                            chat.chatName = chat.chatName[0]
                        } else if (chat.chatName[0] === currentUser.fullName) {
                            chat.chatName = chat.chatName[1]
                        }
                    } else if (chat.user1._id === currentUser._id) {
                        chat.user = chat.user2
                        delete chat.user1
                        delete chat.user2
                        if (chat.chatName[0] !== currentUser.fullName) {
                            chat.chatName = chat.chatName[0]
                        } else if (chat.chatName[0] === currentUser.fullName) {
                            chat.chatName = chat.chatName[1]
                        }
                    }
                    // console.log(chat)
                    setChats(chat)
                    await socket.emit('userConnected', { id: currentUser._id, chatId: chat._id })
                    console.log('connectednpm install -g firebase-tools')

                    // console.log(chat)
                    axios.get(`/chat/message/get/${id}`)
                        .then(res => {
                            if (!res.data.err) {
                                setMessages(res.data)
                                window.scrollTo(0, document.body.scrollHeight);
                                // console.log(res.data)
                            }
                        })
                }
            })
    }, [])

    const submitHandler = (e) => {
        axios.post('/chat/message/add', {
            from: currentUser._id,
            to: chats?.user._id,
            text: ref.current.value,
            chatId: chats._id
        }).then(res => {
            socket.emit('newMessage', { data: ref.current.value, fromId: currentUser._id, chatId: chats?._id })
            document.getElementById('cont').insertAdjacentHTML('beforeend', `
                <div class="msg mb-4 ${res.data.from !== currentUser._id ? "him" : "text-right"}">
                    <span class="bg-white pl-3 pr-3 rounded-full p-2">${res.data.text}</span>
                </div>
            `)
            window.scrollTo(0, document.body.scrollHeight);
            ref.current.value = ""
            // console.log(res.data.msg)
        })

        e.preventDefault()
        // window.location.reload(false)
    }

    useEffect(() => {
        socket.on('newMessage2', ({ data, fromId }) => {
            if (fromId !== currentUser._id) {
                // console.log('hey')
                document.getElementById('cont').insertAdjacentHTML('beforeend', `
                <div class="msg mb-4 ${fromId !== currentUser._id ? "him" : "text-right"}">
                    <span class="bg-white pl-3 pr-3 rounded-full p-2">${data}</span>
                </div>
                `)
                window.scrollTo(0, document.body.scrollHeight);
            }
        })
        // socket.on("typing2", ({ userId }) => {
        //     if (userId.userId !== currentUser._id) {
        //         // console.log('Hey you')
        //         // console.log(ref?.current?.value)
        //         setUserTyping(true)
        //     }
        // })
        // socket.on('stopped', ({ userId }) => {
        //     if (userId.userId !== currentUser._id) {
        //         console.log('Hey you')

        //         setUserTyping(false)
        //     }
        // })
    }, [])

    // useEffect(() => {


    // }, [])

    const changeHandler = (e) => {
        // let lastTypingTime = new Date().getTime()
        // // console.log(ref.current.value)
        // console.log(chats._id)
        // let id = chats._id
        // socket.emit("typing", { userId: currentUser._id, chatId: id })
        // setTimeout(() => {
        //     let timeNow = new Date().getTime()
        //     let timeDiff = timeNow - lastTypingTime
        //     if (timeDiff >= 3000 && userTyping) {
        //         console.log('heyeeehehey')
        //         socket.emit("stopTyping", { userId: currentUser._id, chatId: id })
        //         // setUserTyping(false)
        //     }
        // }, 3000)
    }

    return (
        <div>
            <Topbar />
            <div className="flex flex-row">
                <Sidebar page='chat' />
                <div className=" w-screen">
                    <Header pf={pf} chat={chats?._id && chats} typing={userTyping} />
                    <div id='cont' className="pt-24 m-5 p-2 flex flex-col mb-20">
                        {messages?.length ? messages.map(m => {
                            return (
                                <div className={`msg mb-4 ${m.from !== currentUser._id ? "him" : "text-right"}`}>
                                    <span className="bg-white pl-3 pr-3 rounded-full p-2">{m.text}</span>
                                </div>
                            )
                        }) : <span className="m-5"></span>}
                    </div>
                    <form onSubmit={submitHandler} className="fixed bottom-0 bg-gray-300 rounded-lg w-full p-6 flex overflow-x-auto">
                        <input onChange={changeHandler} ref={ref} type="text" placeholder="Whatsapp...." className="bg-gray-300 hover:scale-[1.02] hover:duration-300 active:scale-75 inputText w-[90%] md:w-[70%] lg:w-[80%]" />
                        <div onClick={submitHandler} className="hover:scale-125 hover:duration-300 active:scale-75">
                            <Send className="ml-2 cursor-pointer text-slate-600 hover:text-slate-700 active:text-slate-800" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Message
