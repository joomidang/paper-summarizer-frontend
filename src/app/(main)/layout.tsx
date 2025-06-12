import React from "react";
import HomeLayout from "./_components/HomeLayout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <HomeLayout />
      {children}
    </div>
  );
};

export default layout;
