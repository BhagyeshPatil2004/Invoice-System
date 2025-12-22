interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  taxType: string;
  taxRate: number;
}

interface InvoiceData {
  id: string;
  clientName: string;
  clientAddress?: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  description: string;
  lineItems?: InvoiceItem[];
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
  };
  advancePayment?: number;
  balanceDue?: number;
}

import { useData } from "@/contexts/DataContext";

interface InvoiceTemplateProps {
  invoice: InvoiceData;
}

export default function InvoiceTemplate({ invoice }: InvoiceTemplateProps) {
  const { bankDetails: savedBankDetails, userProfile } = useData();
  // Use lineItems from invoice or create default from description
  const items = invoice.lineItems || [
    { description: invoice.description, quantity: 1, rate: invoice.amount, taxType: 'none', taxRate: 0 }
  ];

  // Calculate subtotal from line items
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

  // Calculate total tax from all items
  const totalTax = items.reduce((sum, item) => {
    if (item.taxType === 'none') return sum;
    return sum + ((item.quantity * item.rate * item.taxRate) / 100);
  }, 0);

  // Get tax breakdown
  const getTaxLabel = () => {
    const taxItems = items.filter(item => item.taxType !== 'none');
    if (taxItems.length > 0) {
      const firstTax = taxItems[0];
      return `Tax ${firstTax.taxRate}%`;
    }
    return 'Tax 0%';
  };

  const total = subtotal + totalTax;
  const advancePayment = invoice.advancePayment || 0;
  const balanceDue = total - advancePayment;

  const bankDetails = invoice.bankDetails && invoice.bankDetails.bankName
    ? invoice.bankDetails
    : savedBankDetails;

  return (
    <div className="w-full mx-auto bg-white shadow-lg" style={{ fontFamily: 'Arial, sans-serif', width: '210mm', minHeight: '297mm', padding: '20mm', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Company Info - Framed Design */}
      <div className="flex justify-between items-center mb-8 border-2 border-black rounded-lg p-6">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          {userProfile?.logo ? (
            <img
              src={userProfile.logo}
              alt="Company Logo"
              style={{ height: '80px', objectFit: 'contain', maxWidth: '200px' }}
            />
          ) : (
            <div className="h-20 w-20 bg-gray-100 flex items-center justify-center rounded text-gray-400 text-xs">
              No Logo
            </div>
          )}
        </div>

        {/* Middle: Company Details */}
        <div className="flex-grow px-8 text-center">
          <h2 className="font-extrabold text-4xl text-black mb-3 uppercase tracking-tight">{userProfile?.company || "Company Name"}</h2>
          <div className="text-sm text-black space-y-1">
            <p className="leading-snug font-medium">{userProfile?.address}</p>
            <div className="flex justify-center gap-4">
              <p><span className="font-semibold">Mobile:</span> {userProfile?.phone}</p>
              <p><span className="font-semibold">Email:</span> {userProfile?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To and Invoice Details */}
      <div className="flex justify-between mb-8 px-2">
        {/* Left: Bill To */}
        <div>
          <h3 className="font-bold text-lg text-black mb-2">Bill To:</h3>
          <div className="text-black">
            <p className="font-bold text-lg">{invoice.clientName}</p>
            {invoice.clientAddress && (
              <p className="whitespace-pre-line text-gray-800 mt-1">{invoice.clientAddress}</p>
            )}
          </div>
        </div>

        {/* Right: Invoice Details */}
        <div className="text-right">
          <h2 className="text-3xl font-bold text-black mb-4 tracking-wide">INVOICE</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-right">
            <span className="font-bold text-black text-lg">Invoice No :</span>
            <span className="text-black text-lg font-bold">{invoice.id}</span>

            <span className="font-bold text-black">Invoice Date :</span>
            <span className="text-black">{invoice.issueDate}</span>

            <span className="font-bold text-black">Due Date :</span>
            <span className="text-black">{invoice.dueDate}</span>
          </div>
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
            <div className="text-center text-gray-900">{item.rate}</div>
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

        {/* Bank Details */}
        {bankDetails && bankDetails.bankName && (
          <div className="mb-6">
            <h3 className="font-bold mb-2 text-gray-900">BANK DETAILS</h3>
            <p className="text-sm text-gray-700">Bank: {bankDetails.bankName}</p>
            <p className="text-sm text-gray-700">Account Name: {bankDetails.accountName}</p>
            <p className="text-sm text-gray-700">Account No.: {bankDetails.accountNumber}</p>
            {bankDetails.ifscCode && <p className="text-sm text-gray-700">IFSC Code: {bankDetails.ifscCode}</p>}
          </div>
        )}

        {/* Thank You Message */}
        <div className="text-right mt-8 pt-4">
          <h3 className="font-bold text-gray-900">THANK YOU</h3>
        </div>
      </div>
    </div>
  );
}
