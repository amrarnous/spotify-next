import useSpotify from "../hooks/useSpotify"
import { currentTrackState } from "../Atoms/songAtom"
import { useRecoilState } from "recoil"
import { useState, useEffect } from "react"
function useSongInfo() {
    const spotifyApi = useSpotify()
    const [currentTrackIdState, setCurrentIdTrack] = useRecoilState(currentTrackState)
    const [songInfo, setSongInfo] = useState(null)

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentTrackIdState){
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackIdState}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                        }
                    }
                ).then(res => res.json())

                setSongInfo(trackInfo)
            }
        }
        fetchSongInfo()
    }, [currentTrackIdState, spotifyApi])
    return songInfo
}

export default useSongInfo
