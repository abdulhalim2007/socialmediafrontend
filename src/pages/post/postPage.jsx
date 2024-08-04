import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Post from "../../components/Post/post";
import PostPageComponent from "../../components/PostPageComponent/postPageComponent";
import Sidebar from "../../components/Sidebar/sidebar";
import Topbar from "../../components/Topbar/topbar";
import './postPage.css'


function PostPage() {
    const [post, setPost] = useState(true)
    const [loading, setLoading] = useState()
    const pf = process.env.REACT_APP_PUBLIC_FOLDER
    const { id } = useParams()
    useEffect(() => {
        setLoading(true)
        axios.get(`/post/getOne/${id}`)
            .then(res => {
                setLoading(false)
                if (!res.err) {
                    setPost(res.data)
                }
            })
    }, []);
    return (
        <div>
            <Topbar />
            <div className="flex">
                <Sidebar />
                <div className="post">
                    {loading && (
                        <img src={`${pf}icons/loading.gif`} className='ml-[45%] md:ml-[48%] w-20 h-20 mt-10' />
                    )}
                    {post?._id ? <PostPageComponent post={post} /> : !loading && (<span className="ml-2">No post found</span>)}
                </div>
            </div>
        </div>
    )
}

export default PostPage