import { useState } from "react";
import { Plus, Search, MoreHorizontal, CheckCircle, Clock, AlertCircle, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const payables = [
  {
    id: "BILL-001",
    vendorName: "Office Supplies Co",
    billAmount: 450,
    amountPaid: 450,
    amountDue: 0,
    status: "paid",
    dueDate: "2024-01-15",
    paidDate: "2024-01-14",
    category: "Office Supplies"
  },
  {
    id: "BILL-002", 
    vendorName: "Cloud Hosting Ltd",
    billAmount: 299,
    amountPaid: 0,
    amountDue: 299,
    status: "pending",
    dueDate: "2024-02-01",
    paidDate: null,
    category: "Software"
  },
  {
    id: "BILL-003",
    vendorName: "Marketing Agency",
    billAmount: 2500,
    amountPaid: 0,
    amountDue: 2500,
    status: "overdue",
    dueDate: "2024-01-10",
    paidDate: null,
    category: "Marketing"
  },
  {
    id: "BILL-004",
    vendorName: "Equipment Rental",
    billAmount: 800,
    amountPaid: 400,
    amountDue: 400,
    status: "partial",
    dueDate: "2024-02-15",
    paidDate: "2024-01-20",
    category: "Equipment"
  }
];

const getStatusBadge = (status: string) => {
  const variants = {
    paid: "bg-success/10 text-success border-success/20",
    partial: "bg-warning/10 text-warning border-warning/20",
    pending: "bg-primary/10 text-primary border-primary/20",
    overdue: "bg-danger/10 text-danger border-danger/20"
  };
  
  return variants[status as keyof typeof variants] || variants.pending;
};

export default function Payables() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPayables = payables.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBills = payables.reduce((sum, item) => sum + item.billAmount, 0);
  const totalPaid = payables.reduce((sum, item) => sum + item.amountPaid, 0);
  const totalOutstanding = payables.reduce((sum, item) => sum + item.amountDue, 0);
  const overdueAmount = payables.filter(p => p.status === 'overdue').reduce((sum, item) => sum + item.amountDue, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payables</h1>
          <p className="text-muted-foreground mt-1">
            Track payments you need to make to vendors
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Bill
          </Button>
          <Button className="hover-scale">
            <Plus className="h-4 w-4 mr-2" />
            Add Bill
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">
              ${totalBills.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Bills</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              ${totalPaid.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Paid</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              ${totalOutstanding.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-danger">
              ${overdueAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Payables Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bills & Expenses</CardTitle>
          <CardDescription>
            Monitor outgoing payments and vendor bills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search by bill ID, vendor, or category..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              Filter
            </Button>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Bill ID</TableHead>
                  <TableHead className="font-semibold">Vendor</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Bill Amount</TableHead>
                  <TableHead className="font-semibold">Paid</TableHead>
                  <TableHead className="font-semibold">Due</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayables.map((item) => (
                  <TableRow key={item.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-foreground">{item.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{item.vendorName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground">
                        ${item.billAmount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-success font-medium">
                        ${item.amountPaid.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${item.amountDue > 0 ? 'text-danger' : 'text-muted-foreground'}`}>
                        ${item.amountDue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`${
                        item.status === 'overdue' 
                          ? 'text-danger font-medium' 
                          : 'text-foreground'
                      }`}>
                        {item.dueDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="h-4 w-4 mr-2" />
                            Set Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
