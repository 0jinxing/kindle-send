import React from "react";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        maxWidth: "360px",
        margin: "auto",
        padding: "0 16px"
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
