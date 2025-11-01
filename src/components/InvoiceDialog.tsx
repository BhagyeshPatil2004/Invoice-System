import { useState } from "react";
import { Plus, Trash2, Percent } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreate: (invoice: any) => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxType: 'none' | 'gst' | 'igst';
  taxRate: number;
}

type TaxType = 'none' | 'gst' | 'igst';
type TaxRate = 0 | 5 | 12 | 18 | 28;

export default function InvoiceDialog({ open, onOpenChange, onInvoiceCreate }: InvoiceDialogProps) {
  const { toast } = useToast();
  const [clientId, setClientId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, taxType: 'none', taxRate: 0 }
  ]);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: "", quantity: 1, rate: 0, taxType: 'none', taxRate: 0 }
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number | TaxType) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateItemTotal = (item: LineItem) => {
    const subtotal = item.quantity * item.rate;
    return subtotal;
  };

  const calculateItemTax = (item: LineItem) => {
    const subtotal = item.quantity * item.rate;
    if (item.taxType === 'none') return 0;
    return (subtotal * item.taxRate) / 100;
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateTotalTax = () => {
    return lineItems.reduce((sum, item) => sum + calculateItemTax(item), 0);
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTotalTax();
  };

  const getTaxBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    
    lineItems.forEach(item => {
      if (item.taxType !== 'none') {
        const key = `${item.taxType.toUpperCase()} ${item.taxRate}%`;
        const tax = calculateItemTax(item);
        breakdown[key] = (breakdown[key] || 0) + tax;
      }
    });
    
    return breakdown;
  };

  const resetForm = () => {
    setClientId("");
    setInvoiceNumber(`INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    setIssueDate(new Date().toISOString().split('T')[0]);
    setDueDate("");
    setNotes("");
    setLineItems([{ id: "1", description: "", quantity: 1, rate: 0, taxType: 'none', taxRate: 0 }]);
    setBankName("");
    setAccountName("");
    setAccountNumber("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!clientId) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    if (!dueDate) {
      toast({
        title: "Error", 
        description: "Please set a due date",
        variant: "destructive",
      });
      return;
    }

    const hasEmptyItems = lineItems.some(item => !item.description || item.rate === 0);
    if (hasEmptyItems) {
      toast({
        title: "Error",
        description: "Please fill in all line items",
        variant: "destructive",
      });
      return;
    }

    const newInvoice = {
      id: invoiceNumber,
      clientId,
      clientName: clientId,
      description: lineItems[0]?.description || "Invoice",
      amount: calculateGrandTotal(),
      status: "pending",
      issueDate,
      dueDate,
      notes,
      lineItems,
      bankDetails: bankName ? {
        bankName,
        accountName,
        accountNumber,
      } : undefined,
    };

    onInvoiceCreate(newInvoice);

    toast({
      title: "Invoice Created Successfully",
      description: `Invoice ${invoiceNumber} has been created for ₹${calculateGrandTotal().toFixed(2)}`,
    });
    
    resetForm();
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
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="client">Client Name *</Label>
              <Input
                id="client"
                placeholder="Enter client name"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                placeholder="INV-001"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
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
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Line Items *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineItem}
                className="hover-scale"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3 bg-card hover:border-primary/50 transition-colors animate-fade-in">
                  {/* First Row: Description, Qty, Rate */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-5">
                      <Label htmlFor={`desc-${item.id}`} className="text-xs text-muted-foreground">Description</Label>
                      <Input
                        id={`desc-${item.id}`}
                        placeholder="Item or service description"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`qty-${item.id}`} className="text-xs text-muted-foreground">Quantity</Label>
                      <Input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`rate-${item.id}`} className="text-xs text-muted-foreground">Per Quantity Rate</Label>
                      <Input
                        id={`rate-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">Subtotal</Label>
                      <div className="h-10 flex items-center font-semibold text-foreground mt-1">
                        ₹{calculateItemTotal(item).toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1 flex items-end justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                        className="hover:bg-danger/10"
                      >
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </div>
                  </div>

                  {/* Second Row: Tax Options */}
                  <div className="grid grid-cols-12 gap-3 pt-2 border-t border-border/50">
                    <div className="col-span-4">
                      <Label htmlFor={`tax-type-${item.id}`} className="text-xs text-muted-foreground flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        Tax Type
                      </Label>
                      <Select 
                        value={item.taxType} 
                        onValueChange={(value: TaxType) => {
                          updateLineItem(item.id, 'taxType', value);
                          if (value === 'none') {
                            updateLineItem(item.id, 'taxRate', 0);
                          }
                        }}
                      >
                        <SelectTrigger id={`tax-type-${item.id}`} className="mt-1">
                          <SelectValue placeholder="Select tax" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Tax</SelectItem>
                          <SelectItem value="gst">GST (Goods & Services Tax)</SelectItem>
                          <SelectItem value="igst">IGST (Integrated GST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {item.taxType !== 'none' && (
                      <>
                        <div className="col-span-3">
                          <Label htmlFor={`tax-rate-${item.id}`} className="text-xs text-muted-foreground">Tax Rate</Label>
                          <Select 
                            value={item.taxRate.toString()} 
                            onValueChange={(value) => updateLineItem(item.id, 'taxRate', parseInt(value))}
                          >
                            <SelectTrigger id={`tax-rate-${item.id}`} className="mt-1">
                              <SelectValue placeholder="Rate" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="12">12%</SelectItem>
                              <SelectItem value="18">18%</SelectItem>
                              <SelectItem value="28">28%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-3">
                          <Label className="text-xs text-muted-foreground">Tax Amount</Label>
                          <div className="h-10 flex items-center font-medium text-warning mt-1">
                            ₹{calculateItemTax(item).toFixed(2)}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs text-muted-foreground">Item Total</Label>
                          <div className="h-10 flex items-center font-bold text-success mt-1">
                            ₹{(calculateItemTotal(item) + calculateItemTax(item)).toFixed(2)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Section */}
          <Separator className="my-4" />
          
          <div className="flex justify-end animate-fade-in">
            <div className="w-80 space-y-3 bg-muted/30 p-6 rounded-lg border border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold text-foreground">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              
              {/* Tax Breakdown */}
              {Object.entries(getTaxBreakdown()).map(([taxLabel, amount]) => (
                <div key={taxLabel} className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    {taxLabel}:
                  </span>
                  <span className="font-semibold text-warning">₹{amount.toFixed(2)}</span>
                </div>
              ))}
              
              {calculateTotalTax() === 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-semibold text-muted-foreground">₹0.00</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-foreground">Grand Total:</span>
                <span className="text-2xl font-bold text-primary">₹{calculateGrandTotal().toFixed(2)}</span>
              </div>
              
              {calculateTotalTax() > 0 && (
                <div className="text-xs text-muted-foreground text-right">
                  (Includes ₹{calculateTotalTax().toFixed(2)} in taxes)
                </div>
              )}
            </div>
          </div>

          {/* Bank Details */}
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <Label className="text-base font-semibold">Bank Details (Optional)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="Enter bank name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  placeholder="Enter account name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes, terms & conditions, or payment instructions..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="hover-scale bg-gradient-to-r from-primary to-primary-hover">
              Create Invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
