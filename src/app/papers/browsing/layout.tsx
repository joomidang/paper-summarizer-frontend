import React from "react";
import BrowsingLayout from "./_components/BrowsingLayout";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <BrowsingLayout />
      {children}
    </>
  );
};

export default layout;
