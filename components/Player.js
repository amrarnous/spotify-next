import { RewindIcon, SwitchHorizontalIcon, FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, VolumeUpIcon } from "@heroicons/react/solid"
import { VolumeUpIcon as VolumeDownIcon, HeartIcon } from "@heroicons/react/outline"
import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { useRecoilState } from "recoil"
import { isPlayingState, currentTrackState } from "../Atoms/songAtom"
import useSongInfo from "../hooks/useSongInfo"
import useSpotify from "../hooks/useSpotify"
import { debounce } from "lodash"

function Player() {
    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()
    const [currentTrackIdState, setCurrentIdTrack] = useRecoilState(currentTrackState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)
    const songInfo = useSongInfo()

    const fetchCurrentSong = () => {
        if (!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log('Currently Playing: ', data.body?.item )
                setCurrentIdTrack(data.body?.item?.id)

                spotifyApi.getMyCurrentPlaybackState().then(data => {
                    setIsPlaying(data.body?.is_playing)
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState((data) => {
            if (data.body.isPlaying){
                spotifyApi.pause();
                setIsPlaying(false)

            }else {
                spotifyApi.play();
                setIsPlaying(true)
            }
        })
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackIdState){
            fetchCurrentSong()
            setVolume(50)
        }
    }, [currentTrackIdState, session, spotifyApi])

    useEffect(() => {
        if (volume > 0 && volume < 100){
            debounceAdjustVolume(volume)
        }
    }, [volume])

    const debounceAdjustVolume = useCallback(
        
        debounce((volume) => {
            spotifyApi.setVolume(volume)
        }, 500), []
        
    );
    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
           <div className="flex items-center space-x-4 ">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p className="text-gray-500">{songInfo?.artists?.[0]?.name}</p>
                </div>
           </div>

           <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button" />
                {
                    isPlaying ? (<PauseIcon className="button w-10 h-10"  onClick={handlePlayPause}/>)
                    :
                    (<PlayIcon className="button w-10 h-10" onClick={handlePlayPause}/>)

                }
                <FastForwardIcon className="button"/>
                <ReplyIcon className="button"/>
           </div>

           <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="button" />
                <input className="w-14 md:w-28"
                onChange={(e) => setVolume(Number(e.target.value))} value={volume} type="range" min={0} max={100}/>
                <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="button" />
           </div>
        </div>
    )
}

export default Player
