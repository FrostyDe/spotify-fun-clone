import { HeartIcon } from "@heroicons/react/outline";
import { PauseIcon, PlayIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import React, { FunctionComponent, useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playState, playingTrackState } from "../atoms/playerAtoms";

type HomeProps = {
  topTracks: any;
  setTopTracks: any;
  recommendations: any;
  setRecommendations: any;
  chooseTrack?: any;
};

const Default: FunctionComponent<HomeProps> = ({
  topTracks,
  setTopTracks,
  recommendations,
  setRecommendations,
  chooseTrack,
}) => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [play, setPlay] = useRecoilState(playState);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);

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
        context_uri: item.album_context,
        offset: {
          position: item.track_offset - 1,
        },
      });
      setPlay(true);
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyTopTracks().then(
        function (data: any) {
          setTopTracks(
            data.body.items.map((item: any) => {
              return {
                id: item.id,
                artist: item.artists[0].name,
                title: item.name,
                album_type: item.name,
                album_context: item.album.uri,
                track_offset: item.track_number,
                uri: item.uri,
                albumUrl: item.album.images[0].url,
              };
            })
          );
        },
        function (err: any) {
          console.log("Something went wrong!", err);
        }
      );
      spotifyApi
        .getRecommendations({
          min_energy: 0.4,
          seed_artists: ["4hUmsYcvD8C5zuVSP93jb1", "0W8WpLB5WoXLgiA193LXk6"],
          min_popularity: 50,
        })
        .then(
          (data: any) => {
            setRecommendations(
              data.body.tracks.map((track: any) => {
                return {
                  id: track.id,
                  artist: track.artists[0].name,
                  title: track.name,
                  album: track.album.name,
                  duration: track.duration_ms,
                  uri: track.uri,
                  albumUrl: track.album.images[0].url,
                  popularity: track.popularity,
                  album_context: track.album.uri,
                  track_offset: track.track_number,
                };
              })
            );
          },
          function (err: any) {
            console.log("Something went wrong!", err);
          }
        );
    }
  }, [session, spotifyApi]);

  const newReleasesCard = topTracks.map((item: any) => {
    return (
      <div
        key={item.id}
        className="max-h-[115px] p-5 flex justify-between items-center rounded-lg bg-[#252525] relative group/item"
      >
        <div className="flex gap-5 items-center">
          <div className="w-[80px] rounded-md overflow-hidden">
            <img src={item.albumUrl} className="object-cover" alt="" />
          </div>
          <div>
            <h1 className="font-semibold mb-3">{item.title}</h1>
            <p className="font-light">{item.artist}</p>
          </div>
        </div>
        <div className="flex items-center absolute gap-2 transform duration-500 ease-in-out right-2 opacity-0 group-hover/item:opacity-100 group-hover/item:-translate-x-2">
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
    );
  });

  const recommendationsCard = recommendations.map((item: any) => {
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
        className="max-h-[115px] p-5 flex justify-between items-center rounded-lg bg-[#252525] relative group/item"
      >
        <div className="flex gap-5 items-center">
          <div className="w-[80px] rounded-md overflow-hidden">
            <img src={item.albumUrl} className="object-cover" alt="" />
          </div>
          <div>
            <h1 className="font-semibold mb-3">{item.title}</h1>
            <p className="font-light mb-3">{item.artist}</p>
            <p className="font-light">{duration}</p>
          </div>
        </div>
        <div className="flex items-center absolute gap-2 transform duration-500 ease-in-out right-2 opacity-0 group-hover/item:opacity-100 group-hover/item:-translate-x-2">
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
    );
  });

  return (
    <div className="px-10 pb-10 h-[calc(100vh_-_11rem)] overflow-scroll scrollbar-hide scroll-smooth">
      {topTracks.length !== 0 && (
        <section className="flex flex-col">
          <h1 className="font-semibold text-base">Top Music For You</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 my-4 gap-5">
            {newReleasesCard}
          </div>
        </section>
      )}
      <section className="flex flex-col py-5">
        <h1 className="font-semibold text-base">Recommendations</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 my-4 gap-5">
          {recommendationsCard}
        </div>
      </section>
    </div>
  );
};

export default Default;
