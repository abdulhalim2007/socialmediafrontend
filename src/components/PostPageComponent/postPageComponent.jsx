import Comment from "../Comment/comment"
import Post from "../Post/post"

function PostPageComponent({ post }) {

    return (
        <div className="md:m-10 m-2 flex flex-col">
            <Post post={post} />
            <Comment id={post._id} />
        </div>
    )
}

export default PostPageComponent