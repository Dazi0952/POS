import { useEffect, useState } from 'react';
import api from './api/axios';
import { 
  Container, Typography, Card, CardContent, CircularProgress, 
  Paper, List, ListItem, ListItemButton, ListItemText, Divider, Button, Box 
} from '@mui/material';

// Używamy zwykłego Grida tylko do kart produktów (to zazwyczaj działa stabilnie)
import Grid from '@mui/material/Grid';

// --- TYPY ---
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

function App() {
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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    // GŁÓWNY KONTENER - FLEXBOX ZAMIAST GRIDA
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: '#f4f6f8' }}>
      
      {/* --- LEWA KOLUMNA: MENU (flex: 1 oznacza "zajmij całą wolną przestrzeń") --- */}
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto', height: '100%' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a2027' }}>
          System POS: Pizzeria Mario
        </Typography>
        
        {menu?.categories.map((category) => (
          <Box key={category._id} mb={4}>
            <Typography variant="h5" color="primary" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1, mb: 2 }}>
              {category.name}
            </Typography>
            
            {/* GRID PRODUKTÓW - Tu używamy standardowego Grida */}
            <Grid container spacing={2}>
              {menu.products
                .filter((p) => p.categoryId === category._id)
                .map((product) => (
                  // Jeśli TS krzyczy o 'item', po prostu to zignoruj lub usuń 'item' - Grid i tak zadziała jako flex container
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

      {/* --- PRAWA KOLUMNA: KOSZYK (Szerokość na sztywno lub procentowo) --- */}
      <Box sx={{ width: { xs: '300px', md: '400px' }, borderLeft: '1px solid #e0e0e0', bgcolor: 'white', display: 'flex', flexDirection: 'column', height: '100%', zIndex: 10, boxShadow: -5 }}>
          
          {/* Nagłówek Koszyka */}
          <Box p={3} bgcolor="#1a2027" color="white">
            <Typography variant="h5" fontWeight="bold">Zamówienie</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>Stolik #5</Typography>
          </Box>

          {/* Lista */}
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

          {/* Podsumowanie */}
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
            >
              ZATWIERDŹ
            </Button>
          </Box>
      </Box>

    </Box>
  );
}

export default App;