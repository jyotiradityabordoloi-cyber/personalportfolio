import { redirect } from "next/navigation";
import { site } from "@/content/site";

// /resume forwards to the PDF in public/ (swap the file to update the resume).
export default function ResumePage() {
  redirect(site.links.resume);
}
