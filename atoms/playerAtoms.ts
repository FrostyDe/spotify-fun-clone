import { atom } from "recoil";

export interface Playing {
  uri?: string;
  albumUrl?: string;
  title?: string;
  artist?: string;
  id?: any;
  album_type?: any;
  repeat_mode?: number;
  shuffle?: boolean;
}

export const playState = atom({
  key: "playState",
  default: false,
});

export const playingTrackState = atom({
  key: "playingTrackState",
  default: {} as Playing,
});