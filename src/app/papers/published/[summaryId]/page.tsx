"use client";

import React from "react";
import PaperDetail from "../../_components/PaperDetail";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const summaryId = params.summaryId;
  return <PaperDetail summaryId={summaryId as string} />;
};

export default Page;
