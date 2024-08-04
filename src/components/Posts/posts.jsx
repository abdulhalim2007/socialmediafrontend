import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import Post from '../Post/post'

function Posts() {
    const [posts, setPosts] = useState(undefined)
    const [pinnedPost, setPinnedPost] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const { user } = useContext(UserContext)
    const pf = process.env.REACT_APP_PUBLIC_FOLDER
    useEffect(() => {
        const func = async () => {
            setLoading(true)
            const res = await axios.get('post/all')
            let newData = res.data.filter(p => p._id !== user.pinnedPost)
            setPosts(newData.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)))
            setLoading(false)
        }

        func()
    }, [])

    useEffect(() => {
        axios.get(`/users/${user._id}/pinGet`)
            .then(res => {
                if (!res.err && !res.msg) {
                    setPinnedPost(res.data)
                }
            })
    }, [])

    return (
        <div className="flex flex-col md:m-8 mb-3">
            {loading && (
                <img src={`${pf}icons/loading.gif`} className='w-16 h-16 md:ml-[50%] ml-[45%] mt-4' />
            )}

            {
                pinnedPost?._id && <><Post post={pinnedPost} /><hr /></>
            }
            {
                posts && posts.map(p => (
                    <Post post={p} key={p._id} />
                ))
            }

            {
                !loading && !posts?.length && <> No Post found :( </>
            }

        </div>

    )
}



export default Posts
