import { MainNav }    from "@/components/nav/main-nav";
import { AppSidebar } from "@/components/nav/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
        <AppSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
