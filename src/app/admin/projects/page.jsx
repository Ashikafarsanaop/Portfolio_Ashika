import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProjectsManager from "../_components/ProjectsManager";

export default async function ProjectsAdmin() {
  if (!await getCurrentAdmin()) redirect("/admin/login");
  return <ProjectsManager />;
}
