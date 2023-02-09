import React, { useEffect, useState } from "react";
import { PlayIcon } from "@heroicons/react/solid";
import { UilEllipsisH } from "@iconscout/react-unicons";
import { useRouter } from "next/router";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playState, playingTrackState } from "../atoms/playerAtoms";

type PlaylistProps = {
  session: any;
};

const Playlist: React.FunctionComponent<PlaylistProps> = ({ session }) => {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const playlistId = router.asPath.substring(10);
  const [playlistDetail, setPlaylistDetail] = useState<any>(null);
  const [trackList, setTrackList] = useState<any[]>([]);
  const [play, setPlay] = useRecoilState(playState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getPlaylist(playlistId).then((data: any) => {
        setPlaylistDetail(data.body);
        setTrackList(data.body.tracks.items);
      }),
        (err: any) => {
          console.log(err);
        };
      spotifyApi.getMe();
    }
  }, [session, spotifyApi, playlistId]);

  function padTo2Digits(num: any) {
    return num.toString().padStart(2, "0");
  }

  const timeMs = trackList.reduce((a, b) => a + b.track.duration_ms, 0);

  const totalTime =
    padTo2Digits(Math.floor((timeMs / 1000 / 60) << 0)) +
    ":" +
    padTo2Digits(Math.floor((timeMs / 1000) % 60));

  const handlePlay = (item: any, index: any) => {
    spotifyApi.play({
      //   uris: [item.uri],
      context_uri: playlistDetail.uri,
      offset: {
        position: index,
      },
    });
  };

  const handleMainPlay = () => {
    spotifyApi
      .play({
        //   uris: [item.uri],
        context_uri: playlistDetail.uri,
        offset: {
          position: 0,
        },
      })
      .then(() => {
        setPlay(true);
      });
  };

  const playlistTrack = trackList.map((item: any, index) => {
    const duration =
      padTo2Digits(Math.floor((item.track.duration_ms / 1000 / 60) << 0)) +
      ":" +
      padTo2Digits(Math.floor((item.track.duration_ms / 1000) % 60));

    return (
      <div
        key={item.track.id}
        onClick={() => handlePlay(item.track, index)}
        className="text-white grid grid-cols-6 gap-2 p-2 items-center cursor-pointer hover:bg-[#111111]"
      >
        <div className="flex gap-2 md:gap-6 items-center col-span-1">
          <p>{index + 1}</p>
          <div className="w-8 h-8 md:w-16 md:h-16 rounded-md overflow-hidden flex items-center justify-center">
            <img
              src={item.track.album.images[2].url}
              className="object-cover"
              alt=""
            />
          </div>
        </div>

        <div className="font-light col-span-4 md:col-span-3 flex flex-col gap-1">
          <p className="font-semibold text-sm md:text-base">
            {item.track.name}
          </p>
          <p className="max-w-300px text-gray-300 text-sm md:text-base truncate ...">
            {item.track.artists
              .map(function (item: any) {
                return item.name;
              })
              .join(", ")}
          </p>
        </div>
        <p className="hidden md:block col-span-1">{item.track.album.name}</p>
        <p className="col-span-1">{duration}</p>
      </div>
    );
  });

  return (
    <div className="flex flex-col max-h-screen overflow-y-hidden">
      <section className="flex flex-col md:flex-row items-center gap-3 md:gap-0 md:items-end md:justify-between px-10 pt-0 pb-0 md:pb-10">
        <div className="flex flex-col md:flex-row gap-5 md:gap-14 items-start md:items-end">
          {/* Playlist Cover */}
          <div className="w-[8rem] object-cover md:w-[18rem] rounded-lg md:rounded-xl overflow-hidden bg-[#D9D9D9]">
            <img src={playlistDetail?.images[0]?.url} className="" alt="" />
          </div>
          {/* Playlist Desc */}
          <div className="flex flex-col justify-start gap-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-0 md:mb-5">
              {playlistDetail?.name}
            </h1>
            <div className="flex items-center">
              <div className="w-7 rounded-full overflow-hidden bg-slate-500 mr-2">
                <img src={session?.user?.image!} alt="" />
              </div>
              <p className="text-xs md:text-sm font-light">
                <strong className="font-semibold">
                  {playlistDetail?.owner?.display_name}
                </strong>
                - {playlistDetail?.tracks?.items?.length} Songs - {totalTime}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center pb-5 md:pb-0">
          <button onClick={() => handleMainPlay()}>
            <PlayIcon className="w-12 h-12 md:w-20 md:h-20 text-[#43C748] transition ease-in-out hover:scale-110" />
          </button>
          <button>
            <UilEllipsisH className="w-6 h-6" />
          </button>
        </div>
      </section>
      <section className="pt-0 px-10 md:p-10 max-h-[calc(100vh_-_32rem)] overflow-y-scroll scrollbar-hide">
        {playlistTrack}
      </section>
    </div>
  );
};

export default Playlist;
