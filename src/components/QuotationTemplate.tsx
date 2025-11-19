interface QuotationItem {
  description: string;
  quantity: number;
  rate: number;
  taxType: string;
  taxRate: number;
}

interface QuotationData {
  id: string;
  clientName: string;
  amount: number;
  issueDate: string;
  validUntil: string;
  lineItems?: QuotationItem[];
}

interface QuotationTemplateProps {
  quotation: QuotationData;
}

export default function QuotationTemplate({ quotation }: QuotationTemplateProps) {
  // Use lineItems from quotation or create default
  const items = quotation.lineItems || [
    { description: "Quotation", quantity: 1, rate: quotation.amount, taxType: 'none', taxRate: 0 }
  ];
  
  // Calculate subtotal from line items
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  
  // Calculate total tax from all items
  const totalTax = items.reduce((sum, item) => {
    if (item.taxType === 'none') return sum;
    return sum + ((item.quantity * item.rate * item.taxRate) / 100);
  }, 0);
  
  // Get tax label
  const getTaxLabel = () => {
    const taxItems = items.filter(item => item.taxType !== 'none');
    if (taxItems.length > 0) {
      const firstTax = taxItems[0];
      return `Tax ${firstTax.taxRate}%`;
    }
    return 'Tax 0%';
  };

  const total = subtotal + totalTax;

  return (
    <div className="w-full mx-auto bg-white shadow-lg" style={{ fontFamily: 'Arial, sans-serif', width: '210mm', minHeight: '297mm', padding: '20mm', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-wider mb-2 text-gray-900">
          QUOTATION
        </h1>
        <p className="text-sm text-gray-600">#{quotation.id}</p>
      </div>

      {/* Quotation Details */}
      <div className="flex justify-between mb-12">
        <div>
          <h3 className="font-bold mb-2 text-gray-900">PREPARED FOR:</h3>
          <p className="text-gray-700">{quotation.clientName}</p>
        </div>
        <div className="text-right">
          <h3 className="font-bold mb-2 text-gray-900">DATE INFO:</h3>
          <p className="text-sm text-gray-600">Issue Date: {quotation.issueDate}</p>
          <p className="text-sm text-gray-600">Valid Until: {quotation.validUntil}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-4 py-3 font-bold bg-gray-200 text-gray-900">
          <div className="col-span-1 pl-4">DESCRIPTION</div>
          <div className="text-center">UNIT PRICE</div>
          <div className="text-center">QTY</div>
          <div className="text-right pr-4">AMOUNT</div>
        </div>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-200">
            <div className="col-span-1 pl-4 text-gray-900">{item.description}</div>
            <div className="text-center text-gray-900">₹{item.rate}</div>
            <div className="text-center text-gray-900">{item.quantity}</div>
            <div className="text-right pr-4 text-gray-900">₹{(item.quantity * item.rate).toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Spacer to push totals to bottom */}
      <div style={{ flex: 1 }} />

      {/* Totals Section - At Bottom */}
      <div className="space-y-2 mt-auto pt-8 border-t-2 border-gray-300">
        <div className="flex justify-end text-sm">
          <span className="text-gray-600 mr-4">SUBTOTAL</span>
          <span className="w-32 text-right text-gray-600">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-end text-sm mb-3">
          <span className="text-gray-600 mr-4">{getTaxLabel()}</span>
          <span className="w-32 text-right text-gray-600">₹{totalTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-end py-3 px-6 font-bold text-base bg-gray-200 text-gray-900 rounded-lg mb-4">
          <span className="mr-4">TOTAL</span>
          <span className="w-32 text-right">₹{total.toFixed(2)}</span>
        </div>
        
        {/* Thank You Message */}
        <div className="text-right mt-8 pt-4">
          <p className="text-sm text-gray-600 mb-2">This quotation is valid until {quotation.validUntil}</p>
          <h3 className="font-bold text-gray-900">THANK YOU</h3>
        </div>
      </div>
    </div>
  );
}
