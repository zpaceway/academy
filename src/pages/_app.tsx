import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";

import { apiHook } from "../utils/api";

import "../styles/globals.scss";
import SignInPage from "./auth/sign-in";
import LoadingScreen from "../components/LoadingScreen";
import ChaptersContext from "../context/ChaptersContext";
import { useMemo } from "react";
import LessonsMetadataContext from "../context/LessonsMetadataContext";

interface SessionWrapperProps {
  children: React.ReactNode;
}
const SessionWrapper = ({ children }: SessionWrapperProps) => {
  const { data: sessionData, status } = useSession();
  const chaptersQuery = apiHook.chapters.getChapters.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const lessonsMetadataQuery = apiHook.lessons.getLessonsMetadata.useQuery(
    undefined,
    { refetchOnWindowFocus: false }
  );

  const chapters = useMemo(
    () => chaptersQuery.data || [],
    [chaptersQuery.data]
  );

  const lessonsMetadata = useMemo(
    () =>
      lessonsMetadataQuery.data || {
        liked: {},
        saved: {},
        completed: {},
        rated: {},
        count: 0,
        progress: 0,
      },
    [lessonsMetadataQuery.data]
  );

  if (
    status === "loading" ||
    chaptersQuery.isLoading ||
    lessonsMetadataQuery.isLoading
  ) {
    return <LoadingScreen />;
  }

  if (sessionData) {
    return (
      <LessonsMetadataContext.Provider
        value={{
          data: lessonsMetadata,
          refetch: () => lessonsMetadataQuery.refetch(),
        }}
      >
        <ChaptersContext.Provider
          value={{ data: chapters, refetch: () => chaptersQuery.refetch() }}
        >
          {children};
        </ChaptersContext.Provider>
      </LessonsMetadataContext.Provider>
    );
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

export default apiHook.withTRPC(MyApp);
