import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Eye, Send, Download, FileText } from "lucide-react";
import InvoiceDialog from "@/components/InvoiceDialog";
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

const getStatusBadge = (status: string) => {
  const variants = {
    paid: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    sent: "bg-primary/10 text-primary border-primary/20",
    overdue: "bg-danger/10 text-danger border-danger/20",
    draft: "bg-muted text-muted-foreground border-border"
  };
  
  return variants[status as keyof typeof variants] || variants.draft;
};

const getStatusColor = (status: string) => {
  const colors = {
    paid: "text-success",
    pending: "text-warning", 
    sent: "text-primary",
    overdue: "text-danger",
    draft: "text-muted-foreground"
  };
  
  return colors[status as keyof typeof colors] || colors.draft;
};

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInvoiceCreate = (newInvoice: any) => {
    setInvoices([...invoices, newInvoice]);
  };
  
  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending' || i.status === 'sent').reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <InvoiceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onInvoiceCreate={handleInvoiceCreate} />
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and track all your business invoices
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button className="hover-scale" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">
              ₹{totalAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Invoiced</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              ₹{paidAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Paid</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              ₹{pendingAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">
              {invoices.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            Manage and track your invoice status and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search invoices by ID, client, or description..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Invoice</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Issue Date</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{invoice.id}</div>
                        <div className="text-sm text-muted-foreground">{invoice.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{invoice.clientName}</div>
                    </TableCell>
                     <TableCell>
                       <div className={`font-semibold ${getStatusColor(invoice.status)}`}>
                         ₹{invoice.amount.toLocaleString()}
                       </div>
                     </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground">{invoice.issueDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className={`${
                        invoice.status === 'overdue' 
                          ? 'text-danger font-medium' 
                          : 'text-foreground'
                      }`}>
                        {invoice.dueDate}
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
                            <Eye className="h-4 w-4 mr-2" />
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Client
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No invoices found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}