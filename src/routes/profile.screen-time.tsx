import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format, startOfWeek, startOfMonth, startOfYear, subWeeks, endOfWeek, subMonths } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile/screen-time")({
  component: ScreenTimePage,
});

// Mock data generator
function generateMockData(period: string) {
  // Generate app data based on period
  let apps;
  
  if (period === "today") {
    apps = [
      { name: "Cursor", icon: "⚡", category: "productivity", time: 56 },
      { name: "X.com", icon: "✕", category: "social", time: 62, hasLimit: true },
      { name: "Slack", icon: "💬", category: "productivity", time: 45 },
      { name: "Spotify", icon: "🎵", category: "other", time: 38 },
      { name: "Ghostty", icon: "👻", category: "productivity", time: 22 },
      { name: "Visual Studio Code", icon: "💻", category: "productivity", time: 18 },
      { name: "chatgpt.com", icon: "🤖", category: "productivity", time: 15 },
      { name: "Finder", icon: "📁", category: "other", time: 12 },
      { name: "Messages", icon: "💬", category: "social", time: 8 },
      { name: "Mail", icon: "✉️", category: "productivity", time: 7 },
      { name: "LinkedIn", icon: "💼", category: "social", time: 5 },
      { name: "web.whatsapp.com", icon: "📱", category: "social", time: 4 },
    ];
  } else if (period === "week") {
    apps = [
      { name: "Cursor", icon: "⚡", category: "productivity", time: 392 },
      { name: "Slack", icon: "💬", category: "productivity", time: 315 },
      { name: "X.com", icon: "✕", category: "social", time: 188, hasLimit: true },
      { name: "Spotify", icon: "🎵", category: "other", time: 266 },
      { name: "Visual Studio Code", icon: "💻", category: "productivity", time: 126 },
      { name: "Ghostty", icon: "👻", category: "productivity", time: 154 },
      { name: "chatgpt.com", icon: "🤖", category: "productivity", time: 105 },
      { name: "Finder", icon: "📁", category: "other", time: 84 },
      { name: "Messages", icon: "💬", category: "social", time: 56 },
      { name: "Mail", icon: "✉️", category: "productivity", time: 49 },
      { name: "LinkedIn", icon: "💼", category: "social", time: 35 },
      { name: "YouTube", icon: "📺", category: "social", time: 28 },
    ];
  } else if (period === "month") {
    apps = [
      { name: "Cursor", icon: "⚡", category: "productivity", time: 1568 },
      { name: "Slack", icon: "💬", category: "productivity", time: 1260 },
      { name: "Spotify", icon: "🎵", category: "other", time: 1064 },
      { name: "X.com", icon: "✕", category: "social", time: 752, hasLimit: true },
      { name: "Visual Studio Code", icon: "💻", category: "productivity", time: 504 },
      { name: "Ghostty", icon: "👻", category: "productivity", time: 616 },
      { name: "chatgpt.com", icon: "🤖", category: "productivity", time: 420 },
      { name: "Finder", icon: "📁", category: "other", time: 336 },
      { name: "Messages", icon: "💬", category: "social", time: 224 },
      { name: "Mail", icon: "✉️", category: "productivity", time: 196 },
      { name: "LinkedIn", icon: "💼", category: "social", time: 140 },
      { name: "YouTube", icon: "📺", category: "social", time: 112 },
    ];
  } else if (period === "year") {
    apps = [
      { name: "Cursor", icon: "⚡", category: "productivity", time: 18816 },
      { name: "Slack", icon: "💬", category: "productivity", time: 15120 },
      { name: "Spotify", icon: "🎵", category: "other", time: 12768 },
      { name: "X.com", icon: "✕", category: "social", time: 9024, hasLimit: true },
      { name: "Visual Studio Code", icon: "💻", category: "productivity", time: 6048 },
      { name: "Ghostty", icon: "👻", category: "productivity", time: 7392 },
      { name: "chatgpt.com", icon: "🤖", category: "productivity", time: 5040 },
      { name: "Finder", icon: "📁", category: "other", time: 4032 },
      { name: "Messages", icon: "💬", category: "social", time: 2688 },
      { name: "Mail", icon: "✉️", category: "productivity", time: 2352 },
      { name: "LinkedIn", icon: "💼", category: "social", time: 1680 },
      { name: "YouTube", icon: "📺", category: "social", time: 1344 },
    ];
  } else if (period === "lastWeek") {
    apps = [
      { name: "Cursor", icon: "⚡", category: "productivity", time: 368 },
      { name: "Slack", icon: "💬", category: "productivity", time: 298 },
      { name: "X.com", icon: "✕", category: "social", time: 175, hasLimit: true },
      { name: "Spotify", icon: "🎵", category: "other", time: 245 },
      { name: "Ghostty", icon: "👻", category: "productivity", time: 142 },
      { name: "Visual Studio Code", icon: "💻", category: "productivity", time: 115 },
      { name: "chatgpt.com", icon: "🤖", category: "productivity", time: 98 },
      { name: "Finder", icon: "📁", category: "other", time: 78 },
      { name: "Messages", icon: "💬", category: "social", time: 52 },
      { name: "Mail", icon: "✉️", category: "productivity", time: 44 },
      { name: "LinkedIn", icon: "💼", category: "social", time: 32 },
      { name: "YouTube", icon: "📺", category: "social", time: 25 },
    ];
  } else if (period === "lastMonth") {
    apps = [
      { name: "Cursor", icon: "⚡", category: "productivity", time: 1485 },
      { name: "Slack", icon: "💬", category: "productivity", time: 1195 },
      { name: "Spotify", icon: "🎵", category: "other", time: 1010 },
      { name: "X.com", icon: "✕", category: "social", time: 715, hasLimit: true },
      { name: "Ghostty", icon: "👻", category: "productivity", time: 585 },
      { name: "Visual Studio Code", icon: "💻", category: "productivity", time: 478 },
      { name: "chatgpt.com", icon: "🤖", category: "productivity", time: 398 },
      { name: "Finder", icon: "📁", category: "other", time: 318 },
      { name: "Messages", icon: "💬", category: "social", time: 212 },
      { name: "Mail", icon: "✉️", category: "productivity", time: 186 },
      { name: "LinkedIn", icon: "💼", category: "social", time: 132 },
      { name: "YouTube", icon: "📺", category: "social", time: 106 },
    ];
  } else {
    // Custom - use week data as default
    apps = [
      { name: "Cursor", icon: "⚡", category: "productivity", time: 392 },
      { name: "Slack", icon: "💬", category: "productivity", time: 315 },
      { name: "X.com", icon: "✕", category: "social", time: 188, hasLimit: true },
      { name: "Spotify", icon: "🎵", category: "other", time: 266 },
      { name: "Visual Studio Code", icon: "💻", category: "productivity", time: 126 },
      { name: "Ghostty", icon: "👻", category: "productivity", time: 154 },
      { name: "chatgpt.com", icon: "🤖", category: "productivity", time: 105 },
      { name: "Finder", icon: "📁", category: "other", time: 84 },
      { name: "Messages", icon: "💬", category: "social", time: 56 },
      { name: "Mail", icon: "✉️", category: "productivity", time: 49 },
      { name: "LinkedIn", icon: "💼", category: "social", time: 35 },
      { name: "YouTube", icon: "📺", category: "social", time: 28 },
    ];
  }
  
  // Calculate totals from the app data
  const productivityTotal = apps.filter(a => a.category === "productivity").reduce((sum, app) => sum + app.time, 0);
  const socialTotal = apps.filter(a => a.category === "social").reduce((sum, app) => sum + app.time, 0);
  const otherTotal = apps.filter(a => a.category === "other").reduce((sum, app) => sum + app.time, 0);
  const totalTime = productivityTotal + socialTotal + otherTotal;
  
  // Add "All Usage" at the beginning
  apps.unshift({ name: "All Usage", icon: "📊", category: "all", time: totalTime });

  let weekData;
  let hourlyData;
  
  if (period === "today") {
    // Realistic daily pattern - past week for context
    weekData = [
      { day: "M", productivity: 165, other: 78, social: 12 },
      { day: "T", productivity: 198, other: 89, social: 18 },
      { day: "W", productivity: 182, other: 95, social: 15 },
      { day: "T", productivity: 156, other: 72, social: 22 },
      { day: "F", productivity: 134, other: 65, social: 28 },
      { day: "S", productivity: 95, other: 48, social: 35 },
      { day: "S", productivity: 78, other: 42, social: 30 },
    ];
    
    // Realistic hourly pattern - full day
    hourlyData = [
      { hour: "00", productivity: 2, other: 1, social: 0 },
      { hour: "01", productivity: 0, other: 0, social: 0 },
      { hour: "02", productivity: 0, other: 0, social: 0 },
      { hour: "03", productivity: 0, other: 0, social: 0 },
      { hour: "04", productivity: 0, other: 0, social: 0 },
      { hour: "05", productivity: 0, other: 0, social: 0 },
      { hour: "06", productivity: 0, other: 0, social: 0 },
      { hour: "07", productivity: 3, other: 2, social: 1 },
      { hour: "08", productivity: 12, other: 6, social: 3 },
      { hour: "09", productivity: 28, other: 14, social: 2 },
      { hour: "10", productivity: 35, other: 18, social: 4 },
      { hour: "11", productivity: 32, other: 16, social: 3 },
      { hour: "12", productivity: 24, other: 12, social: 5 },
      { hour: "13", productivity: 38, other: 20, social: 4 },
      { hour: "14", productivity: 42, other: 22, social: 3 },
      { hour: "15", productivity: 45, other: 24, social: 6 },
      { hour: "16", productivity: 38, other: 19, social: 8 },
      { hour: "17", productivity: 28, other: 15, social: 7 },
      { hour: "18", productivity: 18, other: 10, social: 9 },
      { hour: "19", productivity: 12, other: 8, social: 6 },
      { hour: "20", productivity: 8, other: 6, social: 4 },
      { hour: "21", productivity: 6, other: 4, social: 3 },
      { hour: "22", productivity: 4, other: 3, social: 2 },
      { hour: "23", productivity: 3, other: 2, social: 1 },
    ];
  } else if (period === "week") {
    // Full week with realistic pattern - weekdays higher, weekends lower
    weekData = [
      { day: "M", productivity: 165, other: 78, social: 12 },
      { day: "T", productivity: 198, other: 89, social: 18 },
      { day: "W", productivity: 182, other: 95, social: 15 },
      { day: "T", productivity: 156, other: 72, social: 22 },
      { day: "F", productivity: 134, other: 65, social: 28 },
      { day: "S", productivity: 95, other: 48, social: 35 },
      { day: "S", productivity: 78, other: 42, social: 30 },
    ];
    
    hourlyData = weekData;
  } else if (period === "month") {
    // 4 weeks with gradual variation
    weekData = [
      { day: "Week 1", productivity: 920, other: 420, social: 95 },
      { day: "Week 2", productivity: 985, other: 465, social: 110 },
      { day: "Week 3", productivity: 850, other: 398, social: 88 },
      { day: "Week 4", productivity: 910, other: 445, social: 102 },
    ];
    
    hourlyData = weekData;
  } else if (period === "year") {
    // Full year with seasonal variation
    weekData = [
      { day: "Jan", productivity: 3200, other: 1450, social: 380 },
      { day: "Feb", productivity: 2950, other: 1320, social: 420 },
      { day: "Mar", productivity: 3400, other: 1580, social: 450 },
      { day: "Apr", productivity: 3150, other: 1490, social: 410 },
      { day: "May", productivity: 2980, other: 1380, social: 520 },
      { day: "Jun", productivity: 2750, other: 1280, social: 580 },
      { day: "Jul", productivity: 2420, other: 1150, social: 620 },
      { day: "Aug", productivity: 2380, other: 1100, social: 650 },
      { day: "Sep", productivity: 3100, other: 1440, social: 480 },
      { day: "Oct", productivity: 3350, other: 1520, social: 440 },
      { day: "Nov", productivity: 3280, other: 1480, social: 395 },
      { day: "Dec", productivity: 2650, other: 1220, social: 550 },
    ];
    
    hourlyData = weekData;
  } else if (period === "lastWeek") {
    // Last week with realistic pattern
    weekData = [
      { day: "M", productivity: 152, other: 72, social: 11 },
      { day: "T", productivity: 188, other: 84, social: 17 },
      { day: "W", productivity: 175, other: 88, social: 14 },
      { day: "T", productivity: 148, other: 68, social: 20 },
      { day: "F", productivity: 125, other: 60, social: 26 },
      { day: "S", productivity: 88, other: 44, social: 32 },
      { day: "S", productivity: 72, other: 39, social: 28 },
    ];
    
    hourlyData = weekData;
  } else if (period === "lastMonth") {
    // Last month with weekly pattern
    weekData = [
      { day: "Week 1", productivity: 875, other: 398, social: 90 },
      { day: "Week 2", productivity: 935, other: 442, social: 104 },
      { day: "Week 3", productivity: 805, other: 378, social: 83 },
      { day: "Week 4", productivity: 865, other: 422, social: 97 },
    ];
    
    hourlyData = weekData;
  } else {
    // Custom range - use week pattern as default
    weekData = [
      { day: "M", productivity: 165, other: 78, social: 12 },
      { day: "T", productivity: 198, other: 89, social: 18 },
      { day: "W", productivity: 182, other: 95, social: 15 },
      { day: "T", productivity: 156, other: 72, social: 22 },
      { day: "F", productivity: 134, other: 65, social: 28 },
      { day: "S", productivity: 95, other: 48, social: 35 },
      { day: "S", productivity: 78, other: 42, social: 30 },
    ];
    
    hourlyData = weekData;
  }

  return { apps, weekData, hourlyData };
}

