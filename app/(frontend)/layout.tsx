import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
      <Toaster richColors position="top-right" />
    </>
  );
}
