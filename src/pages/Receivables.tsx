import { useState } from "react";
import { Plus, Search, MoreHorizontal, Download, Trash2, Edit } from "lucide-react";
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
import ReceivableDialog from "@/components/ReceivableDialog";

const getStatusBadge = (status: string) => {
  const variants = {
    paid: "bg-success/10 text-success border-success/20",
    partial: "bg-warning/10 text-warning border-warning/20",
    pending: "bg-primary/10 text-primary border-primary/20",
    overdue: "bg-danger/10 text-danger border-danger/20"
  };
  
  return variants[status as keyof typeof variants] || variants.pending;
};

export default function Receivables() {
  const [searchTerm, setSearchTerm] = useState("");
  const [receivables, setReceivables] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState<any>(null);
  const { toast } = useToast();
  
  const filteredReceivables = receivables.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (receivable: any) => {
    if (selectedReceivable) {
      setReceivables(receivables.map(r => r.id === selectedReceivable.id ? receivable : r));
      toast({ title: "Receivable updated successfully" });
    } else {
      setReceivables([...receivables, receivable]);
      toast({ title: "Receivable added successfully" });
    }
    setSelectedReceivable(null);
  };

  const handleEdit = (receivable: any) => {
    setSelectedReceivable(receivable);
    setDialogOpen(true);
  };

  const handleDeleteClick = (receivable: any) => {
    setSelectedReceivable(receivable);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setReceivables(receivables.filter(r => r.id !== selectedReceivable.id));
    toast({ title: "Receivable deleted successfully" });
    setDeleteDialogOpen(false);
    setSelectedReceivable(null);
  };

  const handleDownload = () => {
    toast({ title: "Downloading receivable report..." });
  };

  const totalInvoiced = receivables.reduce((sum, item) => sum + item.invoiceAmount, 0);
  const totalReceived = receivables.reduce((sum, item) => sum + item.amountPaid, 0);
  const totalOutstanding = receivables.reduce((sum, item) => sum + item.amountDue, 0);
  const overdueAmount = receivables.filter(r => r.status === 'overdue').reduce((sum, item) => sum + item.amountDue, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receivables</h1>
          <p className="text-muted-foreground mt-1">
            Track payments you need to receive from clients
          </p>
        </div>
        <Button className="hover-scale" onClick={() => { setSelectedReceivable(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Receivable
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">
              ₹{totalInvoiced.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Invoiced</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              ₹{totalReceived.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Received</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              ₹{totalOutstanding.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-danger">
              ₹{overdueAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Receivables Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Tracking</CardTitle>
          <CardDescription>
            Monitor incoming payments and outstanding amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search by invoice ID or client..." 
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
                  <TableHead className="font-semibold">Invoice</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Invoice Amount</TableHead>
                  <TableHead className="font-semibold">Paid</TableHead>
                  <TableHead className="font-semibold">Due</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceivables.map((item) => (
                  <TableRow key={item.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-foreground">{item.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{item.clientName}</div>
                    </TableCell>
                     <TableCell>
                       <div className="font-semibold text-foreground">
                         ₹{item.invoiceAmount.toLocaleString()}
                       </div>
                     </TableCell>
                     <TableCell>
                       <div className="text-success font-medium">
                         ₹{item.amountPaid.toLocaleString()}
                       </div>
                     </TableCell>
                     <TableCell>
                       <div className={`font-medium ${item.amountDue > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                         ₹{item.amountDue.toLocaleString()}
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
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleDownload}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(item)} className="text-danger">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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

      <ReceivableDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        receivable={selectedReceivable}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this receivable. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
