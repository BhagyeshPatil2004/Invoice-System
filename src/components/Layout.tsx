import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({
  children
}: LayoutProps) {
  return <SidebarProvider>
    <div className="min-h-screen flex w-full relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[30%] w-[30%] h-[30%] rounded-full bg-pink-600/10 blur-[100px]" />
      </div>

      <AppSidebar />

      <main className="flex-1 p-6 animate-fade-in">
        {children}
      </main>
    </div>
  </SidebarProvider>;
}