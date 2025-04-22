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
import Head from 'next/head';
import '@/styles/navbar.css';
import '@/styles/globals.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [loading, setLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>(null);
  const showLoaderTimeoutRef = useRef<NodeJS.Timeout>(null);
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);
  const isDashboardRoute = router.pathname.includes("/dashboard");
  const isProfilePage = router.pathname.includes("/profile");

  // Force light mode on mount and prevent system dark mode
  useEffect(() => {
    // Remove any dark mode classes that might be added by the system
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    
    // Prevent system dark mode from taking effect
    const meta = document.createElement('meta');
    meta.name = 'color-scheme';
    meta.content = 'light only';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    const handleStart = (url: string) => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (showLoaderTimeoutRef.current) clearTimeout(showLoaderTimeoutRef.current);

      if (url !== router.asPath) {
        showLoaderTimeoutRef.current = setTimeout(() => {
          setLoading(true);
        }, 300);

        loadingTimeoutRef.current = setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    };

    const handleComplete = () => {
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
    <>
      <Head>
        <meta name="color-scheme" content="light only" />
        {/* Force light mode at the browser level */}
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {loading && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-200 bg-white text-black"
              style={{
                backgroundColor: isDashboardRoute || isProfilePage ? 'transparent' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: isDashboardRoute || isProfilePage ? 'none' : 'blur(4px)'
              }}
            >
              {(isDashboardRoute || isProfilePage) ? <DashboardLoader /> : <Loading />}
            </div>
          )}
          <div className={`${loading ? "pointer-events-none" : ""} bg-white text-black`}>
            <HeartbeatWrapper>
              <NotificationWrapper>
                <NotificationPopup />
                {getLayout(<Component {...pageProps} />)}
              </NotificationWrapper>
            </HeartbeatWrapper>
          </div>
        </PersistGate>
      </Provider>
    </>
  );
}