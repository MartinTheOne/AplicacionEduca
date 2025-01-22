import "@/styles/globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
export default function App({ Component, pageProps }) {
  const [disabled,setDisabled]=useState(false)
  return (
    <MainLayout disabled={disabled}>
      <Component  {...pageProps}  setDisabled={setDisabled}/>
    </MainLayout>

  );
}
