import axios from 'axios'
import { useContext, useRef, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import './comment.css'
import { format } from 'timeago.js'
import { useNavigate } from 'react-router'

function Comment({ id }) {
    const { user: currentUser } = useContext(UserContext)
    const [comment, setComment] = useState()
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState(false)
    const Navigate = useNavigate()
    let pf = process.env.REACT_APP_PUBLIC_FOLDER
    let ref = useRef()

    useEffect(() => {
        setLoading(true)
        setNewComment(false)
        axios.get(`/post/comment/get/${id}`).then(res => {
            setLoading(false)
            if (!res.err) {
                setComment(res.data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)))
                // console.log(res.data)
            }
        })
    }, [newComment]);

    const submitHandler = (e) => {
        e.preventDefault()
        axios.post('/post/comment/add', {
            id: currentUser._id,
            desc: ref.current.value,
            postId: id
        }).then(res => {
            setNewComment(true)
            ref.current.value = ''
        })
    }

    return (
        <div className="m-5 bg-white rounded-xl md:w-3/4 p-4">
            <span className="font-semibold">Comments ({comment?.length})</span>
            <form onSubmit={submitHandler}>
                <input ref={ref} type="text" placeholder="Add a comment..." className="inp hover:scale-105 focus:scale-105 hover:duration-300 active:scale-75 w-[70%] ml-4" />
            </form>
            <hr className="mt-4" />
            {comment?.length ? comment.map(c => {
                return (<><div className="comment flex flex-col">
                    <div className="flex m-3 justify-between">
                        <div className="flex">
                            <img src={`${pf}${c.user.profilePicture}`} onClick={() => {
                                Navigate(`/profile/${c.user.username}`)
                            }} alt="img" className="hover:scale-125 hover:duration-300 active:scale-75 cursor-pointer w-12 h-12 object-cover rounded-full" />
                            <div className="flex flex-col ml-2">
                                <span className="font-semibold">{c.user.fullName}</span>
                                <span className="text-gray-500">@{c.user.username}</span>
                            </div>
                        </div>
                        <span className="text-gray-400">{format(c.createdAt)}</span>
                    </div>
                    <span className="ml-9">{c.desc}</span>
                </div><hr className="mt-5" /></>)
            }) : loading ? <img src={`${pf}icons/loading.gif`} className='w-12 h-12' /> : <span className='ml-6'>No comments</span>}

        </div>)
}

export default Comment