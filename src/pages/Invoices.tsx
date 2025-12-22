import { useState, useEffect, useRef } from "react";
import { supabase } from "@/supabaseClient";
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
import { exportElementAsPDF } from "@/lib/pdf";

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
  const { invoices, setInvoices, bankDetails, clients, setClients } = useData();
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
  const [invoiceToDownload, setInvoiceToDownload] = useState<any | null>(null);
  const downloadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      if (invoiceToDownload && downloadRef.current) {
        try {
          await exportElementAsPDF(downloadRef.current, `${invoiceToDownload.id}.pdf`);
          toast({
            title: "Download Ready",
            description: `Invoice ${invoiceToDownload.id} has been downloaded.`,
          });
        } catch (error) {
          toast({
            title: "Download Failed",
            description: "We couldn't generate the PDF. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInvoiceToDownload(null);
        }
      }
    };

    generatePdf();
  }, [invoiceToDownload, toast]);



  const handleInvoiceCreate = async (newInvoice: any) => {
    // Map to Supabase schema - only include fields that exist in the table
    const invoiceForDb = {
      invoiceNumber: newInvoice.invoiceNumber,
      issueDate: newInvoice.issueDate,
      dueDate: newInvoice.dueDate,
      clientName: newInvoice.clientName,
      clientId: newInvoice.clientId,
      amount: newInvoice.amount,
      status: newInvoice.status,
      items: newInvoice.lineItems || [],
      paymentDate: newInvoice.status === 'paid' ? new Date().toISOString().split('T')[0] : null,
    };

    // 1. Sync to Supabase first to get the generated UUID
    const { data, error } = await supabase.from('invoices').insert(invoiceForDb).select().single();

    if (error) {
      console.error("Error creating invoice:", error);
      toast({ title: "Save Failed", description: error.message || "Could not save invoice to cloud.", variant: "destructive" });
      return; // Exit early on error
    }

    // 2. Update local state with merged data (DB fields + extra local fields)
    if (data) {
      setInvoices([...invoices, { ...newInvoice, ...data }]);
    }

    // Check if client exists, if not create new one
    const clientExists = clients.some(c => c.name.toLowerCase() === newInvoice.clientName.toLowerCase());

    if (!clientExists) {
      const newClient = {
        // id: Date.now().toString(), // Let Supabase generate ID or use UUID? 
        // Ideally we use the ID from the newInvoice if generated, but here we generate a client.
        // We will stick to the current logic but push to DB.
        id: Date.now().toString(),
        name: newInvoice.clientName,
        email: "",
        phone: "",
        company: "",
        address: "",
        totalInvoices: 0,
        totalAmount: 0,
        outstanding: 0,
        lastInvoice: new Date().toISOString().split('T')[0]
      };

      setClients([...clients, newClient]);
      await supabase.from('clients').insert(newClient); // Sync new client

      toast({
        title: "New Client Added",
        description: `Client "${newInvoice.clientName}" has been added to your directory.`,
        duration: 5000,
      });
    }
  };

  const handleDeleteClick = (invoice: any) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedInvoice) {
      const { error } = await supabase.from('invoices').delete().eq('id', selectedInvoice.id);

      if (!error) {
        setInvoices(invoices.filter(inv => inv.id !== selectedInvoice.id));
        toast({
          title: "Invoice Deleted",
          description: "Invoice has been successfully removed",
        });
      } else {
        toast({ title: "Delete Failed", description: "Could not delete from cloud.", variant: "destructive" });
      }
      setDeleteDialogOpen(false);
      setSelectedInvoice(null);
    }
  };

  const handleDownload = (invoice: any) => {
    const invoiceData = invoice.bankDetails?.bankName ? invoice : { ...invoice, bankDetails };
    setInvoiceToDownload(invoiceData);
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

  const handleStatusUpdate = async () => {
    if (selectedInvoice) {
      const updatedInvoice = {
        ...selectedInvoice,
        status: newStatus,
        paymentDate: newStatus === 'paid' ? new Date().toISOString() : selectedInvoice.paymentDate
      };

      // Optimistic Update
      setInvoices(invoices.map(inv =>
        inv.id === selectedInvoice.id ? updatedInvoice : inv
      ));

      // Sync
      await supabase.from('invoices').update({
        status: newStatus,
        paymentDate: updatedInvoice.paymentDate
      }).eq('id', selectedInvoice.id);

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

  const handleAdvancePaymentUpdate = async () => {
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
      let paymentDate = selectedInvoice.paymentDate;

      if (advancePaymentAmount >= total) {
        newStatus = 'paid';
        paymentDate = new Date().toISOString();
      } else if (advancePaymentAmount > 0) {
        newStatus = 'partial';
      }

      const updatedFields = { advancePayment: advancePaymentAmount, status: newStatus, paymentDate };

      setInvoices(invoices.map(inv =>
        inv.id === selectedInvoice.id
          ? { ...inv, ...updatedFields }
          : inv
      ));

      // Sync
      await supabase.from('invoices').update(updatedFields).eq('id', selectedInvoice.id);

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
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        {invoiceToDownload && (
          <div ref={downloadRef}>
            <InvoiceTemplate invoice={invoiceToDownload} />
          </div>
        )}
      </div>
      <InvoiceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onInvoiceCreate={handleInvoiceCreate} />
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400 text-glow">Invoices</h1>
          <p className="text-gray-400 mt-2 text-lg">
            Create, manage, and track all your business invoices
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 text-gray-300 hover:text-white transition-all">
            <FileText className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button className="hover-glow bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-medium" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Payment Status Section */}
      <Card className="glass-panel border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Payment Status</CardTitle>
          <CardDescription className="text-gray-400">Overview of paid and pending invoice amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-200">Paid</h3>
                <Badge className="bg-success/20 text-success border-success/20 px-3 py-1">
                  {invoices.filter(i => i.status === 'paid').length} Invoices
                </Badge>
              </div>
              <div className="text-3xl font-bold text-success drop-shadow-sm">
                ₹{paidAmount.toLocaleString()}
              </div>
              <p className="text-sm text-gray-400">
                Total amount received from paid invoices
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-200">Pending</h3>
                <Badge className="bg-warning/20 text-warning border-warning/20 px-3 py-1">
                  {invoices.filter(i => i.status === 'pending' || i.status === 'sent').length} Invoices
                </Badge>
              </div>
              <div className="text-3xl font-bold text-warning drop-shadow-sm">
                ₹{pendingAmount.toLocaleString()}
              </div>
              <p className="text-sm text-gray-400">
                Total amount awaiting payment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-panel border-0 hover:bg-white/5 transition-colors group">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white group-hover:text-primary transition-colors text-glow">
              ₹{totalAmount.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 mt-1">Total Invoiced</p>
          </CardContent>
        </Card>
        <Card className="glass-panel border-0 hover:bg-white/5 transition-colors group">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white group-hover:text-primary transition-colors text-glow">
              {invoices.length}
            </div>
            <p className="text-sm text-gray-400 mt-1">Total Invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="glass-panel border-0 bg-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">All Invoices</CardTitle>
          <CardDescription className="text-gray-400">
            Manage and track your invoice status and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search invoices by ID, client, or description..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-gray-300">
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
            <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 text-gray-300 hover:text-white transition-all">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold whitespace-nowrap">Invoice</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">Client</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">Amount</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">Issue Date</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">Due Date</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-white/5 transition-colors border-white/5">
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell className="whitespace-nowrap">{invoice.clientName}</TableCell>
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
                    <TableCell className="whitespace-nowrap">{invoice.issueDate}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className={`${invoice.status === 'overdue'
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

              {/* Payment Status Badge - Removed as per request */}
              {/* <div className="mt-3">...</div> */}
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