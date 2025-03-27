"use client";
import { useAppSelector } from "@/redux/hooks";
import React from "react";

type Props = {};

const page = (props: Props) => {
  const selector = useAppSelector((state) => state.user);

  return <div>Explore {selector.user?.name}</div>;
};

export default page;
