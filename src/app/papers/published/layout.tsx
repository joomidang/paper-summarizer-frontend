import React from "react";
import PublishedLayout from "./_components/PublishedLayout";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <PublishedLayout />
      {children}
    </>
  );
};

export default layout;
