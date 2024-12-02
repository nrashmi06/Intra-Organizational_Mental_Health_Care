// src/pages/_app.tsx
import { Provider } from "react-redux";
import { store } from "@/store"; // Adjust the path to your store file.
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
