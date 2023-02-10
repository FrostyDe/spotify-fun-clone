declare module "@iconscout/react-unicons";
declare module "next/server";
declare module "next";
declare module "next/router";
declare module "lodash";

interface Window {
  onSpotifyWebPlaybackSDKReady(): void;
  Spotify: typeof Spotify;
}
