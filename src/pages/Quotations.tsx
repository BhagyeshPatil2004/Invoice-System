import { useState } from "react";
import { Plus, Search, MoreHorizontal, Download, FileText, Trash2, Edit } from "lucide-react";
import QuotationDialog from "@/components/QuotationDialog";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
const getStatusBadge = (status: string) => {
  const variants = {
    accepted: "bg-success/10 text-success border-success/20",
    sent: "bg-primary/10 text-primary border-primary/20",
    declined: "bg-danger/10 text-danger border-danger/20",
    draft: "bg-muted text-muted-foreground border-border"
  };
  return variants[status as keyof typeof variants] || variants.draft;
};
export default function Quotations() {
  const {
    invoices,
    setInvoices
  } = useData();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const {
    toast
  } = useToast();
  const handleQuotationCreate = (newQuotation: any) => {
    setQuotations([...quotations, newQuotation]);
  };
  const handleDeleteClick = (quotation: any) => {
    setSelectedQuotation(quotation);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (selectedQuotation) {
      setQuotations(quotations.filter(q => q.id !== selectedQuotation.id));
      toast({
        title: "Quotation Deleted",
        description: "Quotation has been successfully removed"
      });
      setDeleteDialogOpen(false);
      setSelectedQuotation(null);
    }
  };
  const handleDownload = (quotation: any) => {
    toast({
      title: "Download Started",
      description: `Downloading quotation ${quotation.id}`
    });
  };
  const handleStatusClick = (quotation: any) => {
    setSelectedQuotation(quotation);
    setNewStatus(quotation.status);
    setStatusDialogOpen(true);
  };
  const handleStatusUpdate = () => {
    if (selectedQuotation && newStatus) {
      // Update quotation status
      setQuotations(quotations.map(q => q.id === selectedQuotation.id ? {
        ...q,
        status: newStatus
      } : q));

      // If status changed to "accepted", create an invoice
      if (newStatus === 'accepted') {
        // Generate sequential invoice number
        const existingNumbers = invoices
          .map(inv => {
            const match = inv.id.match(/^INV-(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter(num => num > 0);
        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        
        const newInvoice = {
          id: `INV-${nextNumber}`,
          clientName: selectedQuotation.clientName,
          description: selectedQuotation.description,
          amount: selectedQuotation.amount,
          status: 'pending',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        };
        setInvoices([...invoices, newInvoice]);
        toast({
          title: "Quotation Accepted & Invoice Created",
          description: `Invoice ${newInvoice.id} has been created from this quotation`
        });
      } else {
        toast({
          title: "Status Updated",
          description: `Quotation status changed to ${newStatus}`
        });
      }
      setStatusDialogOpen(false);
      setSelectedQuotation(null);
    }
  };
  const filteredQuotations = quotations.filter(quote => quote.id.toLowerCase().includes(searchTerm.toLowerCase()) || quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || quote.description.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalAmount = quotations.reduce((sum, quote) => sum + quote.amount, 0);
  const acceptedAmount = quotations.filter(q => q.status === 'accepted').reduce((sum, quote) => sum + quote.amount, 0);
  const pendingAmount = quotations.filter(q => q.status === 'sent').reduce((sum, quote) => sum + quote.amount, 0);
  return <div className="space-y-6 animate-fade-in">
      <QuotationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onQuotationCreate={handleQuotationCreate} />
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quotations</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage quotations for your clients
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button className="hover-scale" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quotation
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Quotations</CardTitle>
          <CardDescription>
            Manage your quotations and track client responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search quotations by ID, client, or description..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Quotation</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Issue Date</TableHead>
                  <TableHead className="font-semibold">Valid Until</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map(quote => <TableRow key={quote.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{quote.id}</div>
                        <div className="text-sm text-muted-foreground">{quote.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{quote.clientName}</div>
                    </TableCell>
                     <TableCell>
                       <div className="font-semibold text-foreground">
                         ₹{quote.amount.toLocaleString()}
                       </div>
                     </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(quote.status)}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground">{quote.issueDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground">{quote.validUntil}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleStatusClick(quote)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(quote)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(quote)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Quotation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>

          {filteredQuotations.length === 0 && <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No quotations found matching your search.</p>
            </div>}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Quotation Status</AlertDialogTitle>
            <AlertDialogDescription>
              Change the status for quotation {selectedQuotation?.id}
              {newStatus === 'accepted' && <span className="block mt-2 text-success font-medium">
                  Note: Accepting this quotation will automatically create an invoice.
                </span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete quotation {selectedQuotation?.id}. This action cannot be undone.
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
    </div>;
}