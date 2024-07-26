import Head from "next/head";
import { useState } from "react";
// import Form from "../components/form";

import { useSearchParams } from "next/navigation";

import Editor from "../components/webcam/editor";

export default function Customize() {
  const searchParams = useSearchParams();
  const [image, setImage] = useState(searchParams?.get("image"));
  const [cropped, setCropped] = useState(searchParams?.get("image"));

  return (
    <>
      <Head>
        <title>Customize your Recipe</title>
      </Head>
      <div className="font-primary flex h-screen w-full flex-col items-center justify-center gap-12">
        <Editor
          image={image ?? ""}
          setCropped={setCropped}
          setImage={setImage}
        />
      </div>
    </>
  );
}
