import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import HomePage from "../components/HomePage";
import KeyGen from "../components/KeyGen";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Nostr Vanity Key Gen</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <KeyGen styles={styles} />
      {/* <main className={styles.main}>
        <div>
          <HomePage />
        </div>
      </main> */}
    </>
  );
}
