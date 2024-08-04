import Delete from '@material-ui/icons/Delete'
import BookmarkBorderOutlined from '@material-ui/icons/BookmarkBorderOutlined'
import Bookmark from '@material-ui/icons/Bookmark'
import FavoriteBorderOutlined from '@material-ui/icons/FavoriteBorderOutlined'
import CameraAlt from '@material-ui/icons/CameraAlt'
import Favorite from '@material-ui/icons/Favorite'
import CommentOutlined from '@material-ui/icons/CommentOutlined'
import './post.css'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { format } from 'timeago.js'
import axios from 'axios'
import { useNavigate } from 'react-router'

function Post({ post }) {
    const pf = process.env.REACT_APP_PUBLIC_FOLDER
    const { user } = useContext(UserContext)
    const [like, setLike] = useState(post.likes.length)
    const [liked, setLiked] = useState(post.likes.includes(user._id))
    const [pinned, setPinned] = useState(user.pinnedPost === post._id)
    const Navigate = useNavigate()
    const [clicked, setClicked] = useState(false)
    const [clickedLike, setClickedLike] = useState(false)
    const [clickedPinned, setClickedPinned] = useState(false)
    const [comment, setComment] = useState()

    useEffect(() => {
        axios.get(`/post/comment/get/${post._id}`).then(res => {
            if (!res.err) {
                setComment(res.data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)))
                // console.log(res.data)
            }
        })
    }, []);

    const deleteHandler = (e) => {
        setClicked(true)
        const func = async () => {
            axios.delete(`/post/${post._id}/${post.userId._id}`)
                .then(res => {
                    if (!res.data.err && res.data.msg) {
                        window.location.reload(false)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        func()
    }

    const likeHandler = (e) => {
        setClickedLike(true)
        const func = async () => {
            axios.put(`/post/like/${post._id}/${user._id}`)
                .then(res => {
                    if (liked) {
                        setLike(like - 1)
                        setLiked(false)
                    } else {
                        setLike(like + 1)
                        setLiked(true)
                    }
                })
                .catch(err => console.log(err))
        }

        func()
    }

    const pinHandler = async (e) => {
        setClickedPinned(true)
        axios.post(`/users/pin/${user._id}/${post._id}`)
            .then(res => {
                if (!res.err) {
                    let newUser = user
                    if (pinned) {
                        newUser.pinnedPost = ""
                    } else {
                        newUser.pinnedPost = post._id
                    }
                    localStorage.setItem('user', JSON.stringify(newUser))
                    window.location.reload(false)
                }
            })
    }

    return (
        <div className="bg-white rounded-2xl md:w-3/4 w-[93%] m-4 postsContainer">
            <div className="p-4 flex flex-row justify-between">
                <div className="flex flex-row flex-shrink-0">
                    <img src={`${pf}${post.userId.profilePicture}`} onClick={() => Navigate(`/profile/${post.userId.username}`)} className='hover:scale-125 hover:duration-300 active:scale-75 rounded-full w-10 h-10 mt-2 flex-shrink-0 object-cover' />
                    <div className="flex flex-col ml-3">
                        <span className="font-bold text-gray-600">{post.userId.fullName} {pinned && <span className='text-gray-400'>&nbsp;&nbsp;&nbsp;&nbsp;Pinned</span>}</span>
                        <span className="text-gray-400">@{post.userId.username}</span>
                    </div>
                </div>
                <div className="pt-2 flex flex-col">
                    <div className='flex'>
                        {post.userId._id === user._id && (
                            <div className='hover:scale-125 hover:duration-300 active:scale-75'>
                                <Delete onClick={deleteHandler} className='text-red-600 cursor-pointer hover:text-red-700 active:text-red-800' />
                            </div>
                        )}
                        {pinned ? (
                            <div className='hover:scale-125 hover:duration-300 active:scale-75'><Bookmark onClick={pinHandler} className='text-gray-400 cursor-pointer hover:text-gray-500 active:text-gray-600' /></div>
                        ) : <div className='hover:scale-125 hover:duration-300 active:scale-75'><BookmarkBorderOutlined onClick={pinHandler} className='hover:scale-125 hover:duration-300 active:scale-75 text-gray-400 cursor-pointer hover:text-gray-500 active:text-gray-600' /></div>}
                    </div>
                    <span className={`text-gray-400 -ml-7 text-sm`}>{format(post.createdAt)}</span>
                </div>
            </div>
            <hr />
            <div className=' p-7 pt-7 -mt-4 flex flex-col' onClick={(e) => {
                Navigate(`/post/${post._id}`)
            }}>
                <span className={post.img && 'pb-4'}>{post.desc}</span>
                {post.img && (<img src={`${pf}${post.img}`} className='rounded-2xl' alt="img" />)}
            </div>
            <hr />
            <div className=' p-4 flex justify-between md:ml-10 md:mr-10'>
                <div className='flex'>
                    {liked ? <div className='hover:scale-110 hover:duration-150 active:scale-75'><Favorite onClick={likeHandler} className='hover:scale-150 hover:duration-150 text-red-600 cursor-pointer hover:text-red-700 active:text-red-900' /></div> :
                        <div className='hover:scale-110 hover:duration-150 active:scale-75'><FavoriteBorderOutlined onClick={likeHandler} className='hover:scale-150 hover:duration-150 cursor-pointer hover:text-gray-700 active:text-gray-900' /></div>}
                    <span className={`pl-1 -mt-[2px] ${liked && 'text-red-600'}`}>{like}</span>
                </div>
                <div className='flex'>
                    <div className='hover:scale-110 hover:duration-150 active:scale-75'>
                        <CommentOutlined className='cursor-pointer hover:text-gray-700 active:text-gray-900' />
                    </div>
                    <span className={`pl-1 -mt-[2px]`}>{comment?.length}</span>
                </div>
            </div>
        </div>
    )
}

export default Post
