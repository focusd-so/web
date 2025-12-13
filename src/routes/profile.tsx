import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Clock, History, Boxes, ListTodo } from "lucide-react";

// export const Route = createFileRoute("/profile")({
//   component: ProfilePage,
// });

function ProfilePage() {
  const menuItems = [
    {
      title: "Screen time",
      icon: Clock,
      url: "/profile/screen-time",
    },
    {
      title: "Sessions history",
      icon: History,
      url: "/profile/sessions-history",
    },
    {
      title: "Connected Apps",
      icon: Boxes,
      url: "/profile/connected-apps",
    },
    {
      title: "Tasks",
      icon: ListTodo,
      url: "/profile/tasks",
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold">Profile</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
