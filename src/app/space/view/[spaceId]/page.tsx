"use client";

import SpaceView from "@/components/space/SpaceView";
import { useParams } from "next/navigation";

export default function SpaceViewPage() {
  const params = useParams();
  const { spaceId } = params as { spaceId: string };
  return <SpaceView spaceId={spaceId} />;
}
