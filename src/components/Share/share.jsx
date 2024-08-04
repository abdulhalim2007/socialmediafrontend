import './share.css'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { useContext, useRef, useState } from 'react';
import axios from 'axios'
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router';

function Share() {
    const pf = process.env.REACT_APP_PUBLIC_FOLDER
    const [image, setImage] = useState(null)
    const { user } = useContext(UserContext)
    let desc = useRef()

    const submitHandler = async (e) => {

        let newPost = {
            userId: user._id,
            desc: desc.current.value
        }

        if (image) {
            const data = new FormData()
            let date = new Date()
            let time = date.getTime()
            let name = `${time}${image.name}`
            newPost.img = `posts/${name}`
            data.append('file', image, name)
            axios.post('/upload', data)
                .then(res => {
                    setImage(null)
                    // console.log(image)
                })
                .catch(err => {
                    console.log(err)
                    alert(err)
                })


        }
        axios.post('/post/create', newPost)
            .then(res => {
                desc.current.value = ''
                window.location.reload(false)
            }).catch(err => {
                console.log(err)
            })
        // fetch('/post/create', {
        //     method: 'POST',
        //     body: newPost
        // }).then(res => {
        //     console.log(res.data)
        //     window.location.reload(false)
        // }).catch(err => {
        //     console.log(err)
        // })
        e.preventDefault()
    }

    return (
        <>
            <div className="md:m-8 mt-6">
                <div className='mainShareContainer w-[93%] md:m-2 m-4 rounded-2xl bg-white md:w-3/4'>
                    <div className='md:p-10 p-6 flex flex-col  '>
                        <span className="font-bold md:text-xl text-lg text-slate-500">Share</span>

                        <form onSubmit={submitHandler} className='mt-10' encType='multipart/form-data'>
                            <input ref={desc} type="text" placeholder='Whats going on...' className='hover:scale-105 focus:scale-105 hover:duration-300 active:scale-75 inp focus:placeholder-slate-400 pb-2 w-3/4' />
                            {image && (
                                <div className='m-4 mt-6 p-2 border-slate-400'>
                                    <img src={URL.createObjectURL(image)} alt="img" />
                                </div>
                            )}
                            <div className='pl-4 pr-4 mt-14 justify-between flex'>
                                <label htmlFor="input" className='hover:animate-pulse text-red-500 hover:scale-150 hover:duration-300 active:scale-75 cursor-pointer hover:text-red-600 active:text-red-700'><AddPhotoAlternateIcon /></label>
                                <input type="file" id='input' onChange={e => setImage(e.target.files[0])} className='hidden' />
                                <input type="submit" value="Post" className='p-2 pl-6 pr-6 bg-slate-400 hover:animate-pulse text-white rounded-md hover:scale-125 hover:duration-300 active:scale-75 hover:bg-slate-500  cursor-pointer active:bg-slate-600' />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Share
