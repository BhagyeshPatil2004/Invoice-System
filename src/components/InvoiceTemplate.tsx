import { useInvoiceSettings } from "@/contexts/InvoiceSettingsContext";

interface InvoiceItem {
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface InvoiceData {
  id: string;
  clientName: string;
  clientAddress?: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  description: string;
  items?: InvoiceItem[];
  tax?: number;
  subtotal?: number;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
}

interface InvoiceTemplateProps {
  invoice: InvoiceData;
}

export default function InvoiceTemplate({ invoice }: InvoiceTemplateProps) {
  const { settings } = useInvoiceSettings();
  
  const items = invoice.items || [
    { description: invoice.description, unitPrice: invoice.amount, quantity: 1, total: invoice.amount }
  ];
  
  const subtotal = invoice.subtotal || invoice.amount;
  const taxRate = invoice.tax || 10;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const bankDetails = invoice.bankDetails || {
    bankName: "Default Bank",
    accountName: "Account Holder",
    accountNumber: "0123 4567 8901"
  };

  if (settings.theme === "classic") {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white p-12 shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-light"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {settings.companyName.charAt(0).toLowerCase()}
          </div>
          <h1 className="text-3xl font-bold tracking-wider mb-2" style={{ color: settings.accentColor }}>
            {settings.companyName.toUpperCase()}
          </h1>
          <p className="text-sm italic" style={{ color: settings.accentColor }}>design & branding</p>
        </div>

        {/* Invoice Details */}
        <div className="flex justify-between mb-12">
          <div>
            <h3 className="font-bold mb-2" style={{ color: settings.accentColor }}>ISSUED TO:</h3>
            <p className="text-gray-700">{invoice.clientName}</p>
            {invoice.clientAddress && <p className="text-gray-700">{invoice.clientAddress}</p>}
          </div>
          <div className="text-right">
            <h3 className="font-bold mb-2" style={{ color: settings.accentColor }}>INVOICE NO:</h3>
            <p className="text-gray-700 font-medium">{invoice.id}</p>
            <p className="text-sm text-gray-600 mt-2">DATE: {invoice.issueDate}</p>
            <p className="text-sm text-gray-600">DUE DATE: {invoice.dueDate}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4 py-3 font-bold" style={{ backgroundColor: settings.primaryColor, color: settings.accentColor }}>
            <div className="col-span-1 pl-4">DESCRIPTION</div>
            <div className="text-center">UNIT PRICE</div>
            <div className="text-center">QTY</div>
            <div className="text-right pr-4">TOTAL</div>
          </div>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-200">
              <div className="col-span-1 pl-4 text-gray-700">{item.description}</div>
              <div className="text-center text-gray-700">{item.unitPrice}</div>
              <div className="text-center text-gray-700">{item.quantity}</div>
              <div className="text-right pr-4 text-gray-700">₹{item.total}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 mb-12">
          <div className="flex justify-end">
            <span className="font-bold mr-4" style={{ color: settings.accentColor }}>SUBTOTAL</span>
            <span className="w-32 text-right font-semibold">₹{subtotal}</span>
          </div>
          <div className="flex justify-end text-sm">
            <span className="text-gray-600 mr-4">Tax</span>
            <span className="w-32 text-right text-gray-600">{taxRate}%</span>
          </div>
          <div 
            className="flex justify-end py-3 px-4 font-bold text-lg"
            style={{ backgroundColor: settings.primaryColor, color: settings.accentColor }}
          >
            <span className="mr-4">TOTAL</span>
            <span className="w-32 text-right">₹{total}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end pt-8 border-t-2" style={{ borderColor: settings.primaryColor }}>
          <div>
            <h3 className="font-bold mb-2" style={{ color: settings.accentColor }}>BANK DETAILS</h3>
            <p className="text-sm text-gray-700">{bankDetails.bankName}</p>
            <p className="text-sm text-gray-700">Account Name: {bankDetails.accountName}</p>
            <p className="text-sm text-gray-700">Account No.: {bankDetails.accountNumber}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold mb-2" style={{ color: settings.accentColor }}>THANK YOU</h3>
            <div className="italic text-2xl mt-4" style={{ color: settings.accentColor }}>Avery Davis</div>
          </div>
        </div>
      </div>
    );
  }

