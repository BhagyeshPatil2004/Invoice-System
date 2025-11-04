import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Download, FileText, Trash2, Edit, Eye, DollarSign } from "lucide-react";
import InvoiceDialog from "@/components/InvoiceDialog";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { useData } from "@/contexts/DataContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

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
  const { invoices, setInvoices } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [advancePaymentDialogOpen, setAdvancePaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState<number>(0);
  const { toast } = useToast();

  const handleInvoiceCreate = (newInvoice: any) => {
    setInvoices([...invoices, newInvoice]);
  };

  const handleDeleteClick = (invoice: any) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInvoice) {
      setInvoices(invoices.filter(inv => inv.id !== selectedInvoice.id));
      toast({
        title: "Invoice Deleted",
        description: "Invoice has been successfully removed",
      });
      setDeleteDialogOpen(false);
      setSelectedInvoice(null);
    }
  };

  const handleDownload = (invoice: any) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoice.id}`,
    });
  };

  const handleViewClick = (invoice: any) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleStatusClick = (invoice: any) => {
    setSelectedInvoice(invoice);
    setNewStatus(invoice.status);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (selectedInvoice) {
      setInvoices(invoices.map(inv => 
        inv.id === selectedInvoice.id ? { ...inv, status: newStatus } : inv
      ));
      toast({
        title: "Status Updated",
        description: `Invoice status changed to ${newStatus}`,
      });
      setStatusDialogOpen(false);
      setSelectedInvoice(null);
    }
  };

  const handleAdvancePaymentClick = (invoice: any) => {
    setSelectedInvoice(invoice);
    setAdvancePaymentAmount(invoice.advancePayment || 0);
    setAdvancePaymentDialogOpen(true);
  };

  const handleAdvancePaymentUpdate = () => {
    if (selectedInvoice) {
      const total = selectedInvoice.amount;
      
      if (advancePaymentAmount < 0) {
        toast({
          title: "Invalid Amount",
          description: "Advance payment cannot be negative",
          variant: "destructive",
        });
        return;
      }
      
      if (advancePaymentAmount > total) {
        toast({
          title: "Invalid Amount",
          description: "Advance payment cannot exceed the total amount",
          variant: "destructive",
        });
        return;
      }

      // Determine new status based on payment
      let newStatus = selectedInvoice.status;
      if (advancePaymentAmount >= total) {
        newStatus = 'paid';
      } else if (advancePaymentAmount > 0) {
        newStatus = 'partial';
      }

      setInvoices(invoices.map(inv => 
        inv.id === selectedInvoice.id 
          ? { ...inv, advancePayment: advancePaymentAmount, status: newStatus } 
          : inv
      ));
      
      toast({
        title: "Payment Updated",
        description: `Advance payment updated to ₹${advancePaymentAmount.toFixed(2)}`,
      });
      
      setAdvancePaymentDialogOpen(false);
      setSelectedInvoice(null);
    }
  };
  
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "pending" && (invoice.status === "pending" || invoice.status === "sent")) ||
      (statusFilter === "paid" && invoice.status === "paid") ||
      (statusFilter === "draft" && invoice.status === "draft") ||
      (statusFilter === "overdue" && invoice.status === "overdue");
    
    return matchesSearch && matchesStatus;
  });

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

      {/* Payment Status Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>Overview of paid and pending invoice amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Paid</h3>
                <Badge className="bg-success/10 text-success border-success/20">
                  {invoices.filter(i => i.status === 'paid').length} Invoices
                </Badge>
              </div>
              <div className="text-3xl font-bold text-success">
                ₹{paidAmount.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                Total amount received from paid invoices
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Pending</h3>
                <Badge className="bg-warning/10 text-warning border-warning/20">
                  {invoices.filter(i => i.status === 'pending' || i.status === 'sent').length} Invoices
                </Badge>
              </div>
              <div className="text-3xl font-bold text-warning">
                ₹{pendingAmount.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                Total amount awaiting payment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
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
                          <DropdownMenuItem onClick={() => handleViewClick(invoice)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAdvancePaymentClick(invoice)}>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Advance Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusClick(invoice)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(invoice)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(invoice)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Invoice
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

      {/* View Invoice Dialog */}
      <AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <AlertDialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Invoice Preview</AlertDialogTitle>
            <AlertDialogDescription>
              View and download invoice {selectedInvoice?.id}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {/* Payment Status Summary */}
          {selectedInvoice && (
            <div className="bg-muted/30 p-4 rounded-lg border border-border mb-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold text-foreground">₹{selectedInvoice.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Advance Paid</p>
                  <p className="text-lg font-bold text-success">₹{(selectedInvoice.advancePayment || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Balance Due</p>
                  <p className="text-lg font-bold text-warning">₹{(selectedInvoice.amount - (selectedInvoice.advancePayment || 0)).toFixed(2)}</p>
                </div>
              </div>
              
              {/* Payment Status Badge */}
              <div className="mt-3">
                {(selectedInvoice.advancePayment || 0) >= selectedInvoice.amount ? (
                  <Badge className="bg-success/10 text-success border-success/20">Fully Paid</Badge>
                ) : (selectedInvoice.advancePayment || 0) > 0 ? (
                  <Badge className="bg-warning/10 text-warning border-warning/20">Partially Paid</Badge>
                ) : (
                  <Badge className="bg-muted text-muted-foreground border-border">Payment Pending</Badge>
                )}
              </div>
            </div>
          )}

          <div className="py-4">
            {selectedInvoice && (
              <InvoiceTemplate invoice={selectedInvoice} />
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button onClick={() => {
              handleDownload(selectedInvoice);
              toast({
                title: "Download Ready",
                description: "Your invoice is ready to download"
              });
            }}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Update Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Invoice Status</AlertDialogTitle>
            <AlertDialogDescription>
              Change the status for invoice {selectedInvoice?.id}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusUpdate}>
              Update Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Advance Payment Update Dialog */}
      <AlertDialog open={advancePaymentDialogOpen} onOpenChange={setAdvancePaymentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Advance Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Update the advance payment amount for invoice {selectedInvoice?.id}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Amount</label>
              <div className="text-2xl font-bold text-foreground">
                ₹{selectedInvoice?.amount.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="advanceAmount" className="text-sm font-medium">Advance Payment Amount</label>
              <Input
                id="advanceAmount"
                type="number"
                min="0"
                max={selectedInvoice?.amount || 0}
                step="0.01"
                value={advancePaymentAmount}
                onChange={(e) => setAdvancePaymentAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Enter the advance payment amount received from the client
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Balance Due</label>
              <div className="text-xl font-bold text-warning">
                ₹{((selectedInvoice?.amount || 0) - advancePaymentAmount).toFixed(2)}
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdvancePaymentUpdate}>
              Update Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete invoice {selectedInvoice?.id}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}