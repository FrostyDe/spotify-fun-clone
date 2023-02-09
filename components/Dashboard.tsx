import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Default from "./Default";
import SearchResult from "./SearchResult";
import MyLibrary from "./MyLibrary";
import Playlist from "./Playlist";
import LikedSongs from "./LikedSongs";
import Header from "./Header";
import useSpotify from "../hooks/useSpotify";

type DashboardProps = {
  pages?: string;
  spotifyApi: any;
  searchResult: Array<string>;
  chooseTrack?: any;
  setOpenSidebar: any;
};

const Dashboard: React.FunctionComponent<DashboardProps> = ({
  pages,
  searchResult,
  chooseTrack,
  setOpenSidebar,
}) => {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const { status, data: session } = useSession();
  const [topTracks, setTopTracks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  if (pages === "searchresult") {
    const title = "Search Result";
    return (
      <div className="bg-[#303030] min-h-screen w-full relative text-white">
        <Header title={title} setOpenSidebar={setOpenSidebar} />
        <SearchResult searchResult={searchResult} chooseTrack={chooseTrack} />
      </div>
    );
  }

  if (router.pathname === "/") {
    const title = "Home";
    return (
      <div className="bg-[#303030] min-h-screen w-full relative text-white">
        <Header title={title} setOpenSidebar={setOpenSidebar} />
        <Default
          topTracks={topTracks}
          setTopTracks={setTopTracks}
          recommendations={recommendations}
          setRecommendations={setRecommendations}
          chooseTrack={chooseTrack}
        />
      </div>
    );
  }

  if (router.pathname === "/library") {
    const title = "Your Library";
    return (
      <div className="bg-[#303030] min-h-screen w-full relative text-white">
        <Header title={title} setOpenSidebar={setOpenSidebar} />
        <MyLibrary />
      </div>
    );
  }

  if (router.pathname === "/liked-songs") {
    const title = "Liked Songs";
    return (
      <div className="bg-[#303030] min-h-screen w-full relative text-white">
        <Header title={title} setOpenSidebar={setOpenSidebar} />
        <LikedSongs />
      </div>
    );
  }

  if (router.pathname.includes("/playlist/")) {
    const title = "Playlist";
    return (
      <div className="bg-[#303030] min-h-screen w-full relative text-white">
        <Header title={title} setOpenSidebar={setOpenSidebar} />
        <Playlist session={session} />
      </div>
    );
  }

  return null;
};

export default Dashboard;
