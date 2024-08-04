import Posts from "../../components/Posts/posts"
import Share from "../../components/Share/share"
import Sidebar from "../../components/Sidebar/sidebar"
import Topbar from "../../components/Topbar/topbar"
import './home.css'

function Home() {

    return (
        <div>
            <Topbar />
            <div className="flex flex-row">
                <Sidebar page='home' />
                <div className="container w-screen">
                    <div className="md:w-5/6 mainContainer">
                        <Share />
                        <Posts />
                    </div>
                    {/* <div className="col-span-1 relative hidden md:block sideContainer">

                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Home
