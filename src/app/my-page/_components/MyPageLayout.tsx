"use client";
import Image from "next/image";
import React from "react";

const MyPageLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <div className="flex items-center justify-between pt-7">
          <h1 className="text-3xl font-bold">oneieo&apos;s paper</h1>
          <Image
            src={"/images/checkmark.png"}
            alt="checkmark"
            width={45}
            height={45}
            className="cursor-pointer bg-black"
          />
        </div>
        <div className="w-[80rem] h-px bg-[#000000] my-7" />
      </div>
    </div>
  );
};

export default MyPageLayout;
