import { BsFillPlayCircleFill, BsFillPauseCircleFill } from "react-icons/bs";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playingTrackState, playState } from "../atoms/playerAtoms";
import useSpotify from "../hooks/useSpotify";
import { BiSkipPrevious, BiSkipNext, BiDevices } from "react-icons/bi";
import { GiMusicalNotes } from "react-icons/gi";
import { IoShuffle } from "react-icons/io5";
import { TbRepeatOnce, TbRepeat } from "react-icons/tb";
import { useSession } from "next-auth/react";
import { FiVolume1, FiVolume2, FiVolumeX } from "react-icons/fi";
import { Bars } from "react-loader-spinner";

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [play, setPlay] = useRecoilState(playState);
  const [volume, setVolume] = useState(100);
  const [repeatState, setRepeatState] = useState("off");
  const [shuffleState, setShuffleState] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [openDevices, setOpenDevices] = useState<boolean>(false);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);
  const [isPlayerActive, setPlayerActive] = useState<boolean>(false);
  const [player, setPlayer] = useState<any | null>(null);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = false;

      document.body.appendChild(script);
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Spotify Fun Clone",
          getOAuthToken: (cb: any) => {
            cb(spotifyApi.getAccessToken());
          },
        });

        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          spotifyApi.transferMyPlayback([device_id]);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("player_state_changed", (state: any) => {
          if (!state) {
            return;
          }

          if (state.track_window.current_track) {
            setPlayingTrack({
              id: state.track_window.current_track.id,
              artist: state.track_window.current_track.artists[0].name,
              title: state.track_window.current_track.name,
              album_type: state.track_window.current_track.name,
              uri: state.track_window.current_track.uri,
              albumUrl: state.track_window.current_track.album.images[0].url,
              repeat_mode: state.repeat_mode,
              shuffle: state.shuffle,
            });
          }
          setPlay(!state.paused);
          setPlayerActive(true);
        });

        player.connect();
        setPlayer(player);
        console.log("player is set");
      };
    }
  }, [session]);

  const getDevices = () => {
    spotifyApi.getMyDevices().then(
      function (data: any) {
        let availableDevices = data.body.devices;
        setDevices(availableDevices);
        setOpenDevices(!openDevices);
      },
      function (err: any) {
        console.log("Something went wrong!", err);
      }
    );
  };

  const handlePlayPause = () => {
    setPlay(!play);
    if (play) {
      spotifyApi.pause();
      setPlay(false);
    } else {
      spotifyApi.play();
    }
  };

  const handleNext = () => {
    player.nextTrack();
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
    player.previousTrack();
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
    spotifyApi.setVolume(volume).then(
      function () {
        setVolume(volume);
      },
      function (err: any) {
        console.log("Something went wrong!", err);
      }
    );
  };

  const handleTransferPlayback = (deviceId: any) => {
    spotifyApi.transferMyPlayback([deviceId]);
    setOpenDevices(false);
  };

  const handleShuffle = () => {
    spotifyApi.setShuffle(!playingTrack.shuffle);
  };

  const handleRepeat = () => {
    if (playingTrack.repeat_mode === 0) {
      spotifyApi
        .setRepeat("context")
        .then(() => setPlayingTrack({ ...playingTrack, repeat_mode: 1 }));
    } else if (playingTrack.repeat_mode === 1) {
      spotifyApi
        .setRepeat("track")
        .then(() => setPlayingTrack({ ...playingTrack, repeat_mode: 2 }));
    } else {
      spotifyApi
        .setRepeat("off")
        .then(() => setPlayingTrack({ ...playingTrack, repeat_mode: 0 }));
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
        <div className="col-span-4 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-5">
            {isPlayerActive ? (
              <>
                <button className="pr-5">
                  <BiSkipPrevious
                    onClick={() => handlePrev()}
                    className="w-8 h-8"
                  />
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
              </>
            ) : (
              <div className="bg-green-500 text-gray-900 px-2 py-1 rounded-full">
                Player not active, you need to be premium user to access
                playback
              </div>
            )}
          </div>
        </div>
        <div className="col-span-2 md:col-span-1 flex gap-4 justify-center items-center">
          <button onClick={() => handleShuffle()}>
            <IoShuffle
              className={`w-6 h-6 ${playingTrack.shuffle && "text-green-500"}`}
            />
          </button>
          {playingTrack.repeat_mode === 0 && (
            <button onClick={() => handleRepeat()}>
              <TbRepeat className="w-5 h-5 text-gray-300" />
            </button>
          )}

          {playingTrack.repeat_mode === 1 && (
            <button onClick={() => handleRepeat()}>
              <TbRepeat className="w-6 h-6 text-green-500" />
            </button>
          )}

          {playingTrack.repeat_mode === 2 && (
            <button onClick={() => handleRepeat()}>
              <TbRepeatOnce
                className="w-6 h-6 
                 text-green-500"
              />
            </button>
          )}
          <div className="relative z-10">
            <button onClick={() => getDevices()}>
              <BiDevices className="w-5 h-5" />
            </button>
            {openDevices && (
              <div className="bg-[#1d1d1d] absolute bottom-10 p-2 rounded-md gap-2 right-0 flex flex-col w-40">
                {devices.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => handleTransferPlayback(item.id)}
                  >
                    <p
                      className={`p-2 rounded-md bg-[#111111] ${
                        item.is_active && "text-green-500"
                      }`}
                    >
                      {item.name}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {play && floatingPlaying}
    </div>
  );
};

export default Player;
