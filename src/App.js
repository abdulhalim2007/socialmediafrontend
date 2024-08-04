import Login from "./pages/login/login";
import Register from "./pages/register/register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import Home from "./pages/home/home";
import Profile from "./pages/profile/profile";
import Search from "./pages/search/search";
import PostPage from "./pages/post/postPage";
import Chat from "./pages/chat/Chat";
import AddChat from "./pages/addChat/addChat";
import Message from "./pages/Message/Message";

function App() {
  const { user } = useContext(UserContext)

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={user ? <Home /> : <Navigate to='/login' />} />
        <Route exact path='/profile/:username' element={user ? <Profile /> : <Navigate to='/login' />} />
        <Route exact path='/profile' element={<Navigate to={user ? `/profile/${user.username}` : '/login'} />} />
        <Route exact path='/search/:query' element={user ? <Search /> : <Navigate to='/login' />} />
        <Route exact path='/search/' element={user ? <Search /> : <Navigate to='/login' />} />
        <Route exact path='/post/:id' element={user ? <PostPage /> : <Navigate to='/login' />} />
        <Route exact path='/chat' element={user ? <Chat /> : <Navigate to='/login' />} />
        <Route exact path='/chat/add' element={user ? <AddChat /> : <Navigate to='/login' />} />
        <Route exact path='/chat/id/:id' element={user ? <Message /> : <Navigate to='/login' />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
