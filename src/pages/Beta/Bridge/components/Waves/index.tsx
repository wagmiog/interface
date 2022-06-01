import React from "react";

export const Waves = () => {
  return (
    <div className="fixed left-0 w-full h-[300px] bottom-[-100px] lg:h-[500px] lg:bottom-[-300px]">
      <div className="relative w-full h-full">
        <img
          style={{ animationDelay: "5s" }}
          className="wave"
          src="/assets/svg/wave5.svg"
        />
        <img
          style={{ animationDelay: "4s" }}
          className="wave"
          src="/assets/svg/wave4.svg"
        />
        <img
          style={{ animationDelay: "3s" }}
          className="wave"
          src="/assets/svg/wave3.svg"
        />
        <img
          style={{ animationDelay: "2s" }}
          className="wave"
          src="/assets/svg/wave2.svg"
        />
        <img
          style={{ animationDelay: "1s" }}
          className="wave"
          src="/assets/svg/wave1.svg"
        />
      </div>
    </div>
  );
};
