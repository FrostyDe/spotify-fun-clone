import React, { useEffect, useState } from "react";
import { getProviders, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Bars } from "react-loader-spinner";

const Login = () => {
  const [providers, setProviders] = useState<object | string | null>("");
  const { data: session } = useSession();
  const history = useRouter();

  useEffect(() => {
    if (session) {
      history.push("/");
    }
  }, [session]);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  if (session) {
    return (
      <div className="bg-[#252525] min-h-screen flex flex-col items-center justify-center gap-6 font-poppins">
        <Bars
          height="40"
          width="40"
          color="#4fa94d"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#252525] min-h-screen flex flex-col items-center justify-center gap-6 font-poppins">
      <Image
        src="/assets/images/logo_spotify.png"
        alt="logo_spotify"
        height="42"
        width="135"
      />
      {providers &&
        Object.values(providers).map<JSX.Element>((provider: any) => (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="bg-white text-green-600 py-3 px-5 rounded-full font-semibold"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </div>
  );
};

export default Login;
