"use client";
import PublicProfile from "@/components/profile/PublicProfile";
import { useParams } from "next/navigation";

export default function PublicProfilePage() {
  const params = useParams();
  const { ownerId } = params as { ownerId: string };
  return <PublicProfile ownerId={ownerId} />;
}
