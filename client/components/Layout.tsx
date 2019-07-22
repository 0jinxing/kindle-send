import React, { ReactChildren } from "react";

export type LayoutProps = {
  children: ReactChildren;
};

const Layout = (props: LayoutProps) => {
  const { children } = props;
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
