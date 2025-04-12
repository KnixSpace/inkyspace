"use client";

import SpaceView from "@/components/space/SpaceView";
import { useParams } from "next/navigation";

export default function SpaceViewPage() {
  const params = useParams();
  const { spaceId } = params;
  return <SpaceView spaceId={spaceId as string} />;
}
