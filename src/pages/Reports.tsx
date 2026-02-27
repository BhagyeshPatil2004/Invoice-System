import { useState, useMemo } from "react";
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, FileText, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, Rectangle, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function Reports() {
  const [dateRange, setDateRange] = useState("yearly"); // Changed default to Yearly
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const { invoices, payables } = useData();

  // Calculate analytics
  const analytics = useMemo(() => {
    const now = new Date();
    const filterDate = (date: string) => {
      const itemDate = new Date(date);
      switch (dateRange) {
        case "weekly":
          return now.getTime() - itemDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case "monthly":
          return now.getMonth() === itemDate.getMonth() && now.getFullYear() === itemDate.getFullYear();
        case "quarterly":
          const quarter = Math.floor(now.getMonth() / 3);
          const itemQuarter = Math.floor(itemDate.getMonth() / 3);
          return quarter === itemQuarter && now.getFullYear() === itemDate.getFullYear();
        case "yearly":
          return now.getFullYear() === itemDate.getFullYear();
        case "all":
          return true;
        default:
          return true;
      }
    };

    const filteredInvoices = invoices.filter(inv => filterDate(inv.issueDate));
    const filteredPayables = payables.filter(pay => filterDate(pay.dueDate));

    const totalRevenue = filteredInvoices
      .filter(inv => inv.status?.toLowerCase() === "paid")
      .reduce((sum, inv) => sum + inv.amount, 0);

    const totalExpenses = filteredPayables
      .filter(pay => pay.status?.toLowerCase() === "paid")
      .reduce((sum, pay) => sum + pay.billAmount, 0);

    const profit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

    // Chart Data Generation
    let chartData = [];

    if (dateRange === 'weekly') {
      // Last 7 Days
      chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dayLabel = d.toLocaleDateString('en', { weekday: 'short' });

        const dayRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.issueDate);
            return invDate.getDate() === d.getDate() &&
              invDate.getMonth() === d.getMonth() &&
              invDate.getFullYear() === d.getFullYear() &&
              inv.status?.toLowerCase() === "paid";
          })
          .reduce((sum, inv) => sum + inv.amount, 0);

        const dayExpenses = payables
          .filter(pay => {
            const payDate = new Date(pay.dueDate);
            return payDate.getDate() === d.getDate() &&
              payDate.getMonth() === d.getMonth() &&
              payDate.getFullYear() === d.getFullYear() &&
              pay.status?.toLowerCase() === "paid";
          })
          .reduce((sum, pay) => sum + pay.billAmount, 0);

        return {
          name: dayLabel, // Changed key from 'month' to 'name'
          revenue: dayRevenue,
          expenses: dayExpenses,
          profit: dayRevenue - dayExpenses
        };
      });
    } else if (dateRange === 'monthly') {
      // Days of current month
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      chartData = Array.from({ length: daysInMonth }, (_, i) => {
        const dayNum = i + 1;
        const d = new Date(now.getFullYear(), now.getMonth(), dayNum);

        const dayRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.issueDate);
            return invDate.getDate() === dayNum &&
              invDate.getMonth() === now.getMonth() &&
              invDate.getFullYear() === now.getFullYear() &&
              inv.status?.toLowerCase() === "paid";
          })
          .reduce((sum, inv) => sum + inv.amount, 0);

        const dayExpenses = payables
          .filter(pay => {
            const payDate = new Date(pay.dueDate);
            return payDate.getDate() === dayNum &&
              payDate.getMonth() === now.getMonth() &&
              payDate.getFullYear() === now.getFullYear() &&
              pay.status?.toLowerCase() === "paid";
          })
          .reduce((sum, pay) => sum + pay.billAmount, 0);

        return {
          name: `${dayNum}`, // Day number
          revenue: dayRevenue,
          expenses: dayExpenses,
          profit: dayRevenue - dayExpenses
        };
      });
    } else if (dateRange === 'quarterly') {
      // Current Quarter (3 Months)
      const quarter = Math.floor(now.getMonth() / 3);
      const startMonth = quarter * 3;

      chartData = Array.from({ length: 3 }, (_, i) => {
        const monthIndex = startMonth + i;
        const monthDate = new Date(now.getFullYear(), monthIndex, 1);
        const monthName = monthDate.toLocaleDateString('en', { month: 'short' });

        const monthRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.issueDate);
            return invDate.getMonth() === monthIndex &&
              invDate.getFullYear() === now.getFullYear() &&
              inv.status?.toLowerCase() === "paid";
          })
          .reduce((sum, inv) => sum + inv.amount, 0);

        const monthExpenses = payables
          .filter(pay => {
            const payDate = new Date(pay.dueDate);
            return payDate.getMonth() === monthIndex &&
              payDate.getFullYear() === now.getFullYear() &&
              pay.status?.toLowerCase() === "paid";
          })
          .reduce((sum, pay) => sum + pay.billAmount, 0);

        return {
          name: monthName,
          revenue: monthRevenue,
          expenses: monthExpenses,
          profit: monthRevenue - monthExpenses
        };
      });
    } else if (dateRange === 'yearly') {
      // Yearly (Default to 12 months of current year)
      chartData = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(now.getFullYear(), i, 1);
        const monthName = month.toLocaleDateString('en', { month: 'short' });

        const monthRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.issueDate);
            return invDate.getMonth() === i &&
              invDate.getFullYear() === now.getFullYear() &&
              inv.status?.toLowerCase() === "paid";
          })
          .reduce((sum, inv) => sum + inv.amount, 0);

        const monthExpenses = payables
          .filter(pay => {
            const payDate = new Date(pay.dueDate);
            return payDate.getMonth() === i &&
              payDate.getFullYear() === now.getFullYear() &&
              pay.status?.toLowerCase() === "paid";
          })
          .reduce((sum, pay) => sum + pay.billAmount, 0);

        return {
          name: monthName,
          revenue: monthRevenue,
          expenses: monthExpenses,
          profit: monthRevenue - monthExpenses
        };
      });
    } else {
      // All Time - Yearly Breakdown
      const years = new Set<number>();
      invoices.forEach(inv => {
        if (inv.issueDate) years.add(new Date(inv.issueDate).getFullYear());
      });
      payables.forEach(pay => {
        if (pay.dueDate) years.add(new Date(pay.dueDate).getFullYear());
      });

      // Handle case with no data
      if (years.size === 0) {
        years.add(now.getFullYear());
      }

      const minYear = Math.min(...Array.from(years));
      const maxYear = Math.max(...Array.from(years));

      for (let year = minYear; year <= maxYear; year++) {
        const yearRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.issueDate);
            return invDate.getFullYear() === year && inv.status?.toLowerCase() === "paid";
          })
          .reduce((sum, inv) => sum + inv.amount, 0);

        const yearExpenses = payables
          .filter(pay => {
            const payDate = new Date(pay.dueDate);
            return payDate.getFullYear() === year && pay.status?.toLowerCase() === "paid";
          })
          .reduce((sum, pay) => sum + pay.billAmount, 0);

        chartData.push({
          name: year.toString(),
          revenue: yearRevenue,
          expenses: yearExpenses,
          profit: yearRevenue - yearExpenses
        });
      }
    }

    return {
      totalRevenue,
      totalExpenses,
      profit,
      profitMargin,
      totalInvoices: filteredInvoices.length,
      totalPayables: filteredPayables.length,
      avgInvoice: filteredInvoices.length > 0 ? totalRevenue / filteredInvoices.length : 0,
      chartData
    };
  }, [invoices, payables, dateRange]);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--success))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--destructive))",
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--primary))",
    },
  };

  const handleExport = () => {
    // Create CSV content with detailed invoice data
    const csvContent = [
      ["Invoice ID", "Client Name", "Issue Date", "Due Date", "Amount", "Status"],
      ...invoices.map(inv => [
        inv.id,
        `"${inv.clientName}"`, // Quote to handle commas in names
        inv.issueDate,
        inv.dueDate,
        inv.amount.toFixed(2),
        inv.status
      ])
    ].map(row => row.join(",")).join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Detailed sales report exported successfully!");
  };

  const handleExportExpenses = () => {
    // Create CSV content with detailed payables data
    const csvContent = [
      ["Bill ID", "Vendor", "Category", "Bill Amount", "Paid", "Due", "Status", "Due Date"],
      ...payables.map(pay => [
        pay.id,
        `"${pay.vendorName}"`,
        pay.category,
        pay.billAmount.toFixed(2),
        pay.amountPaid.toFixed(2),
        pay.amountDue.toFixed(2),
        pay.status,
        pay.dueDate
      ])
    ].map(row => row.join(",")).join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Expenses report exported successfully!");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 text-glow">
            Reports & Analytics
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] bg-black/40 border-white/10 hover:border-primary/50 transition-all duration-300 rounded-lg backdrop-blur-md hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:scale-105 active:scale-95 group">
              <Calendar className="h-4 w-4 mr-2 text-primary group-hover:text-white transition-colors" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="quarterly">This Quarter</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportExpenses} className="bg-black/40 border-white/10 hover:bg-white/10 hover:border-danger/50 hover:text-danger hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300 rounded-lg group backdrop-blur-md hover:scale-105 active:scale-95">
            <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
            Export Expenses
          </Button>
          <Button variant="default" onClick={handleExport} className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all duration-300 rounded-lg hover:scale-105 active:scale-95 group">
            <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
            Export Sales
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-panel border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-success/30 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-success/10 group-hover:bg-success/20 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:scale-110 duration-300">
                <DollarSign className="h-7 w-7 text-success" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success border border-success/20">
                Revenue
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-white break-all drop-shadow-lg tracking-tight">
                ₹{analytics.totalRevenue.toFixed(2)}
              </div>
              <p className="text-sm text-gray-400 mt-1 font-medium">From paid invoices</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-danger/30 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute inset-0 bg-danger/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-danger/10 group-hover:bg-danger/20 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.15)] group-hover:scale-110 duration-300">
                <TrendingUp className="h-7 w-7 text-danger" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-danger/10 text-danger border border-danger/20">
                Expenses
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-white break-all drop-shadow-lg tracking-tight">
                ₹{analytics.totalExpenses.toFixed(2)}
              </div>
              <p className="text-sm text-gray-400 mt-1 font-medium">From paid bills</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors shadow-[0_0_20px_rgba(124,58,237,0.15)] group-hover:scale-110 duration-300">
                <DollarSign className="h-7 w-7 text-primary" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full border ${analytics.profit >= 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                {analytics.profitMargin}% Margin
              </span>
            </div>
            <div>
              <div className={`text-3xl font-bold break-all drop-shadow-lg tracking-tight ${analytics.profit >= 0 ? 'text-white' : 'text-danger'}`}>
                ₹{analytics.profit.toFixed(2)}
              </div>
              <p className="text-sm text-gray-400 mt-1 font-medium">Net Profit</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:scale-110 duration-300">
                <FileText className="h-7 w-7 text-blue-500" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Volume
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-white drop-shadow-lg tracking-tight">
                {analytics.totalInvoices}
              </div>
              <p className="text-sm text-gray-400 mt-1 font-medium">{analytics.totalPayables} Payables processed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs - Premium Floating Style */}
      <Tabs defaultValue="sales" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 h-auto rounded-full inline-flex shadow-2xl">
            <TabsTrigger
              value="sales"
              className="rounded-full px-8 py-3 text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-[0_0_30px_rgba(124,58,237,0.4)] text-gray-400 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Sales Overview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="rounded-full px-8 py-3 text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-[0_0_30px_rgba(124,58,237,0.4)] text-gray-400 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Client Insights</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="sales" className="space-y-4 animate-slide-up">
          <Card className="glass-panel border-white/5 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <CardHeader className="relative z-10 border-b border-white/5 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    Sales Performance
                  </CardTitle>
                  <CardDescription className="text-gray-400 ml-12">
                    Revenue vs Expenses vs Profit analysis
                  </CardDescription>
                </div>
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                  <button
                    onClick={() => setChartType("area")}
                    className={`p-1.5 rounded-md transition-all ${chartType === "area" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setChartType("bar")}
                    className={`p-1.5 rounded-md transition-all ${chartType === "bar" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "area" ? (
                    <AreaChart data={analytics.chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-white/5" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => {
                          if (value >= 1000000000) return `₹${(value / 1000000000).toFixed(1)}B`;
                          if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
                          if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
                          return `₹${value}`;
                        }}
                        width={60}
                        dx={-10}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <div className="text-sm font-bold mb-3 text-gray-200 border-b border-white/10 pb-2 flex justify-between items-center">
                                  <span>{payload[0].payload.name}</span>
                                  <span className="text-xs font-normal text-gray-500 px-2 py-0.5 rounded bg-white/5">{dateRange.toUpperCase()}</span>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between gap-8 text-sm group">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success))]" />
                                      <span className="text-gray-400">Revenue</span>
                                    </div>
                                    <span className="font-mono font-bold text-success">₹{Number(payload[0].payload.revenue).toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-8 text-sm">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                                      <span className="text-gray-400">Profit</span>
                                    </div>
                                    <span className="font-mono font-bold text-primary">₹{Number(payload[0].payload.profit).toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-8 text-sm">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-destructive shadow-[0_0_8px_hsl(var(--destructive))]" />
                                      <span className="text-gray-400">Expenses</span>
                                    </div>
                                    <span className="font-mono font-bold text-destructive">₹{Number(payload[0].payload.expenses).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--success))"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorExpenses)"
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorProfit)"
                      />
                    </AreaChart>
                  ) : (
                    <BarChart data={analytics.chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-white/5" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => {
                          if (value >= 1000000000) return `₹${(value / 1000000000).toFixed(1)}B`;
                          if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
                          if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
                          return `₹${value}`;
                        }}
                        width={60}
                        dx={-10}
                      />
                      <ChartTooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <div className="text-sm font-bold mb-3 text-gray-200 border-b border-white/10 pb-2 flex justify-between items-center">
                                  <span>{payload[0].payload.name}</span>
                                  <span className="text-xs font-normal text-gray-500 px-2 py-0.5 rounded bg-white/5">{dateRange.toUpperCase()}</span>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between gap-8 text-sm group">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success))]" />
                                      <span className="text-gray-400">Revenue</span>
                                    </div>
                                    <span className="font-mono font-bold text-success">₹{Number(payload[0].payload.revenue).toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-8 text-sm">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                                      <span className="text-gray-400">Profit</span>
                                    </div>
                                    <span className="font-mono font-bold text-primary">₹{Number(payload[0].payload.profit).toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-8 text-sm">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-destructive shadow-[0_0_8px_hsl(var(--destructive))]" />
                                      <span className="text-gray-400">Expenses</span>
                                    </div>
                                    <span className="font-mono font-bold text-destructive">₹{Number(payload[0].payload.expenses).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="hsl(var(--success))"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                        fillOpacity={0.8}
                        minPointSize={5}
                      />
                      <Bar
                        dataKey="expenses"
                        fill="hsl(var(--destructive))"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                        fillOpacity={0.8}
                        minPointSize={5}
                      />
                      <Bar
                        dataKey="profit"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                        fillOpacity={0.8}
                        minPointSize={5}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4 animate-slide-up">
          <Card className="glass-panel border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 p-32 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <CardHeader className="border-b border-white/5 pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                Client Analytics
              </CardTitle>
              <CardDescription className="text-gray-400 ml-12">
                Insights into client behavior and revenue distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
              <div className="space-y-6">
                <div className="p-6 border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-sm">
                  <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    Top Revenue Sources
                  </h4>
                  <div className="space-y-3">
                    {invoices
                      .reduce((acc: any[], inv) => {
                        const existing = acc.find(item => item.client === inv.clientName);
                        if (existing && inv.status === "paid") {
                          existing.total += inv.amount;
                        } else if (inv.status === "paid") {
                          acc.push({ client: inv.clientName, total: inv.amount });
                        }
                        return acc;
                      }, [])
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 5)
                      .map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-transparent hover:border-primary/20">
                          <div className="flex items-center gap-4">
                            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{item.client || 'Unknown Client'}</span>
                          </div>
                          <span className="font-bold text-success font-mono group-hover:scale-105 transition-transform">₹{item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    {invoices.length === 0 && (
                      <div className="text-center py-8 text-gray-500 italic">
                        No client data available
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-white/5 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent hover:border-primary/20 transition-all duration-300">
                    <p className="text-sm text-gray-400 mb-2 font-medium">Active Clients</p>
                    <p className="text-4xl font-bold text-white text-glow">
                      {new Set(invoices.map(inv => inv.clientName)).size}
                    </p>
                    <div className="mt-2 text-xs text-primary/80 px-2 py-1 rounded bg-primary/10 inline-block">
                      Total distinct clients
                    </div>
                  </div>
                  <div className="p-6 border border-white/5 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent hover:border-blue-500/20 transition-all duration-300">
                    <p className="text-sm text-gray-400 mb-2 font-medium">Avg Client Revenue</p>
                    <p className="text-4xl font-bold text-white text-glow">
                      ₹{invoices.length > 0 ? (analytics.totalRevenue / (new Set(invoices.map(inv => inv.clientName)).size || 1)).toFixed(0) : '0'}
                    </p>
                    <div className="mt-2 text-xs text-blue-400/80 px-2 py-1 rounded bg-blue-500/10 inline-block">
                      Per active client
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
