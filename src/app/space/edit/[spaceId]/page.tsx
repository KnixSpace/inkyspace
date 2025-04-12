"use client";
import SpaceEditForm from "@/components/space/SpaceEditForm";
import { useParams } from "next/navigation";

export default function SpaceEditPage() {
  const params = useParams();
  const { spaceId } = params as { spaceId: string };
  return <SpaceEditForm spaceId={spaceId} />;
}
