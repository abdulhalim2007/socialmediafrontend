import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { useParams } from "react-router"
import Post from "../../components/Post/post"
import Sidebar from "../../components/Sidebar/sidebar"
import Topbar from "../../components/Topbar/topbar"

function Search() {
    let { query } = useParams()
    const [posts, setPosts] = useState()
    const [loading, setLoading] = useState(true)
    const pf = process.env.REACT_APP_PUBLIC_FOLDER

    useEffect(() => {
        setLoading(false)
        if (query?.trim()) {
            setLoading(true)
            axios.get(`/post/search?query=${query}`)
                .then(res => {
                    if (!res.data.err) {
                        setPosts(res.data.posts.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)))
                    }
                    setLoading(false)
                })
        }
    }, [query])

    return (
        <div>
            <Topbar search={true} query={query?.trim() && query} />
            <div className="flex flex-row">
                <Sidebar page='home' />
                <div className="container w-screen">
                    <div className="md:m-10">
                        {loading &&

                            <img src={`${pf}icons/loading.gif`} alt="Loading" className="w-16 h-16 md:ml-[50%] ml-[43%]" />
                        }
                        {query?.trim() ? posts?.length ? posts?.map(p => (
                            <Post post={p} key={p._id} />
                        )) : (
                            <span className="m-8">No posts.</span>
                        ) :
                            <span className="m-8">Enter a value.</span>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search
