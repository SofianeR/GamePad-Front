import React from "react";

import Lottie from "react-lottie";
import * as animationData from "../assets/animations/qFAEZrGiew.json";

const LoadingComponent = () => {
  const optionAnimation = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "100vH",
      }}>
      <Lottie options={optionAnimation} height={500} width={500} />
    </div>
  );
};

export default LoadingComponent;
