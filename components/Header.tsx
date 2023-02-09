import {
  ChevronDownIcon,
  ChevronLeftIcon,
  LightningBoltIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { totalmem } from "os";
import React, { FunctionComponent, useState, useEffect } from "react";
import useSpotify from "../hooks/useSpotify";
import { RiMenu5Line } from "react-icons/ri";

type HeaderProps = {
  title?: string;
  setOpenSidebar?: any;
};

const Header: FunctionComponent<HeaderProps> = ({ title, setOpenSidebar }) => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState("");
  const history = useRouter();

  useEffect(() => {
    spotifyApi.getMe().then(function (data: any) {
      setUser(data.body.product);
    });
  }, [user]);

  const goBack = () => {
    history.back();
  };

  const goForward = () => {
    history.forward();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("playlist");
    signOut();
  };

  return (
    <header className="flex justify-between p-10 sticky top-0 select-none">
      <div className="hidden md:flex gap-2 items-center">
        <button onClick={goBack}>
          <ChevronLeftIcon
            color="#303030"
            className="w-8 h-8 bg-white rounded-full p-1 hover:bg-[#dadada]"
          />
        </button>
        <button onClick={goForward} disabled>
          <ChevronLeftIcon
            color="#303030"
            className="w-8 h-8 bg-[#B3B3B3] rounded-full p-1 transform rotate-180 hover:bg-[#dadada] hover:cursor-not-allowed"
          />
        </button>
        <div className="font-semibold text-white ml-8 text-base">
          <h1>{title}</h1>
        </div>
      </div>
      <div className="md:hidden pr-4 flex items-center">
        <Image
          src="/assets/images/logo_spotify.png"
          alt="logo_spotify"
          height="42"
          width="135"
        />
      </div>
      <div className="flex gap-3 items-center">
        <button className={`${user === "premium" && "hidden"}`}>
          <LightningBoltIcon
            color="white"
            className="w-8 h-8 bg-[#252525] rounded-full p-1 cursor-pointer hover:bg-[#1f1f1f]"
          />
        </button>
        {session && (
          <div className="relative">
            <div
              className="flex items-center bg-[#252525] min-w-[150px] py-1 pl-1 pr-2 rounded-full cursor-pointer hover:bg-[#1f1f1f]"
              onClick={() => toggleMenu()}
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-500 mr-2">
                <img
                  src={session?.user?.image!}
                  className="object-cover"
                  alt=""
                />
              </div>
              <p className="text-white font-semibold text-sm mr-1 truncate ...">
                {session?.user?.name}
              </p>
              <ChevronDownIcon color="white" className="w-5 h-5" />
            </div>
            <div
              className={`bg-[#252525] p-2 w-full flex justify-center items-center rounded-full absolute transition duration-100 ease-in ${
                menuOpen
                  ? "rounded-md -bottom-10"
                  : "opacity-0 -z-50 bottom-0 right-0"
              }`}
            >
              <button onClick={() => handleSignOut()}>Logout</button>
            </div>
          </div>
        )}
        <button onClick={() => setOpenSidebar(true)} className="md:hidden">
          <RiMenu5Line className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  );
};

export default Header;
