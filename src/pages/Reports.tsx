import { useState } from "react";
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

export default function Reports() {
  const [dateRange, setDateRange] = useState("monthly");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="quarterly">This Quarter</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <div className="text-2xl font-bold text-foreground">$124,500</div>
              </div>
            </div>
            <div className="text-sm text-success">+12.5% from last period</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoices</p>
                <div className="text-2xl font-bold text-foreground">156</div>
              </div>
            </div>
            <div className="text-sm text-primary">+8 new this week</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <div className="text-2xl font-bold text-foreground">18.2%</div>
              </div>
            </div>
            <div className="text-sm text-warning">Above target</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clients</p>
                <div className="text-2xl font-bold text-foreground">142</div>
              </div>
            </div>
            <div className="text-sm text-primary">+12 this month</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="expenses">Expenses Report</TabsTrigger>
          <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
          <TabsTrigger value="clients">Client Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Performance
              </CardTitle>
              <CardDescription>
                Revenue trends and sales analysis for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed border-border rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Sales chart visualization will appear here</p>
                  <p className="text-sm text-muted-foreground mt-2">Connect your data to see detailed analytics</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                  <p className="text-2xl font-bold text-foreground">$124,500</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Average Invoice</p>
                  <p className="text-2xl font-bold text-foreground">$2,340</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Growth Rate</p>
                  <p className="text-2xl font-bold text-success">+12.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Expense Analysis
              </CardTitle>
              <CardDescription>
                Track and analyze your business expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed border-border rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Expense breakdown will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Profit & Loss Statement
              </CardTitle>
              <CardDescription>
                Comprehensive P&L analysis for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed border-border rounded-lg">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">P&L statement will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Analytics
              </CardTitle>
              <CardDescription>
                Insights into client behavior and revenue distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed border-border rounded-lg">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Client analytics will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
