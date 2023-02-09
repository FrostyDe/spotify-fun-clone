import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HomeIcon, HeartIcon, PlusIcon } from "@heroicons/react/outline";
import { BiLibrary } from "react-icons/bi";
import { signOut, useSession } from "next-auth/react";
import Search from "./Search";
import useSpotify from "../hooks/useSpotify";
import { useRouter } from "next/router";
import { IoCloseOutline } from "react-icons/io5";

type SidebarProps = {
  setPages: any;
  setOpenSidebar: any;
  search: string;
  pages: string;
  setSearch(e: any): void;
};

const Sidebar: React.FunctionComponent<SidebarProps> = ({
  setPages,
  pages,
  search,
  setSearch,
  setOpenSidebar,
}) => {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const path = router.asPath;
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem("playlist")!)
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && playlists === null) {
      spotifyApi.getUserPlaylists().then((data: any) => {
        setPlaylists(data.body.items);
        localStorage.setItem("playlist", JSON.stringify(data.body.items));
      }),
        (err: any) => {
          console.log("Error fetching playlist", err);
        };
    }
  }, [session, spotifyApi, playlists]);

  const routePage = (page: any) => {
    router.push(page, undefined, { shallow: true });
  };

  const handleSignOut = () => {
    localStorage.removeItem("playlist");
    signOut();
  };

  const menus = (
    <div className="flex flex-col py-2">
      <h1 className="font-semibold text-sm mb-5">Menu</h1>
      <div className="flex flex-col justify-start gap-4 text-sm font-light">
        <button
          className={`flex gap-2 items-center hover:text-white ${
            path === "/" ? "font-bold text-white" : "text-[#C5C5C5]"
          }`}
          onClick={() => {
            routePage("/");
            setPages("");
          }}
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </button>
        <button
          className={`flex gap-2 items-center hover:text-white ${
            path === "/library" ? "font-bold text-white" : "text-[#C5C5C5]"
          }`}
          onClick={() => {
            routePage("/library");
            setPages("");
          }}
        >
          <BiLibrary className="h-5 w-5" />
          <span>Your Library</span>
        </button>
        <button
          className={`flex gap-2 items-center hover:text-white ${
            path === "/liked-songs" ? "font-bold text-white" : "text-[#C5C5C5]"
          }`}
          onClick={() => {
            routePage("/liked-songs");
            setPages("");
          }}
        >
          <HeartIcon className="h-5 w-5" />
          <span>Liked Songs</span>
        </button>
      </div>
    </div>
  );

  const playlist = (
    <div className="flex flex-col justify-start py-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-sm text-white mt-4 mb-4">Playlist</h1>
        <button className="cursor-pointer">
          <PlusIcon className="w-4 h-4 text-[#C5C5C5] hover:text-[#43C748]" />
        </button>
      </div>

      <div className="flex flex-col gap-3 justify-start h-[calc(100vh_-_27rem)] overflow-y-scroll scrollbar-hide font-light">
        {playlists?.map((pl: any) => (
          <div
            className={`cursor-pointer text-sm hover:text-white ${
              path === `/playlist/${pl?.id}` ? "text-white" : "text-[#c5c5c5]"
            }`}
            onClick={() => {
              routePage(`/playlist/${pl?.id}`);
              setPages("");
            }}
            key={pl?.id}
          >
            {pl?.name}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#111111] relative min-w-[230px] text-white h-screen px-10 xl:p-14 pt-10 pb-0 flex flex-col gap-2 justify-between overflow-hidden">
      <div>
        <div className="flex justify-between items-center">
          <Image
            src="/assets/images/logo_spotify.png"
            alt="logo_spotify"
            height="42"
            width="135"
          />
          <IoCloseOutline
            className="w-7 h-7 md:hidden"
            onClick={() => setOpenSidebar(false)}
          />
        </div>

        <Search search={search} setSearch={setSearch} />
        {menus}
        {playlist}
      </div>
    </div>
  );
};

export default Sidebar;
