import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