// Generate detailed usage sessions for a specific app
function generateAppDetails(appName: string, period: string) {
  const now = new Date();
  const sessions: Array<{ used_at: Date; used_until: Date; duration: number }> = [];
  
  if (period === "today") {
    // Generate realistic sessions throughout the day
    sessions.push(
      { used_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 45), used_until: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 23), duration: 38 },
      { used_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30), used_until: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 15), duration: 45 },
      { used_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 22), used_until: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 8), duration: 46 },
      { used_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 15), used_until: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 43), duration: 28 },
      { used_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 10), used_until: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 2), duration: 52 },
      { used_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 15), used_until: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 28), duration: 73 },
      { used_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 35), used_until: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 12), duration: 37 },
      { used_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 20), used_until: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 51), duration: 31 },
    );
  } else if (period === "week") {
    // Generate sessions across the week
    for (let day = 0; day < 7; day++) {
      const sessionsPerDay = day < 5 ? 3 : 2; // More sessions on weekdays
      for (let session = 0; session < sessionsPerDay; session++) {
        const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - day));
        const startHour = 9 + session * 3;
        const duration = Math.floor(Math.random() * 60) + 20;
        const startTime = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startHour, Math.floor(Math.random() * 60));
        const endTime = new Date(startTime.getTime() + duration * 60000);
        sessions.push({ used_at: startTime, used_until: endTime, duration });
      }
    }
  } else if (period === "month") {
    // Generate representative sessions for the month (20 sessions)
    for (let i = 0; i < 20; i++) {
      const dayOffset = Math.floor(i * 1.5);
      const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOffset);
      const startHour = 9 + (i % 8);
      const duration = Math.floor(Math.random() * 90) + 30;
      const startTime = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startHour, Math.floor(Math.random() * 60));
      const endTime = new Date(startTime.getTime() + duration * 60000);
      sessions.push({ used_at: startTime, used_until: endTime, duration });
    }
  } else if (period === "lastWeek") {
    // Generate sessions for last week (similar to week but in the past)
    for (let day = 0; day < 7; day++) {
      const sessionsPerDay = day < 5 ? 3 : 2; // More sessions on weekdays
      for (let session = 0; session < sessionsPerDay; session++) {
        const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (13 - day));
        const startHour = 9 + session * 3;
        const duration = Math.floor(Math.random() * 55) + 18;
        const startTime = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startHour, Math.floor(Math.random() * 60));
        const endTime = new Date(startTime.getTime() + duration * 60000);
        sessions.push({ used_at: startTime, used_until: endTime, duration });
      }
    }
  } else if (period === "lastMonth") {
    // Generate representative sessions for last month (18 sessions)
    for (let i = 0; i < 18; i++) {
      const dayOffset = Math.floor(i * 1.7) + 30; // Start from 30 days ago
      const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOffset);
      const startHour = 9 + (i % 8);
      const duration = Math.floor(Math.random() * 85) + 28;
      const startTime = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startHour, Math.floor(Math.random() * 60));
      const endTime = new Date(startTime.getTime() + duration * 60000);
      sessions.push({ used_at: startTime, used_until: endTime, duration });
    }
  } else {
    // Generate representative sessions for the year (30 sessions)
    for (let i = 0; i < 30; i++) {
      const dayOffset = Math.floor(i * 12);
      const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOffset);
      const startHour = 9 + (i % 8);
      const duration = Math.floor(Math.random() * 120) + 45;
      const startTime = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startHour, Math.floor(Math.random() * 60));
      const endTime = new Date(startTime.getTime() + duration * 60000);
      sessions.push({ used_at: startTime, used_until: endTime, duration });
    }
  }
  
  // Sort by most recent first
  return sessions.sort((a, b) => b.used_at.getTime() - a.used_at.getTime());
}

