import { MainNav } from "@/components/nav/main-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNav />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}
