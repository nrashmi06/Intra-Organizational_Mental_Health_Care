import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NotificationWrapper from "@/components/notification/notificationWrapper";
import NotificationPopup from "@/components/notification/NotificationPopup";


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NotificationWrapper>
          <NotificationPopup />
          <Component {...pageProps} />
        </NotificationWrapper>
      </PersistGate>
    </Provider>
  );
}