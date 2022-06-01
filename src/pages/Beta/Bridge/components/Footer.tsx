import React from "react";

const Footer = () => {
  return (
    <footer className="footer p-6 bg-neutral text-neutral-content">
      <div className="w-64 flex flex-col items-center">
        <img src="/ic-squid.svg" width={32} height={32} alt="footer" />
        <p className="text-center">
          Send token to any chain, any token without a mess.
        </p>
      </div>
      <div>
        <span className="footer-title">Services</span>
        <a className="link link-hover">Satellite</a>
        <a className="link link-hover">Explorer</a>
      </div>
      <div>
        <span className="footer-title">Company</span>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;
