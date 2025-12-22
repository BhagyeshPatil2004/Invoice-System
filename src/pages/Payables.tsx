import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { Plus, Search, MoreHorizontal, Download, Trash2, Edit } from "lucide-react";
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
import PayableDialog from "@/components/PayableDialog";

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
  const { payables, setPayables } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<any>(null);
  const { toast } = useToast();

  // Status Dialog State
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("pending");

  const handleStatusClick = (payable: any) => {
    setSelectedPayable(payable);
    setNewStatus(payable.status || "pending");
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedPayable) return;

    let updates: any = { status: newStatus };

    if (newStatus === "paid") {
      updates.amountPaid = selectedPayable.billAmount;
      updates.amountDue = 0;
    } else if (newStatus === "pending") {
      updates.amountPaid = 0;
      updates.amountDue = selectedPayable.billAmount;
    }

    const updatedPayable = { ...selectedPayable, ...updates };
    setPayables(payables.map(p => p.id === selectedPayable.id ? updatedPayable : p));

    await supabase.from('payables').update(updates).eq('id', selectedPayable.id);

    toast({ title: "Status updated successfully" });
    setStatusDialogOpen(false);
    setSelectedPayable(null);
  };

  // Debug logging
  console.log('Payables Render:', { all: payables.length });

  const filteredPayables = payables.filter(item => {
    if (!searchTerm) return true; // Fix: Always show all if no search
    const term = searchTerm.toLowerCase();
    return (
      (item.id && item.id.toLowerCase().includes(term)) ||
      (item.billId && item.billId.toLowerCase().includes(term)) ||
      (item.vendorName && item.vendorName.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term))
    );
  });

  const handleSave = async (payable: any) => {
    if (selectedPayable) {
      // UPDATE existing payable
      setPayables(payables.map(p => p.id === selectedPayable.id ? { ...selectedPayable, ...payable } : p));

      const { id, created_at, ...updates } = payable;
      await supabase.from('payables').update(updates).eq('id', selectedPayable.id);

      toast({ title: "Bill updated successfully" });
    } else {
      // CREATE new payable - let Supabase generate the UUID
      const { id, ...payableData } = payable; // Remove the id field

      const { data, error } = await supabase.from('payables').insert(payableData).select().single();

      if (error) {
        toast({ title: "Error creating bill", description: error.message, variant: "destructive" });
        return;
      }

      if (data) {
        setPayables([...payables, data]);
        toast({ title: "Bill added successfully" });
      }
    }
    setSelectedPayable(null);
  };

  const handleEdit = (payable: any) => {
    setSelectedPayable(payable);
    setDialogOpen(true);
  };

  const handleDeleteClick = (payable: any) => {
    setSelectedPayable(payable);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPayable) {
      // Sync Delete
      const { error } = await supabase.from('payables').delete().eq('id', selectedPayable.id);

      if (!error) {
        setPayables(payables.filter(p => p.id !== selectedPayable.id));
        toast({ title: "Bill deleted successfully" });
      } else {
        toast({ title: "Delete Failed", description: "Could not delete bill from cloud.", variant: "destructive" });
      }

      setDeleteDialogOpen(false);
      setSelectedPayable(null);
    }
  };

  const handleDownload = () => {
    toast({ title: "Downloading bill..." });
  };

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
        <Button className="hover-scale" onClick={() => { setSelectedPayable(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bill
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">
              ₹{totalBills.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Bills</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              ₹{totalPaid.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Paid</p>
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
                      <div className="font-medium text-foreground">{item.billId || item.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{item.vendorName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground">
                        ₹{item.billAmount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-success font-medium">
                        ₹{item.amountPaid.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${item.amountDue > 0 ? 'text-danger' : 'text-muted-foreground'}`}>
                        ₹{item.amountDue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`${item.status === 'overdue'
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

                          <DropdownMenuItem onClick={() => handleStatusClick(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Change Status
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

      <PayableDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        payable={selectedPayable}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this bill. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Update Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Bill Status</AlertDialogTitle>
            <AlertDialogDescription>
              Change the payment status for this bill.
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
    </div>
  );
}
