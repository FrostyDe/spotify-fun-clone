import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { useRouter } from "next/router";

import Player from "../components/Player";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
        {router.pathname !== "/login" && <Player />}
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
