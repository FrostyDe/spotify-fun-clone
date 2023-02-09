import { BsFillPlayCircleFill, BsFillPauseCircleFill } from "react-icons/bs";
import React, { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { playingTrackState, playState } from "../atoms/playerAtoms";
import useSpotify from "../hooks/useSpotify";
import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
import { GiMusicalNotes } from "react-icons/gi";
import { IoShuffle } from "react-icons/io5";
import { TbRepeatOnce, TbRepeat } from "react-icons/tb";
import { useSession } from "next-auth/react";
import { FiVolume1, FiVolume2, FiVolumeX } from "react-icons/fi";

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [play, setPlay] = useRecoilState(playState);
  const [volume, setVolume] = useState(100);
  const [repeatState, setRepeatState] = useState("off");
  const [shuffleState, setShuffleState] = useState(false);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
        if (data.body) {
          const item = data.body.item;
          setPlayingTrack({
            id: item?.id,
            artist: item?.artists[0].name,
            title: item?.name,
            album_type: item?.name,
            uri: item?.uri,
            albumUrl: item?.album.images[0].url,
          });
          if (data.body?.is_playing) {
            setPlay(true);
          } else {
            setPlay(false);
          }
          setRepeatState(data.body?.repeat_state);
          setShuffleState(data.body?.shuffle_state);
        }
      });
    }
  }, [playingTrack, session, spotifyApi, play]);

  const handlePlayPause = () => {
    if (play) {
      spotifyApi.pause();
      setPlay(false);
    } else {
      spotifyApi.play();
    }
  };

  const handleNext = () => {
    spotifyApi.skipToNext();
    spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
      const item = data.body.item;
      setPlayingTrack({
        id: item.id,
        artist: item.artists[0].name,
        title: item.name,
        album_type: item.name,
        uri: item.uri,
        albumUrl: item.album.images[0].url,
      });
    });
  };

  const handlePrev = () => {
    spotifyApi.skipToPrevious();
    spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
      const item = data.body.item;
      setPlayingTrack({
        id: item.id,
        artist: item.artists[0].name,
        title: item.name,
        album_type: item.name,
        uri: item.uri,
        albumUrl: item.album.images[0].url,
      });
    });
  };

  const handleVolume = (volume: number) => {
    setVolume(volume);
  };

  const handleShuffle = () => {
    spotifyApi.setShuffle(!shuffleState);
  };

  const handleRepeat = () => {
    if (repeatState === "off") {
      spotifyApi.setRepeat("context");
    } else if (repeatState === "context") {
      spotifyApi.setRepeat("track");
    } else {
      spotifyApi.setRepeat("off");
    }
  };

  const floatingPlaying = (
    <div className="fixed bottom-[5rem] left-2 flex items-center justify-between gap-2 p-3 w-56 rounded-lg bg-[#111111] md:hidden">
      <div className="col-span-3 flex flex-col self-center gap-2">
        <h1 className="font-semibold text-sm">{playingTrack.title}</h1>
        <p className="text-sm font-light">{playingTrack.artist}</p>
      </div>
      <div className="w-12 overflow-hidden rounded-md">
        <img src={playingTrack.albumUrl} alt="" />
      </div>
    </div>
  );

  return (
    <div className="w-full grid grid-cols-12 bg-[#303030] h-27 fixed bottom-0 text-white font-poppins">
      <div className="max-md:hidden md:flex md:col-span-3 xl:col-span-2 flex-col bg-[#111111] justify-between items-center pt-5 px-2">
        <div className="grid grid-cols-5 gap-4">
          <div
            className={`rounded-full justify-self-end self-center bg-[#353535] col-span-2 h-16 w-16 flex items-center justify-center ${
              play && "animate-spin-slow"
            }`}
          >
            <GiMusicalNotes className="w-5 h-5 text-white" />
          </div>
          <div className="col-span-3 flex flex-col self-center gap-2">
            <h1 className="font-semibold text-sm">{playingTrack.title}</h1>
            <p className="text-sm font-light">{playingTrack.artist}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            onChange={(e) => {
              handleVolume(parseInt(e.target.value));
            }}
            value={volume}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          {volume > 50 && (
            <button onClick={() => handleVolume(0)}>
              <FiVolume2 className="h-5 w-5" />
            </button>
          )}
          {volume === 0 && (
            <button onClick={() => handleVolume(50)}>
              <FiVolumeX className="h-5 w-5" />
            </button>
          )}
          {volume > 0 && volume <= 50 && (
            <button onClick={() => handleVolume(0)}>
              <FiVolume1 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <div className="col-span-12 md:col-span-9 xl:col-span-10 grid grid-cols-6 p-4 justify-center items-center">
        <div className="max-md:hidden md:col-span-1">
          <div className="w-10 h-10 md:w-20 md:h-20 mx-5 rounded-md overflow-hidden bg-gray-400">
            <img src={playingTrack.albumUrl} alt="" />
          </div>
        </div>
        <div className="col-span-4 flex items-center justify-center gap-5">
          <button className="pr-5">
            <BiSkipPrevious onClick={() => handlePrev()} className="w-8 h-8" />
          </button>
          {play ? (
            <button onClick={() => handlePlayPause()}>
              <BsFillPauseCircleFill className="h-10 w-10" />
            </button>
          ) : (
            <button onClick={() => handlePlayPause()}>
              <BsFillPlayCircleFill className="h-10 w-10" />
            </button>
          )}
          <button onClick={() => handleNext()} className="pl-5">
            <BiSkipNext className="w-8 h-8" />
          </button>
        </div>
        <div className="col-span-2 md:col-span-1 flex gap-4 justify-center md:justify-end items-center">
          <button onClick={() => handleShuffle()}>
            <IoShuffle
              className={`w-6 h-6 ${shuffleState && "text-green-500"}`}
            />
          </button>
          {repeatState === "off" && (
            <button onClick={() => handleRepeat()}>
              <TbRepeat className="w-5 h-5 text-gray-300" />
            </button>
          )}

          {repeatState === "context" && (
            <button onClick={() => handleRepeat()}>
              <TbRepeat className="w-6 h-6 text-green-500" />
            </button>
          )}

          {repeatState === "track" && (
            <button onClick={() => handleRepeat()}>
              <TbRepeatOnce
                className="w-6 h-6 
                 text-green-500"
              />
            </button>
          )}
        </div>
      </div>
      {play && floatingPlaying}
    </div>
  );
};

export default Player;
