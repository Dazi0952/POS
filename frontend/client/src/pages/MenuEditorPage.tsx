import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Container, Typography, Box, Paper, IconButton, Button, CircularProgress 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ProductFormModal from '../components/ProductFormModal';
import type { ProductData } from '../components/ProductFormModal';
// Typy (proste, do listy)
interface Product { _id: string; name: string; price: number; categoryId: string; }
interface Category { _id: string; name: string; }
interface MenuData { categories: Category[]; products: Product[]; }

export const MenuEditorPage = () => {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);

  const fetchMenu = async () => {
    try {
      const response = await api.get('/menu');
      setMenu(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleDelete = async (productId: string, productName: string) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć produkt: ${productName}?`)) return;

    try {
      await api.delete(`/menu/products/${productId}`);
      fetchMenu();
    } catch (error) {
      alert('Nie udało się usunąć produktu.');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product); // Tryb edycji, ładujemy dane
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
      setEditingProduct(null);
      setIsModalOpen(true);
  };

  const handleSaveProduct = async (data: ProductData) => {
    try {
        if (data._id) {
            // Edycja (PUT)
            await api.put(`/menu/products/${data._id}`, data);
        } else {
            // Nowy (POST)
            await api.post('/menu/products', data);
        }
        fetchMenu(); // Odśwież listę
        setIsModalOpen(false);
    } catch (error) {
        console.error(error);
        alert('Błąd zapisu produktu');
    }
};

  

  if (loading) return <Box p={5} textAlign="center"><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Zarządzanie Menu</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddProduct}>
            DODAJ PRODUKT
        </Button>
      </Box>

      {menu?.categories.map((category) => (
        <Paper key={category._id} sx={{ p: 3, mb: 4, bgcolor: '#fafafa' }}>
          {/* Nagłówek Kategorii */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} borderBottom="1px solid #ddd" pb={1}>
            <Typography variant="h5" fontWeight="bold" color="primary">
                {category.name}
            </Typography>
            <Button size="small" color="inherit">Edytuj Kategorię</Button>
          </Box>

          {/* Lista Produktów w Kategorii */}
          <Box>
            {menu.products
              .filter(p => p.categoryId === category._id)
              .map((product) => (
                <Box 
                    key={product._id} 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    bgcolor="white" 
                    p={2} 
                    mb={1} 
                    borderRadius={1} 
                    boxShadow={1}
                >
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cena bazowa: {product.price.toFixed(2)} zł
                        </Typography>
                    </Box>
                    
                    <Box>
                        <IconButton color="primary" onClick={() => handleEdit(product)} sx={{ mr: 1 }}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(product._id, product.name)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            ))}
            
            {menu.products.filter(p => p.categoryId === category._id).length === 0 && (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">Brak produktów w tej kategorii</Typography>
            )}
          </Box>
        </Paper>
      ))}
      <ProductFormModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editingProduct}
        categories={menu?.categories || []}
      />
    </Container>
  );
};