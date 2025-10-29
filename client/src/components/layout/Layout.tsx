import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { useSessionCheck } from "@/hooks/useSessionCheck";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useSessionCheck();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="w-full flex-1 overflow-auto">
          <Header className="w-full top-0 z-10" />
          <main className="w-full flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
