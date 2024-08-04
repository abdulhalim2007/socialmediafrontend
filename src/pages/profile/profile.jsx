import CameraAlt from "@material-ui/icons/CameraAlt"
import axios from "axios"
import { useState } from "react"
import { useContext } from "react"
import { useEffect } from "react"
import { useParams } from "react-router"
import Post from "../../components/Post/post"
import Sidebar from "../../components/Sidebar/sidebar"
import Topbar from "../../components/Topbar/topbar"
import { UserContext } from "../../context/UserContext"
import './profile.css'

function Profile() {
    let pf = process.env.REACT_APP_PUBLIC_FOLDER
    const { user: currentUser } = useContext(UserContext)
    const [user, setUser] = useState()
    const [posts, setPosts] = useState()
    const [followed, setFollowed] = useState()
    const [loading, setLoading] = useState(true)
    const { username } = useParams()

    useEffect(() => {
        const func = () => {
            axios.get(`/users/${username}/getUsername`)
                .then(async resp => {
                    setLoading(true)
                    if (!resp.data.err && !resp.data.msg) {
                        setUser(resp.data)
                        setFollowed(currentUser.following.includes(resp.data._id))
                        // console.log(currentUser.following.includes(resp.data._id))
                        // console.log(resp.data)
                        // console.log(currentUser)
                        const res = await axios.get(`/post/all/${resp.data._id}`)
                        setPosts(res.data)
                        setLoading(false)
                    }
                })
        }
        func()
    }, [])

    const changeHandler = async (e) => {
        const data = new FormData()
        let date = new Date()
        let time = date.getTime()
        let image = e.target.files[0]
        let name = `${time}${image.name}`
        data.append('file', image, name)
        let backendName = `person/${name}`
        try {
            axios.post('/uploadForCover', data)
                .then(res => {
                    if (!res.data.err) {
                        axios.post(`/users/cover/${user._id}`, { image: backendName })
                            .then(resp => {
                                if (!res.data.err) {
                                    let newUser = user
                                    newUser.coverPicture = backendName
                                    localStorage.setItem('user', JSON.stringify(newUser))
                                    window.location.reload(false)
                                }
                            })
                    }
                })
        } catch (error) {
            console.log(error)
        }

    }
    const changeHandler2 = async (e) => {
        const data = new FormData()
        let date = new Date()
        let time = date.getTime()
        let image = e.target.files[0]
        let name = `${time}${image.name}`
        data.append('file', image, name)
        let backendName = `person/${name}`
        try {
            axios.post('/uploadForCover', data)
                .then(res => {
                    if (!res.data.err) {
                        axios.post(`/users/profile/${user._id}`, { image: backendName })
                            .then(resp => {
                                if (!res.data.err) {
                                    let newUser = user
                                    newUser.profilePicture = backendName
                                    localStorage.setItem('user', JSON.stringify(newUser))
                                    window.location.reload(false)
                                }
                            })
                    }
                })
        } catch (error) {
            console.log(error)
        }

    }

    const clickHandler = (e) => {
        if (user?._id !== currentUser._id) {
            axios.put(`/users/${currentUser._id}/${user?._id}`)
                .then(res => {
                    if (!res.data.err && res.data.msg) {
                        axios.get(`/users/${currentUser._id}/get`)
                            .then(newUser => {
                                localStorage.setItem('user', JSON.stringify(newUser.data))
                                setFollowed(!followed)
                            })
                    }
                })
        }
    }

    return (
        <div>
            <Topbar />
            <div className="flex flex-row">
                <Sidebar page='profile' />
                <div className="flex flex-col">
                    <div className={` ${user?._id !== currentUser._id && "mb-8"}`}>
                        <img className="cover w-screen h-44 md:h-64 object-cover hover:opacity-[0.8]" src={`${pf}${user?.coverPicture}`} alt="" />
                        {user?._id === currentUser._id && (
                            <>
                                <label htmlFor="coverInp" id='cameraIconCover'>
                                    <CameraAlt className={`relative cursor-pointer icon -mt-[200px] md:-mt-[300px] md:ml-[50%] text ml-[45%]`} />
                                </label>
                                <form encType="multipart/form-data">
                                    <input id="coverInp" onChange={changeHandler} type="file" className="invisible" />
                                </form>
                            </>
                        )}

                    </div>
                    <div className="flex border-b-2 pb-6">
                        <div>

                            <img className={`md:w-36 md:h-36 profile md:-mt-28 w-24 h-24 hover:opacity-[0.9] rounded-full object-cover -mt-16 md:ml-10 ml-6 avatar`} src={`${pf}${user?.profilePicture}`} alt="" />
                            {user?._id === currentUser._id && (
                                <>
                                    <label htmlFor="profileInp" id='cameraIconProfile'>
                                        <CameraAlt className="md:-mt-44 md:ml-[95px] icon2 -mt-32 ml-[55px] relative" />
                                    </label>
                                    <form encType="multipart/form-data">
                                        <input id="profileInp" onChange={changeHandler2} type="file" className="invisible" />
                                    </form>
                                </>
                            )}
                        </div>
                        <div className={`flex flex-shrink-0 -mt-10 pb-10 ${user?._id !== currentUser._id && "pl-40 md:pl-20 pt-4"} md:-ml-20 lg:w-[75%] md:w-[60%] w-[65%] -ml-40`}>
                            <div className="flex flex-col">
                                <span className="ml-3 font-bold text-lg flex-shrink-0 text-slate-700">{user?.fullName}</span>
                                <span className="ml-3 text-slate-600 text-md">@{user?.username}</span>
                                <div className={`flex flex-shrink-0 ${user?._id === currentUser._id ? '-ml-2' : '-ml-20'} mt-2 -mb-3`}>
                                    <span className="cursor-pointer flex-shrink-0 text-slate-700"><span className="font-bold border-black border-b-[1px] pb-1">Following</span> {user?.following.length}</span>
                                    <span className="cursor-pointer flex-shrink-0 text-slate-700"><span className="font-bold border-black border-b-[1px] pb-1 ml-4">Followers</span> {user?.followers.length}</span>
                                </div>
                            </div>
                            <div className="">
                                {user?._id !== currentUser._id && (
                                    <button onClick={clickHandler} className={`${followed ? "bg-slate-400 text-white" : "border-follow text-slate-600 hover:bg-slate-100"} hover:scale-125 hover:duration-300 active:scale-75 ml-4 font-semibold pt-2 pb-2 pl-3 pr-3 rounded-md hover:rounded-3xl hover:bg-slate-500 active:bg-slate-600`}>
                                        {followed ? "Unfollow" : "Follow"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <span className="text-lg font-semibold m-8 md:ml-16">Posts</span>
                    <div className="md:ml-8 -mt-6 w-5/6">
                        {loading && (
                            <img src={`${pf}icons/loading.gif`} alt="Loading" className="w-16 h-16 md:ml-[49%] ml-[43%]" />
                        )}
                        {posts?.length ? posts.map(p => (
                            <><Post post={p} key={p._id} /><br /></>
                        )) : <span className="ml-8">No posts</span>}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Profile