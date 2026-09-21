import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResourceManager from "../_components/ResourceManager";

export default async function ResumeAdmin() {
  if (!await getCurrentAdmin()) redirect("/admin/login");
  return <ResourceManager resource="resume" />;
}
