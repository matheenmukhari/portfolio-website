import type { Metadata } from "next";
import WorkIndex from "@/components/WorkIndex";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected websites, campaigns, print and event work for premium property brands across the UK, the Gulf and Asia.",
};

export default function WorkPage() {
  return (
    <>
      <WorkIndex />
      <Contact />
    </>
  );
}
