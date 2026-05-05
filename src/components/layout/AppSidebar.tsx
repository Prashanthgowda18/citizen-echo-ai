import {
  LayoutDashboard, FileText, MessageSquare, Send, BarChart3, Shield, Lock, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAppState } from "@/contexts/AppContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Policy Briefs", url: "/briefs", icon: FileText },
  { title: "Feedback Explorer", url: "/explorer", icon: MessageSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Admin Insights", url: "/admin-insights", icon: Lock },
  { title: "Submit Feedback", url: "/submit", icon: Send },
];

const citizenNavItems = [
  { title: "Submit Feedback", url: "/submit", icon: Send },
];

export function AppSidebar() {
  const { userRole, logout } = useAppState();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navItems = userRole === "Admin" ? adminNavItems : citizenNavItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-sidebar-primary shrink-0" />
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">GovSense</h1>
              <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">Policy Intelligence</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="mt-3 p-2 bg-sidebar-accent/60 rounded-md space-y-2">
            <p className="text-[11px] text-sidebar-foreground/80">Signed in as <span className="font-semibold">{userRole}</span></p>
            <Button type="button" size="sm" variant="outline" className="h-7 text-xs w-full" onClick={logout}>
              <LogOut className="h-3.5 w-3.5 mr-1" /> Logout
            </Button>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
