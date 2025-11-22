import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
   Typography, Card, CardContent, CircularProgress, 
   List, ListItem, Divider, Button, Box, Chip, Stack, IconButton 
} from '@mui/material';
// UWAGA: Brak importu Grid! Używamy Box z display="grid"

import { useLocation } from 'react-router-dom';
import ProductModal from '../components/ProductModal';
import type { Product, CartItemPayload } from '../components/ProductModal';

// Ikony
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import TapasIcon from '@mui/icons-material/Tapas'; 
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// --- TYPY ---
interface Category {
  _id: string;
  name: string;
}

interface MenuData {
  categories: Category[];
  products: Product[];
}

interface CartItem {
  _id: string;
  cartId: string;
  name: string;     
  basePrice: number; 
  totalPrice: number; 
  quantity: number;
  details?: {       
    variant?: string; 
    ingredients: { name: string, quantity: number, isBase: boolean }[];
    comment: string;
  };
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('pizza') || n.includes('pizze')) return <LocalPizzaIcon />;
  if (n.includes('burger')) return <LunchDiningIcon />;
  if (n.includes('napoj') || n.includes('drink')) return <LocalDrinkIcon />;
  return <TapasIcon />;
};

function PosPage() {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(''); 
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const tableInfo = location.state as { tableId: string; tableNumber: string } | null;
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu');
        setMenu(response.data);
        if (response.data.categories.length > 0) {
          setActiveCategory(response.data.categories[0]._id);
        }
      } catch (error) {
        console.error('Błąd:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddFromModal = (payload: CartItemPayload) => {
    const { product, selectedVariant, selectedIngredients, comment, finalPrice } = payload;
    
    const newItem: CartItem = {
      _id: product._id,
      cartId: Math.random().toString(36).substr(2, 9),
      name: product.name,
      basePrice: finalPrice,
      totalPrice: finalPrice,
      quantity: 1,
      details: {
        variant: selectedVariant?.name,
        ingredients: selectedIngredients,
        comment: comment
      }
    };

    setCart([...cart, newItem]);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { 
          ...item, 
          quantity: newQty,
          totalPrice: item.basePrice * newQty 
        };
      }
      return item;
    }));
  };

  const removeFromCart = (cartIdToRemove: string) => {
    setCart(cart.filter(item => item.cartId !== cartIdToRemove));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const orderPayload = {
        items: cart.map(item => ({
          productId: item._id,
          name: item.details?.variant ? `${item.name} ${item.details.variant}` : item.name,
          price: item.basePrice,
          quantity: item.quantity,
        })),
        totalAmount: cartTotal,
        tableNumber: tableInfo?.tableNumber
      };

      await api.post('/orders', orderPayload);
      alert(`Zamówienie dla stolika ${tableInfo ? tableInfo.tableNumber : 'Szybkie'} wysłane!`);
      setCart([]);
    } catch (error) {
      console.error('Błąd:', error);
      alert('Błąd połączenia!');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: '#f4f6f8' }}>
      
      {/* ================= LEWA STRONA (MENU) ================= */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* HEADER - Kategorie Sticky */}
        <Box p={2} bgcolor="white" borderBottom="1px solid #ddd" sx={{ zIndex: 10 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
             <Typography variant="h5" fontWeight="bold" color="#1a2027">
               Pizzeria Mario
             </Typography>
             <Chip 
               label={tableInfo ? `Stolik #${tableInfo.tableNumber}` : 'Na Wynos'} 
               color={tableInfo ? "primary" : "secondary"} 
               sx={{ fontWeight: 'bold' }}
             />
          </Box>

          {/* Lista Kategorii (Pozioma) */}
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
            {menu?.categories.map(cat => (
              <Chip 
                key={cat._id}
                icon={getCategoryIcon(cat.name)}
                label={cat.name}
                onClick={() => scrollToCategory(cat._id)}
                color={activeCategory === cat._id ? "primary" : "default"}
                variant={activeCategory === cat._id ? "filled" : "outlined"}
                clickable
                sx={{ fontWeight: 'bold', px: 1 }}
              />
            ))}
          </Stack>
        </Box>
        
        {/* LISTA PRODUKTÓW (SCROLLABLE) */}
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto', bgcolor: '#f0f2f5' }}>
          {menu?.categories.map((category) => (
            <Box key={category._id} id={category._id} mb={5} sx={{ scrollMarginTop: '140px' }}>
              <Typography variant="h5" fontWeight="bold" color="text.secondary" gutterBottom sx={{ borderLeft: '5px solid #1976d2', pl: 2, mb: 3 }}>
                {category.name}
              </Typography>
              
              {/* ZASTĄPIENIE GRID -> CSS GRID W BOX */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: {
                  xs: '1fr',          // Telefon
                  sm: '1fr 1fr',      // Tablet mały
                  md: '1fr 1fr 1fr',  // Tablet duży / Laptop
                  lg: '1fr 1fr 1fr 1fr' // Desktop
                },
                gap: 2 
              }}>
                {menu.products
                  .filter((p) => p.categoryId === category._id)
                  .map((product) => (
                      <Card 
                        key={product._id}
                        sx={{ 
                          cursor: 'pointer', 
                          display: 'flex', flexDirection: 'column',
                          transition: '0.2s',
                          border: '1px solid transparent',
                          '&:hover': { transform: 'translateY(-4px)', boxShadow: 6, borderColor: '#1976d2' },
                          bgcolor: 'white',
                          borderRadius: 3,
                          height: '100%', // Żeby karty były równe
                          minHeight: 140
                        }}
                        onClick={() => handleProductClick(product)}
                      >
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Box>
                             <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.1, mb: 1, fontSize: '1.1rem' }}>
                               {product.name}
                             </Typography>
                             <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {product.hasVariants ? "Wybierz rozmiar" : "Standard"}
                             </Typography>
                          </Box>
                          
                          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                             <Box sx={{ opacity: 0.1, color: 'primary.main', transform: 'scale(1.5)' }}>
                                {getCategoryIcon(category.name)}
                             </Box>

                             <Typography variant="h6" color="primary" fontWeight="bold">
                               {product.hasVariants && product.variants.length > 0 
                                 ? <span style={{fontSize: '0.7em', color: '#666'}}>od </span> 
                                 : ''
                               }
                               {(product.hasVariants && product.variants.length > 0 ? product.variants[0].price : product.price).toFixed(2)}
                               <span style={{fontSize: '0.7em'}}> zł</span>
                             </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                  ))}
              </Box>
            </Box>
          ))}
          <Box height={100} /> 
        </Box>
      </Box>

      {/* ================= PRAWA STRONA (KOSZYK) ================= */}
      <Box sx={{ width: { xs: '320px', md: '420px' }, borderLeft: '1px solid #ddd', bgcolor: 'white', display: 'flex', flexDirection: 'column', height: '100%', zIndex: 20, boxShadow: -10 }}>
          
          <Box p={2} bgcolor="#1a2027" color="white" display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">Zamówienie</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>{new Date().toLocaleTimeString().slice(0,5)}</Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
            <List disablePadding>
              {cart.map((item) => (
                <ListItem 
                  key={item.cartId} 
                  disablePadding 
                  sx={{ 
                      borderBottom: '1px dashed #eee', 
                      display: 'block', 
                      p: 2,
                      '&:hover': { bgcolor: '#fafafa' }
                  }}
              >
                  {/* GÓRA: Nazwa + Wariant + Cena */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                      <Box>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2, fontSize: '1rem' }} color='black'>
                              {item.name}
                          </Typography>
                          {/* Wariant (np. 32cm) wyświetlamy jako Chip obok nazwy lub pod nią */}
                          {item.details?.variant && (
                              <Chip 
                                label={item.details.variant} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                                sx={{ height: 20, fontSize: '0.7rem', mt: 0.5, fontWeight: 'bold', border: '1px solid #1976d2' }} 
                              />
                          )}
                      </Box>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          {item.totalPrice.toFixed(2)} zł
                      </Typography>
                  </Box>

                  {/* ŚRODEK: Tylko dodatki (nie bazowe) */}
                  {item.details && (
                      <Box mt={1} mb={1} pl={1} borderLeft="2px solid #eee">
                          {item.details.ingredients
                              .filter(ing => !ing.isBase) // <--- FILTROWANIE: Pokaż tylko NIE-BAZOWE
                              .map((ing, idx) => (
                              <Typography key={idx} variant="caption" display="block" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                  + {ing.quantity > 1 ? `${ing.quantity}x ` : ''}{ing.name}
                              </Typography>
                          ))}
                          
                          {/* Jeśli ktoś wziął podwójny składnik bazowy (np. 2x Ser), też warto to pokazać */}
                          {item.details.ingredients
                              .filter(ing => ing.isBase && ing.quantity > 1)
                              .map((ing, idx) => (
                              <Typography key={`extra-${idx}`} variant="caption" display="block" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                  + Extra {ing.name}
                              </Typography>
                          ))}

                          {item.details.comment && (
                              <Typography variant="caption" display="block" sx={{ color: '#ed6c02', fontStyle: 'italic', mt: 0.5 }}>
                                  Notatka: "{item.details.comment}"
                              </Typography>
                          )}
                      </Box>
                  )}

                  {/* DÓŁ: Ilość +/- i Kosz */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1.5}>
                      <Box display="flex" alignItems="center" bgcolor="#f5f5f5" borderRadius={1}>
                          <IconButton size="small" onClick={() => updateQuantity(item.cartId, -1)} disabled={item.quantity <= 1} sx={{ p: 0.5 }}>
                              <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ mx: 1.5, fontWeight: 'bold', minWidth: 15, textAlign: 'center', fontSize: '0.9rem' , color: 'black'}}>
                              {item.quantity}
                          </Typography>
                          <IconButton size="small" onClick={() => updateQuantity(item.cartId, 1)} sx={{ p: 0.5 }}>
                              <AddIcon fontSize="small" />
                          </IconButton>
                      </Box>

                      <IconButton size="small" color="error" onClick={() => removeFromCart(item.cartId)}>
                          <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                  </Box>
              </ListItem>
              ))}
              
              {cart.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.4 }}>
                  <LunchDiningIcon sx={{ fontSize: 60, mb: 1 }} />
                  <Typography variant="h6">Koszyk jest pusty</Typography>
                  <Typography variant="body2">Wybierz produkty z menu</Typography>
                </Box>
              )}
            </List>
          </Box>

          {/* PODSUMOWANIE */}
          <Box p={3} bgcolor="#fff" borderTop="2px solid #eee">
            <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography color="text.secondary">Suma częściowa:</Typography>
                <Typography fontWeight="bold">{cartTotal.toFixed(2)} zł</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h5" fontWeight="bold">DO ZAPŁATY:</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {cartTotal.toFixed(2)} zł
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="success" 
              fullWidth 
              size="large"
              sx={{ height: 60, fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 2 }}
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              ZATWIERDŹ ZAMÓWIENIE
            </Button>
          </Box>
      </Box>

      <ProductModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
        onAddToCart={handleAddFromModal} 
      />
    </Box>
  );
}

export default PosPage;