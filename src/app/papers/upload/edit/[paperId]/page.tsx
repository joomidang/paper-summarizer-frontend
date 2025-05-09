"use client";

import PaperEdit from "@/app/papers/_components/PaperEdit";
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const paperId = params.paperId;

  return <PaperEdit summaryId={paperId as string} />;
};

export default Page;
