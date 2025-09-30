import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceDialog({ open, onOpenChange }: InvoiceDialogProps) {
  const { toast } = useToast();
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0 }
  ]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: "", quantity: 1, rate: 0 }
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Invoice Created",
      description: "Your invoice has been created successfully.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Fill in the invoice details and line items
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acme">Acme Corporation</SelectItem>
                  <SelectItem value="techstart">TechStart Inc</SelectItem>
                  <SelectItem value="digital">Digital Agency Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                placeholder="INV-001"
                defaultValue={`INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Line Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-3 border border-border rounded-lg">
                  <div className="col-span-5">
                    <Label htmlFor={`desc-${item.id}`} className="text-xs">Description</Label>
                    <Input
                      id={`desc-${item.id}`}
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`qty-${item.id}`} className="text-xs">Quantity</Label>
                    <Input
                      id={`qty-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`rate-${item.id}`} className="text-xs">Rate</Label>
                    <Input
                      id={`rate-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Total</Label>
                    <div className="h-10 flex items-center font-semibold text-foreground">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold text-foreground">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (0%):</span>
                <span className="font-semibold text-foreground">$0.00</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total:</span>
                  <span className="text-xl font-bold text-foreground">${calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or terms..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
