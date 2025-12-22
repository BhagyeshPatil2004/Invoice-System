import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productToEdit?: any;
}

export function ProductDialog({ open, onOpenChange, productToEdit }: ProductDialogProps) {
    const { products, setProducts } = useData();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
    });

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                description: productToEdit.description,
                price: productToEdit.price.toString(),
            });
        } else {
            setFormData({
                name: "",
                description: "",
                price: "",
            });
        }
    }, [productToEdit, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        const price = parseFloat(formData.price);
        if (isNaN(price)) {
            toast({
                title: "Error",
                description: "Price must be a valid number",
                variant: "destructive",
            });
            return;
        }

        if (productToEdit) {
            const updatedProducts = products.map((p) =>
                p.id === productToEdit.id
                    ? { ...p, ...formData, price: price }
                    : p
            );
            setProducts(updatedProducts);
            toast({
                title: "Success",
                description: "Product updated successfully",
            });
        } else {
            const newProduct = {
                id: uuidv4(),
                ...formData,
                price: price,
            };
            setProducts([...products, newProduct]);
            toast({
                title: "Success",
                description: "Product created successfully",
            });
        }

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{productToEdit ? "Edit Product" : "Add Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Web Design Service"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Description for invoice"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Unit Price (₹) *</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit">{productToEdit ? "Save Changes" : "Create Product"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
