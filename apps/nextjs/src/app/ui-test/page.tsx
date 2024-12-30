"use client";

import { useEffect, useState } from "react";

import { SpinText } from "../_components/spin-text";

export default function Page() {
  const [textNumber, setTextNumber] = useState(0);
  const texts = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "Cillum adipisicing qui esse occaecat eu deserunt. Culpa adipisicing cupidatat culpa sint labore esse. ",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setTextNumber(textNumber >= texts.length - 1 ? 0 : textNumber + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [textNumber]);

  // return (
  //   <div className="flex h-full w-full items-center justify-center">
  //     <SpinText text={texts[5]} />
  //   </div>
  // );

  return (
    <div className="flex h-full w-full items-center justify-start">
      <div className="flex items-center gap-1">
        Hello there, Im{" "}
        <SpinText className="justify-start">{texts[textNumber]}</SpinText>
      </div>
    </div>
  );
}
