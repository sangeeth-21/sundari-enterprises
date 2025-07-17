
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  brand_id: string;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  price: string;
  stock_in: string;
  stock_out: string;
  remaining_stock: string;
  created_at: string;
  updated_at: string;
  brand_name: string;
}

export interface CreateProductData {
  brand_id: number;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  initial_stock: number;
}

export interface UpdateProductData {
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

const API_BASE_URL = 'https://api.specd.in/sundarienterprises/index.php';

export const useProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchProducts = async (): Promise<Product[]> => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: {
        'X-User-ID': user.id.toString(),
      },
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch products');
    return data.data;
  };

  const fetchProduct = async (id: string): Promise<Product> => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: {
        'X-User-ID': user.id.toString(),
      },
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch product');
    return data.data;
  };

  const createProduct = async (productData: CreateProductData): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': user.id.toString(),
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to create product');
  };

  const updateProduct = async ({ id, ...productData }: UpdateProductData & { id: string }): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': user.id.toString(),
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update product');
  };

  const deleteProduct = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'X-User-ID': user.id.toString(),
      },
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete product');
  };

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    enabled: !!user,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
    fetchProduct,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
};
