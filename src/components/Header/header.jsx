function Header({ pf, chat, typing }) {
    return (
        <div className="p-6 bg-gray-300 fixed w-full rounded-lg flex">
            <img src={`${pf}person/noAvatar.jpg`} alt="" className="w-12 h-12 rounded-full object-cover" />
            <div className="flex flex-col ml-1">
                <span className="font-semibold ml-2">{chat?.chatName}</span>
                <span className="text-md text-gray-500">@{chat?.user.username}</span>
            </div>
            {typing ? <div>typing</div> : <div></div>}
        </div>
    )
}

export default Header