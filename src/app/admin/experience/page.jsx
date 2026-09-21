import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExperienceManager from "../_components/ExperienceManager";

export default async function ExperienceAdmin() {
  if (!await getCurrentAdmin()) redirect("/admin/login");
  return <ExperienceManager />;
}
