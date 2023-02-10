import React, { FunctionComponent, useState, useEffect } from "react";
import { UilEllipsisH } from "@iconscout/react-unicons";
import { HeartIcon } from "@heroicons/react/outline";
import { PauseIcon, PlayIcon } from "@heroicons/react/solid";
import { useRecoilState } from "recoil";
import { playState, playingTrackState } from "../atoms/playerAtoms";
import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";

type SearchResultProps = {
  searchResult?: any;
  chooseTrack: any;
};
const SearchResult: FunctionComponent<SearchResultProps> = ({
  searchResult,
  chooseTrack,
}) => {
  const spotifyApi = useSpotify();
  const [play, setPlay] = useRecoilState(playState);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);

  const handleSaveToLibrary = (item: any) => {
    spotifyApi.addToMySavedTracks([item.id]).then(
      (data: any) => {
        console.log("Added track!");
      },
      () => {
        console.log("Something went wrong!");
      }
    );
  };

  const handlePlay = (item: any) => {
    setPlayingTrack(item);

    if (item.uri === playingTrack.uri) {
      spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
        if (data.body.is_playing) {
          spotifyApi.pause();
          setPlay(false);
        } else {
          spotifyApi.play();
          setPlay(true);
        }
      });
    } else {
      spotifyApi.play({
        uris: [item.uri],
      });
      setPlay(true);
    }
  };

  const card = searchResult.map((item: any) => {
    function padTo2Digits(num: any) {
      return num.toString().padStart(2, "0");
    }

    const duration =
      padTo2Digits(Math.floor((item.duration / 1000 / 60) << 0)) +
      ":" +
      padTo2Digits(Math.floor((item.duration / 1000) % 60));

    return (
      <div
        key={item.id}
        className="relative flex-grow max-md:h-[200px] max-md:w-[200px] md:h-[299px]  md:min-w-[193px] max-w-[205px] rounded-[30px] bg-slate-600 overflow-hidden transform duration-100 ease-in-out group/item"
      >
        <img src={item.albumUrl} className="object-cover h-[299px]" alt="" />
        <div className="flex flex-col gap-2 p-3 h-[120px] w-full bg-[#252525]/50 md:bg-[#252525]/70 hover:backdrop-blur-sm md:backdrop-blur-sm absolute bottom-0">
          <div className="flex items-center justify-between">
            <div className="max-w-[150px]">
              <p className="font-semibold truncate hover:text-clip">
                {item.title}
              </p>
            </div>

            <button>
              <UilEllipsisH className="w-6 h-6" />
            </button>
          </div>
          <div>
            <p className="font-light pb-1">{item.artist}</p>
            <p className="font-light">{duration}</p>
          </div>
          <div className="flex items-center absolute gap-2 transform duration-500 -bottom-14 ease-in-out right-2 opacity-0 group-hover/item:opacity-100 group-hover/item:-translate-y-16">
            <button>
              <HeartIcon className="h-5 w-5" />
            </button>
            {item.uri === playingTrack.uri && play ? (
              <button onClick={() => handlePlay(item)}>
                <PauseIcon className="h-12 w-12 text-green-500 transform duration-100 ease-in-out hover:scale-105" />
              </button>
            ) : (
              <button onClick={() => handlePlay(item)}>
                <PlayIcon className="h-12 w-12 text-green-500 transform duration-100 ease-in-out hover:scale-105" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <section className="flex max-md:justify-center justify-between flex-wrap gap-5 md:gap-10 px-10 pb-10 h-[calc(100vh_-_14rem)] overflow-scroll scrollbar-hide scroll-smooth">
        {card}
      </section>
    </>
  );
};

export default SearchResult;
