import {HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HeartIcon, RssIcon, LogoutIcon} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../Atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
function Sidebar() {
    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()
    const [ playlists, setPlaylists ] = useState([])
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    useEffect(() => {
        if (spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items)
            })
        }
    }, [session, spotifyApi])

    return (
        <div className="text-gray-500 p-5 text-xs border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] min-w-[15%] hidden md:inline-flex pb-36">
            <div className="space-y-4 w-full">
            <button className="flex items-center space-x-2 hover:text-white" onClick={() => signOut()}>
                    <LogoutIcon className="h-5 w-5" />
                    <p>Log out</p>
                    
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5" />
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon className="h-5 w-5" />
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="h-5 w-5" />
                    <p>Library</p>
                </button>
                <hr  className="border-t-[0.1px] border-gray-900" />

                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="h-5 w-5 text-blue-500" />
                    <p>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="h-5 w-5 text-green-500" />
                    <p>Your Episodes</p>
                </button>
                <hr  className="border-t-[0.1px] border-gray-900" />

                {playlists.map((playlist) => (
                    
                    <div key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white flex items-center">
                        <img className="w-5 h-5 rounded-sm overflow-hidden mr-2" src={playlist.images[0].url} alt="" />
                        <p>{playlist.name}</p>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Sidebar
