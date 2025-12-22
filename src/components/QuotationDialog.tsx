import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Percent } from "lucide-react";
import { useData } from "@/contexts/DataContext";

interface QuotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuotationCreate: (quotation: any) => void;
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

export default function QuotationDialog({ open, onOpenChange, onQuotationCreate }: QuotationDialogProps) {
  const { toast } = useToast();
  const { products, quotations } = useData();
  const [quotationNumber, setQuotationNumber] = useState("");

  // Generate next quotation number when dialog opens
  useEffect(() => {
    if (open) {
      if (quotations.length === 0) {
        setQuotationNumber("QUO-001");
      } else {
        const maxNum = quotations.reduce((max, quo) => {
          // Handle both id (old) and quotationNumber (new) fields
          const idToCheck = quo.quotationNumber || quo.id;
          const match = idToCheck.toString().match(/QUO-(\d+)/);
          if (match) {
            const num = parseInt(match[1]);
            return num > max ? num : max;
          }
          return max;
        }, 0);

        setQuotationNumber(`QUO-${(maxNum + 1).toString().padStart(3, '0')}`);
      }
    }
  }, [open, quotations]);

  const [clientName, setClientName] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, taxType: 'none', taxRate: 0 }
  ]);

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

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleProductSelect = (id: string, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setLineItems(lineItems.map(item =>
        item.id === id ? {
          ...item,
          description: product.description ? `${product.name} - ${product.description}` : product.name,
          rate: product.price
        } : item
      ));
    }
  };

  const calculateItemTotal = (item: LineItem) => {
    return item.quantity * item.rate;
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
    setClientName("");
    setQuotationNumber(`QUO-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    setIssueDate(new Date().toISOString().split('T')[0]);
    setValidUntil("");
    setNotes("");
    setLineItems([{ id: "1", description: "", quantity: 1, rate: 0, taxType: 'none', taxRate: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName) {
      toast({
        title: "Validation Error",
        description: "Client name is required",
        variant: "destructive",
      });
      return;
    }

    if (!validUntil) {
      toast({
        title: "Validation Error",
        description: "Valid until date is required",
        variant: "destructive",
      });
      return;
    }

    const hasEmptyItems = lineItems.some(item => !item.description || item.rate === 0);
    if (hasEmptyItems) {
      toast({
        title: "Validation Error",
        description: "Please fill in all line items with description and rate",
        variant: "destructive",
      });
      return;
    }

    const newQuotation = {
      // id: quotationNumber, // Let Supabase handle ID generation or use a separate logic if needed, but for now we pass the quotaionNumber as ID for legacy or mapping
      // Actually, similar to InvoiceDialog, we should pass proper fields.
      // But the caller handleQuotationCreate expects an object.
      // We'll pass `id` as quotationNumber for the text ID (e.g. QUO-001) which the parent might use or map.
      id: quotationNumber,
      quotationNumber,
      clientName,
      clientId: clientName, // Simple mapping for now
      description: lineItems[0]?.description || "Quotation",
      amount: calculateGrandTotal(),
      status: "draft",
      issueDate,
      validUntil,
      lineItems, // Pass items
      notes
    };

    onQuotationCreate(newQuotation);

    toast({
      title: "Success",
      description: `Quotation ${quotationNumber} created successfully`,
    });

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quotation</DialogTitle>
          <DialogDescription>Create a detailed quotation for your client</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Fields */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quotationNumber">Quotation Number</Label>
              <Input
                id="quotationNumber"
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
                placeholder="QUO-001"
              />
            </div>
          </div>

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
              <Label htmlFor="validUntil">Valid Until *</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
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
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-5">
                      <div className="flex justify-between items-center mb-1">
                        <Label htmlFor={`desc-${item.id}`} className="text-xs text-muted-foreground">Description</Label>
                        {products && products.length > 0 && (
                          <div className="w-[140px]">
                            <Select onValueChange={(value) => handleProductSelect(item.id, value)}>
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Load Product..." />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((p: any) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.name} - ₹{p.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
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
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`rate-${item.id}`} className="text-xs text-muted-foreground">Rate (₹)</Label>
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
                          <SelectItem value="gst">GST</SelectItem>
                          <SelectItem value="igst">IGST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {item.taxType !== 'none' && (
                      <>
                        <div className="col-span-3">
                          <Label htmlFor={`tax-rate-${item.id}`} className="text-xs text-muted-foreground">Tax Rate</Label>
                          <Select
                            value={item.taxRate.toString()}
                            onValueChange={(value) => updateLineItem(item.id, 'taxRate', parseFloat(value))}
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

          <Separator className="my-4" />

          {/* Totals Section */}
          <div className="flex justify-end animate-fade-in">
            <div className="w-80 space-y-3 bg-muted/30 p-6 rounded-lg border border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold text-foreground">₹{calculateSubtotal().toFixed(2)}</span>
              </div>

              {Object.entries(getTaxBreakdown()).map(([taxLabel, amount]) => (
                <div key={taxLabel} className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    {taxLabel}:
                  </span>
                  <span className="font-semibold text-warning">₹{amount.toFixed(2)}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-foreground">Grand Total:</span>
                <span className="text-2xl font-bold text-primary">₹{calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add terms & conditions or notes..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Separator className="my-4" />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="hover-scale bg-gradient-to-r from-primary to-primary-hover">
              Create Quotation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
