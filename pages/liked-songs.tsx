import { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Bars } from "react-loader-spinner";

import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import useSpotify from "../hooks/useSpotify";
import { useRouter } from "next/router";
import Player from "../components/Player";

const LikedSongsPage = () => {
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [pages, setPages] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      if (!search) {
        setPages("");
        setSearchResult([]);
      } else {
        setPages("searchresult");
        spotifyApi.searchTracks(search).then((data: any) => {
          setSearchResult(
            data.body.tracks.items.map((track: any) => {
              return {
                id: track.id,
                artist: track.artists[0].name,
                title: track.name,
                album: track.album.name,
                duration: track.duration_ms,
                uri: track.uri,
                albumUrl: track.album.images[0].url,
                popularity: track.popularity,
              };
            })
          );
        }),
          (err: any) => {
            console.log(err);
          };
      }
    }
  }, [session, spotifyApi, search]);

  if (status === "loading") {
    return (
      <div className="bg-[#252525] min-h-screen flex flex-col items-center justify-center gap-6 font-poppins">
        <Bars
          height="40"
          width="40"
          color="#4fa94d"
          ariaLabel="bars-loading"
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-poppins text-sm antialiased">
      <Head>
        <title>Spotify Fun Clone - Dwiki</title>
      </Head>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet"
      />

      <main className="grid grid-cols-12 w-full">
        <div className="hidden md:block md:col-span-3 xl:col-span-2">
          <Sidebar
            setPages={setPages}
            pages={pages}
            search={search}
            setSearch={setSearch}
            setOpenSidebar={setOpenSidebar}
          />
        </div>
        <div className="col-span-12 md:col-span-9 xl:col-span-10 relative">
          <div
            className={`${
              openSidebar ? "translate-x-full" : ""
            } absolute z-10 w-full right-full transform duration-150 ease-in-out md:hidden md:col-span-2 lg:col-span-2`}
          >
            <Sidebar
              setPages={setPages}
              pages={pages}
              search={search}
              setSearch={setSearch}
              setOpenSidebar={setOpenSidebar}
            />
          </div>
          <Dashboard
            setOpenSidebar={setOpenSidebar}
            pages={pages}
            searchResult={searchResult}
            spotifyApi={useSpotify}
          />
        </div>
      </main>
      <Player />
    </div>
  );
};

export default LikedSongsPage;
