import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NotificationWrapper from "@/components/notification/notificationWrapper";
import NotificationPopup from "@/components/notification/NotificationPopup";
import Loading from "@/components/ui/loading";
import DashboardLoader from "@/components/ui/dashboardLoader";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  // Check if current route is a dashboard route
  const isDashboardRoute = router.pathname.includes("/dashboard");

  useEffect(() => {
    const handleStart = (url: string) => {
      // Only show loader if navigating to a different path
      if (url !== router.asPath) {
        setLoading(true);
      }
    };

    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {loading && (
          <div
            className={
              isDashboardRoute
                ? ""
                : "fixed inset-0 z-50 flex items-center justify-center bg-white/80"
            }
          >
            {isDashboardRoute ? <DashboardLoader /> : <Loading />}
          </div>
        )}
        <NotificationWrapper>
          <NotificationPopup />
          {getLayout(<Component {...pageProps} />)}
        </NotificationWrapper>
      </PersistGate>
    </Provider>
  );
}