function ScreenTimePage() {
  const [period, setPeriod] = useState<"today" | "week" | "month" | "year" | "lastWeek" | "lastMonth" | "custom">("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const { apps, weekData, hourlyData } = generateMockData(period);

  const totalMinutes = apps[0].time;

  const productivityMinutes = apps.filter(a => a.category === "productivity" && a.name !== "All Usage").reduce((sum, app) => sum + app.time, 0);
  const socialMinutes = apps.filter(a => a.category === "social").reduce((sum, app) => sum + app.time, 0);
  const otherMinutes = totalMinutes - productivityMinutes - socialMinutes;

  // Handle app detail view
  const appDetails = selectedApp ? generateAppDetails(selectedApp, period) : null;
  const detailsTotal = appDetails?.reduce((sum, item) => sum + item.duration, 0) || 0;

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartConfig = {
    productivity: {
      label: "Productivity & Finance",
      color: "#3b82f6", // Blue
    },
    other: {
      label: "Other",
      color: "#60a5fa", // Light blue
    },
    social: {
      label: "Social",
      color: "#f97316", // Orange
    },
  };

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    
    // If >= 24 hours, show days
    if (h >= 24) {
      const d = Math.floor(h / 24);
      const remainingH = h % 24;
      return remainingH > 0 ? `${d}d ${remainingH}h` : `${d}d`;
    }
    
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getPeriodDate = () => {
    const today = new Date();
    if (period === "today") return format(today, "EEEE, d MMMM");
    if (period === "week") return `Week of ${format(startOfWeek(today), "d MMM")}`;
    if (period === "month") return format(startOfMonth(today), "MMMM yyyy");
    if (period === "year") return format(startOfYear(today), "yyyy");
    if (period === "lastWeek") {
      const lastWeekStart = startOfWeek(subWeeks(today, 1));
      const lastWeekEnd = endOfWeek(subWeeks(today, 1));
      return `${format(lastWeekStart, "d MMM")} - ${format(lastWeekEnd, "d MMM")}`;
    }
    if (period === "lastMonth") {
      return format(subMonths(startOfMonth(today), 1), "MMMM yyyy");
    }
    if (period === "custom" && customDateRange.from && customDateRange.to) {
      return `${format(customDateRange.from, "d MMM")} - ${format(customDateRange.to, "d MMM")}`;
    }
    return "";
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">App & Website Activity</h1>
          <p className="text-sm text-muted-foreground">
            Updated today at {format(new Date(), "HH:mm")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-border/50">
        <CardContent className="p-8">
          {/* Period Selector and Usage Display */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Usage</div>
              <div className="text-5xl font-bold">
                {formatTime(totalMinutes)}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={period === "lastMonth" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("lastMonth")}
              >
                Last Month
              </Button>
              <Button
                variant={period === "lastWeek" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("lastWeek")}
              >
                Last Week
              </Button>
              <Button
                variant={period === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("today")}
              >
                Today
              </Button>
              <Button
                variant={period === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("week")}
              >
                This Week
              </Button>
              <Button
                variant={period === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("month")}
              >
                This Month
              </Button>
              <Button
                variant={period === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("year")}
              >
                This Year
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={period === "custom" ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Custom
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{
                      from: customDateRange.from,
                      to: customDateRange.to,
                    }}
                    onSelect={(range) => {
                      setCustomDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                      if (range?.from && range?.to) {
                        setPeriod("custom");
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-6">
            {getPeriodDate()}
          </div>

          {/* Weekly Chart */}
          <div className="mb-6">
            <ChartContainer config={chartConfig} className="h-56 w-full">
              <BarChart 
                data={weekData}
                margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                barGap={8}
                barCategoryGap="20%"
              >
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis hide />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="productivity"
                  stackId="a"
                  fill="var(--color-productivity)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="other"
                  stackId="a"
                  fill="var(--color-other)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="social"
                  stackId="a"
                  fill="var(--color-social)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Hourly Chart - Only shown for Today */}
          {period === "today" && (
            <div className="mb-6 bg-muted/30 rounded-lg p-4 -mx-2">
              <ChartContainer config={chartConfig} className="h-32 w-full">
                <BarChart 
                  data={hourlyData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  barGap={2}
                  barCategoryGap="15%"
                >
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <YAxis hide />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="productivity"
                    stackId="a"
                    fill="var(--color-productivity)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="other"
                    stackId="a"
                    fill="var(--color-other)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="social"
                    stackId="a"
                    fill="var(--color-social)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          )}

          {/* Category Legend */}
          <div className="flex items-center gap-6 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#3b82f6" }} />
              <span className="text-sm text-muted-foreground">Productivity & Finance</span>
              <span className="text-sm font-semibold">{formatTime(productivityMinutes)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#60a5fa" }} />
              <span className="text-sm text-muted-foreground">Other</span>
              <span className="text-sm font-semibold">{formatTime(otherMinutes)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#f97316" }} />
              <span className="text-sm text-muted-foreground">Social</span>
              <span className="text-sm font-semibold">{formatTime(socialMinutes)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apps List */}
      <Card className="border-border/50">
        <CardContent className="p-8">
          {!selectedApp ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium">Show Apps</div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Apps Table */}
              <div className="space-y-1">
                <div className="grid grid-cols-3 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
                  <div>Apps</div>
                  <div>Time</div>
                  <div>Limits</div>
                </div>
                {filteredApps.map((app, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (app.name !== "All Usage") {
                        setSelectedApp(app.name);
                        setSearchQuery("");
                      }
                    }}
                    className={cn(
                      "grid grid-cols-3 gap-4 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors",
                      index === 0 ? "bg-muted/50" : "cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{app.icon}</div>
                      <span className={cn("text-sm", index === 0 && "font-semibold")}>
                        {app.name}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {formatTime(app.time)}
                    </div>
                    <div className="flex items-center text-sm justify-between">
                      <span>{app.hasLimit && "⏳"}</span>
                      {index !== 0 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* App Detail View */}
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApp(null)}
                  className="gap-2 -ml-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Apps
                </Button>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{selectedApp}</h3>
                <p className="text-3xl font-bold text-primary">
                  {formatTime(detailsTotal)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {appDetails?.length || 0} sessions
                </p>
              </div>

              {/* Usage Sessions Table */}
              <div className="space-y-1">
                <div className="grid grid-cols-3 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                  <div>Used At</div>
                  <div>Used Until</div>
                  <div>Duration</div>
                </div>
                {appDetails?.map((session, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-sm">
                        {format(session.used_at, "MMM d, h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm">
                        {format(session.used_until, "MMM d, h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        {formatTime(session.duration)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