  if (settings.theme === "modern") {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div className="p-12" style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})` }}>
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">{settings.companyName}</h1>
            <p className="text-white/80">Professional Invoice Services</p>
          </div>
        </div>

        <div className="p-12">
          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-sm mb-3" style={{ color: settings.accentColor }}>BILL TO</h3>
              <p className="text-gray-800 font-semibold">{invoice.clientName}</p>
              {invoice.clientAddress && <p className="text-gray-600 text-sm">{invoice.clientAddress}</p>}
            </div>
            <div className="text-right">
              <div className="inline-block text-left">
                <div className="flex justify-between gap-8 mb-2">
                  <span className="text-gray-600">Invoice #</span>
                  <span className="font-semibold">{invoice.id}</span>
                </div>
                <div className="flex justify-between gap-8 mb-2">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">{invoice.issueDate}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-gray-600">Due Date</span>
                  <span className="font-semibold">{invoice.dueDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2" style={{ borderColor: settings.primaryColor }}>
                <th className="text-left py-3 font-bold" style={{ color: settings.accentColor }}>Description</th>
                <th className="text-right py-3 font-bold" style={{ color: settings.accentColor }}>Unit Price</th>
                <th className="text-center py-3 font-bold" style={{ color: settings.accentColor }}>Qty</th>
                <th className="text-right py-3 font-bold" style={{ color: settings.accentColor }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 text-gray-700">{item.description}</td>
                  <td className="py-4 text-right text-gray-700">₹{item.unitPrice}</td>
                  <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-4 text-right font-semibold">₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tax ({taxRate}%)</span>
                <span className="font-semibold">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div 
                className="flex justify-between py-3 mt-2 text-white font-bold text-lg px-4"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <span>TOTAL</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="pt-8 border-t-2 border-gray-200">
            <h3 className="font-bold mb-3" style={{ color: settings.accentColor }}>Payment Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Bank Name</p>
                <p className="font-semibold">{bankDetails.bankName}</p>
              </div>
              <div>
                <p className="text-gray-600">Account Name</p>
                <p className="font-semibold">{bankDetails.accountName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Account Number</p>
                <p className="font-semibold">{bankDetails.accountNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal Theme
  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-12 shadow-lg" style={{ fontFamily: 'Helvetica, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
          <h1 className="text-5xl font-bold mb-2" style={{ color: settings.accentColor }}>
            {settings.companyName}
          </h1>
          <div className="h-1 w-24 mt-4" style={{ backgroundColor: settings.primaryColor }}></div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-light mb-4" style={{ color: settings.accentColor }}>INVOICE</p>
          <p className="text-sm text-gray-600">#{invoice.id}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-12 mb-16">
        <div>
          <p className="text-xs font-bold mb-3 tracking-wider" style={{ color: settings.primaryColor }}>TO</p>
          <p className="font-semibold text-lg mb-1">{invoice.clientName}</p>
          {invoice.clientAddress && <p className="text-gray-600 text-sm">{invoice.clientAddress}</p>}
        </div>
        <div className="text-right">
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500">Issue Date</p>
              <p className="font-semibold">{invoice.issueDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="font-semibold">{invoice.dueDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-16">
        <div className="border-b-2 pb-3 mb-6" style={{ borderColor: settings.accentColor }}>
          <div className="grid grid-cols-4 gap-4 text-xs font-bold tracking-wider" style={{ color: settings.accentColor }}>
            <div className="col-span-2">ITEM</div>
            <div className="text-center">QTY</div>
            <div className="text-right">AMOUNT</div>
          </div>
        </div>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100">
            <div className="col-span-2">
              <p className="font-medium">{item.description}</p>
              <p className="text-sm text-gray-500">₹{item.unitPrice} each</p>
            </div>
            <div className="text-center text-gray-700">{item.quantity}</div>
            <div className="text-right font-semibold">₹{item.total}</div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-end mb-16">
        <div className="w-80">
          <div className="flex justify-between py-3 text-gray-600">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between py-3 text-gray-600 border-b border-gray-200">
            <span>Tax ({taxRate}%)</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-4 text-2xl font-bold" style={{ color: settings.accentColor }}>
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-gray-200">
        <p className="text-xs font-bold mb-2 tracking-wider" style={{ color: settings.primaryColor }}>
          PAYMENT INFORMATION
        </p>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{bankDetails.bankName}</p>
          <p>Account: {bankDetails.accountName}</p>
          <p>Number: {bankDetails.accountNumber}</p>
        </div>
      </div>
    </div>
  );
}
