import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileEditor from "../_components/ProfileEditor";

export default async function ProfileAdmin() {
  if (!await getCurrentAdmin()) redirect("/admin/login");
  return <ProfileEditor />;
}
