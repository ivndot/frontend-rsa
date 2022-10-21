import React from "react";
import { Ring } from "@uiball/loaders";

function Loader({ label }) {
  return (
    <>
      <span>{`${label} `}</span>
      <Ring size={40} lineWeight={5} speed={2} color="white" />
    </>
  );
}

export default Loader;
