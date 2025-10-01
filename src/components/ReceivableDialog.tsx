import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReceivableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (receivable: any) => void;
  receivable?: any;
}

export default function ReceivableDialog({ open, onOpenChange, onSave, receivable }: ReceivableDialogProps) {
  const [formData, setFormData] = useState({
    id: receivable?.id || "",
    clientName: receivable?.clientName || "",
    invoiceAmount: receivable?.invoiceAmount || "",
    amountPaid: receivable?.amountPaid || "",
    amountDue: receivable?.amountDue || "",
    status: receivable?.status || "pending",
    dueDate: receivable?.dueDate || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceAmount = parseFloat(formData.invoiceAmount) || 0;
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    const amountDue = invoiceAmount - amountPaid;

    onSave({
      ...formData,
      invoiceAmount,
      amountPaid,
      amountDue,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{receivable ? "Edit Receivable" : "Add New Receivable"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Invoice ID</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="INV-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Enter client name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceAmount">Invoice Amount (₹)</Label>
              <Input
                id="invoiceAmount"
                type="number"
                value={formData.invoiceAmount}
                onChange={(e) => setFormData({ ...formData, invoiceAmount: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountPaid">Amount Paid (₹)</Label>
              <Input
                id="amountPaid"
                type="number"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {receivable ? "Update" : "Add"} Receivable
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
