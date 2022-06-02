import React from "react";

export const Waves = () => {
  return (
    <div>
      <div>
        <img
          style={{ animationDelay: "5s" }}
          className="wave"
          alt=""
          src="/assets/svg/wave5.svg"
        />
        <img
          style={{ animationDelay: "4s" }}
          className="wave"
          alt=""
          src="/assets/svg/wave4.svg"
        />
        <img
          style={{ animationDelay: "3s" }}
          className="wave"
          alt=""
          src="/assets/svg/wave3.svg"
        />
        <img
          style={{ animationDelay: "2s" }}
          className="wave"
          alt=""
          src="/assets/svg/wave2.svg"
        />
        <img
          style={{ animationDelay: "1s" }}
          className="wave"
          alt=""
          src="/assets/svg/wave1.svg"
        />
      </div>
    </div>
  );
};
