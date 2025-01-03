import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import type { AppProps } from "next/app";
import NotificationWrapper from "@/components/notification/notificationWrapper";
import HeartbeatWrapper from "@/components/heartBeat/heartBeatWrapper";
import NotificationPopup from "@/components/notification/NotificationPopup";
import Loading from "@/components/ui/loading";
import DashboardLoader from "@/components/ui/dashboardLoader";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import '@/styles/navbar.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [loading, setLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const showLoaderTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);
  const isDashboardRoute = router.pathname.includes("/dashboard");
  const isProfilePage = router.pathname.includes("/profile");

  useEffect(() => {
    const handleStart = (url: string) => {
      // Clear any existing timeouts
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (showLoaderTimeoutRef.current) clearTimeout(showLoaderTimeoutRef.current);

      // Only show loader if navigating to a different path
      if (url !== router.asPath) {
        // Only show loader if loading takes more than 300ms
        showLoaderTimeoutRef.current = setTimeout(() => {
          setLoading(true);
        }, 300);

        // Safety timeout to remove loader after 5 seconds
        loadingTimeoutRef.current = setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    };

    const handleComplete = () => {
      // Clear all timeouts
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (showLoaderTimeoutRef.current) clearTimeout(showLoaderTimeoutRef.current);
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (showLoaderTimeoutRef.current) clearTimeout(showLoaderTimeoutRef.current);
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
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-200 ${
              (isDashboardRoute || isProfilePage) ? "bg-transparent" : "bg-white/80 backdrop-blur-sm"
            }`}
          >
            {(isDashboardRoute || isProfilePage) ? <DashboardLoader /> : <Loading />}
          </div>
        )}
        <div className={loading ? "pointer-events-none" : ""}>
          <HeartbeatWrapper >
          <NotificationWrapper>
            <NotificationPopup />
            {getLayout(<Component {...pageProps} />)}
          </NotificationWrapper>
          </HeartbeatWrapper>
        </div>
      </PersistGate>
    </Provider>
  );
}