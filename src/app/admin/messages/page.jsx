import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import MessagesManager from "../_components/MessagesManager";

export default async function MessagesAdmin() {
  if (!await getCurrentAdmin()) redirect("/admin/login");
  return <MessagesManager />;
}
