import { atom } from "recoil";

export interface Playing {
  uri?: string;
  albumUrl?: string;
  title?: string;
  artist?: string;
  id?: any;
  album_type?: any;
}

export const playState = atom({
  key: "playState",
  default: false,
});

export const playingTrackState = atom({
  key: "playingTrackState",
  default: {} as Playing,
});

export const savedTrackState = atom({
  key: "savedTrackState",
  default: {} as Playing,
});