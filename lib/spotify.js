var SpotifyWebApi = require("spotify-web-api-node");

const LOGIN_URL =
  "https://accounts.spotify.com/authorize?scope=user-read-playback-state,user-modify-playback-state,user-read-currently-playing,user-read-email,playlist-read-private,playlist-read-collaborative,user-read-email,user-read-private,app-remote-control,streaming,user-read-private,user-library-read,user-top-read,user-read-recently-played,user-follow-read";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export default spotifyApi;

export { LOGIN_URL };
