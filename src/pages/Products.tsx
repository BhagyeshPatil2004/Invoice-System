import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { ProductDialog } from "@/components/ProductDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function Products() {
    const { products, setProducts } = useData();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (product: any) => {
        setProductToEdit(product);
        setIsDialogOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            // Delete from Supabase
            const { error } = await supabase.from('products').delete().eq('id', deleteId);

            if (error) {
                toast({
                    title: "Delete Failed",
                    description: "Could not delete product from database.",
                    variant: "destructive",
                });
                return;
            }

            // Update local state
            setProducts(products.filter(p => p.id !== deleteId));
            setDeleteId(null);
            toast({
                title: "Success",
                description: "Product deleted successfully",
            });
        }
    };

    const handleCreate = () => {
        setProductToEdit(null);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400 text-glow">
                        Products & Services
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Manage your inventory and service offerings</p>
                </div>
                <Button onClick={handleCreate} className="hover-glow bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-medium">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <Card className="glass-panel border-0 bg-transparent">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Inventory List
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center mb-6">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/5 overflow-hidden overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="font-semibold text-gray-300 whitespace-nowrap">Name</TableHead>
                                    <TableHead className="font-semibold text-gray-300 whitespace-nowrap">Description</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-300 whitespace-nowrap">Price</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-300 whitespace-nowrap">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.length === 0 ? (
                                    <TableRow className="hover:bg-transparent border-white/5">
                                        <TableCell colSpan={4} className="h-40 text-center text-gray-500">
                                            {searchTerm ? "No products found matching your search" : "No products added yet. Click 'Add Product' to get started."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id} className="hover:bg-white/5 transition-colors border-white/5">
                                            <TableCell className="font-medium text-gray-200 whitespace-nowrap">{product.name}</TableCell>
                                            <TableCell className="max-w-[300px] truncate text-gray-400" title={product.description}>{product.description}</TableCell>
                                            <TableCell className="text-right font-bold text-success whitespace-nowrap">₹{product.price.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(product.id)} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <ProductDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                productToEdit={productToEdit}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product from your inventory.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
