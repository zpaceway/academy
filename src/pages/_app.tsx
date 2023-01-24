import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.scss";
import SignInPage from "./auth/sign-in";
import LoadingScreen from "../components/LoadingScreen";

interface SessionWrapperProps {
  children: React.ReactNode;
}
const SessionWrapper = ({ children }: SessionWrapperProps) => {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (sessionData) {
    return <>{children}</>;
  }

  return <SignInPage />;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <SessionWrapper>
        <Component {...pageProps} />
      </SessionWrapper>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
