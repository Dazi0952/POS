import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
   Typography, Card, CardContent, CircularProgress, 
   List, ListItem, ListItemButton, ListItemText, Divider, Button, Box 
} from '@mui/material';

import Grid from '@mui/material/Grid';

interface Product {
  _id: string;
  name: string;
  price: number;
  categoryId: string;
}

interface Category {
  _id: string;
  name: string;
}

interface MenuData {
  categories: Category[];
  products: Product[];
}

interface CartItem extends Product {
  cartId: string;
}

function PosPage() {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu');
        setMenu(response.data);
      } catch (error) {
        console.error('Błąd:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const addToCart = (product: Product) => {
    const newItem: CartItem = {
      ...product,
      cartId: Math.random().toString(36).substr(2, 9)
    };
    setCart([...cart, newItem]);
  };

  const removeFromCart = (cartIdToRemove: string) => {
    setCart(cart.filter(item => item.cartId !== cartIdToRemove));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

   const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const orderPayload = {
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1
        })),
        totalAmount: total
      };

      await api.post('/orders', orderPayload);

      alert('Zamówienie wysłane na kuchnię! 👨‍🍳');
      setCart([]);

    } catch (error) {
      console.error('Błąd zamówienia:', error);
      alert('Błąd połączenia z serwerem!');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: '#f4f6f8' }}>
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto', height: '100%' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a2027' }}>
          System POS: Pizzeria Mario
        </Typography>
        
        {menu?.categories.map((category) => (
          <Box key={category._id} mb={4}>
            <Typography variant="h5" color="primary" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1, mb: 2 }}>
              {category.name}
            </Typography>
            <Grid container spacing={2}>
              {menu.products
                .filter((p) => p.categoryId === category._id)
                .map((product) => (
                  <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer', 
                        height: '100%', 
                        minWidth: 150,
                        transition: '0.2s',
                        '&:hover': { transform: 'scale(1.02)', boxShadow: 6 },
                        bgcolor: 'white'
                      }}
                      onClick={() => addToCart(product)}
                    >
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 1 }}>
                          {product.name}
                        </Typography>
                        <Typography variant="h6" color="primary" align="right">
                          {product.price.toFixed(2)} zł
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        ))}
      </Box>
      <Box sx={{ width: { xs: '300px', md: '400px' }, borderLeft: '1px solid #e0e0e0', bgcolor: 'white', display: 'flex', flexDirection: 'column', height: '100%', zIndex: 10, boxShadow: -5 }}>
          <Box p={3} bgcolor="#1a2027" color="white">
            <Typography variant="h5" fontWeight="bold">Zamówienie</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>Stolik #5</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <List>
              {cart.map((item) => (
                <div key={item.cartId}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => removeFromCart(item.cartId)} sx={{ py: 2 }}>
                      <ListItemText 
                        primary={item.name} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                        secondary="Usuń"
                      />
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {item.price.toFixed(2)}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </div>
              ))}
              {cart.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.5, p: 2 }}>
                  <Typography variant="h4">🛒</Typography>
                  <Typography>Pusty koszyk</Typography>
                </Box>
              )}
            </List>
          </Box>
          <Box p={3} bgcolor="#f9fafb" borderTop="1px solid #e0e0e0">
            <Grid container justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color="text.secondary">SUMA:</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {total.toFixed(2)} zł
              </Typography>
            </Grid>
            <Button 
              variant="contained" 
              color="success" 
              fullWidth 
              size="large"
              sx={{ height: 55, fontSize: '1.1rem', fontWeight: 'bold' }}
              disabled={cart.length === 0}
              onClick={handleCheckout}
              >
              ZATWIERDŹ
            </Button>
          </Box>
      </Box>

    </Box>
  );
}

export default PosPage;