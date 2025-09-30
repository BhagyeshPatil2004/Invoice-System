import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Eye, Send, Download, FileText, CheckCircle, XCircle } from "lucide-react";
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

const quotations = [
  {
    id: "QUO-001",
    clientName: "Acme Corporation",
    amount: 2500,
    status: "sent",
    issueDate: "2024-01-15",
    validUntil: "2024-02-15",
    description: "Web Development Services"
  },
  {
    id: "QUO-002", 
    clientName: "TechStart Inc",
    amount: 1750,
    status: "accepted",
    issueDate: "2024-01-18",
    validUntil: "2024-02-18",
    description: "UI/UX Design Package"
  },
  {
    id: "QUO-003",
    clientName: "Digital Agency Pro",
    amount: 3200,
    status: "declined",
    issueDate: "2024-01-05",
    validUntil: "2024-02-05",
    description: "SEO Optimization Services"
  },
  {
    id: "QUO-004",
    clientName: "Creative Studio Ltd",
    amount: 890,
    status: "draft",
    issueDate: "2024-01-20",
    validUntil: "2024-02-20",
    description: "Logo Design Project"
  }
];

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
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredQuotations = quotations.filter(quote => 
    quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = quotations.reduce((sum, quote) => sum + quote.amount, 0);
  const acceptedAmount = quotations.filter(q => q.status === 'accepted').reduce((sum, quote) => sum + quote.amount, 0);
  const pendingAmount = quotations.filter(q => q.status === 'sent').reduce((sum, quote) => sum + quote.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
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
          <Button className="hover-scale">
            <Plus className="h-4 w-4 mr-2" />
            Create Quotation
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">
              ${totalAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Quoted</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              ${acceptedAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              ${pendingAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">
              {quotations.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Quotations</p>
          </CardContent>
        </Card>
      </div>

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
              <Input 
                placeholder="Search quotations by ID, client, or description..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              Filter
            </Button>
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
                {filteredQuotations.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-accent/50 transition-colors">
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
                        ${quote.amount.toLocaleString()}
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Quotation
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Quotation
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Client
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-success">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Convert to Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredQuotations.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No quotations found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
