import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Dashboard", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Statistics", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar() {
  const { colorTheme } = useColorThemeStore();

  return (
    <Sidebar>
      <SidebarContent className="py-6 px-4">
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn("text-lg font-semibold mb-6", `theme-${colorTheme}`)}
          >
            Jirafy
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "transition-colors",
                      `theme-${colorTheme}`,
                      "hover:bg-opacity-50 hover:bg-primary"
                    )}
                  >
                    <item.icon className="size-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t py-4 px-4">
        <div
          className={cn("text-sm text-muted-foreground", `theme-${colorTheme}`)}
        >
          Jirafy © {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
