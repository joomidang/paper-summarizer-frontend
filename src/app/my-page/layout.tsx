import React from "react";
import MyPageLayout from "./_components/MyPageLayout";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <MyPageLayout />
      {children}
    </>
  );
};

export default layout;
