import React from "react";
import logoImg from "../assets/logo.png";

const Header = () => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        marginBottom: "16px"
      }}
    >
      <img
        src={logoImg}
        alt="logo"
        style={{
          width: "100px"
        }}
      />
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "normal",
          display: "flex",
          flexDirection: "column"
        }}
      >
        给 Kindle，发邮件
        <span
          style={{
            fontSize: "14px",
            color: "#666",
            marginTop: "4px"
          }}
        >
          快捷的 kindle 邮件推送工具
        </span>
      </h1>
    </header>
  );
};

export default Header;
