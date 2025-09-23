import Navbar from "@/components/layout/Navbar";
import { Sidebar } from "lucide-react";
export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* You can add unique layout elements here, e.g., sidebars, event-specific header */}
      <Navbar />
      {children}
    </div>
  );
}
