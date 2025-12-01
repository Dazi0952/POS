import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
   Typography, Card, CardContent, CircularProgress, 
   List, ListItem, Divider, Button, Box, Chip, Stack, IconButton, TextField, ToggleButton, ToggleButtonGroup 
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate do przekierowań

// Ikony
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import TapasIcon from '@mui/icons-material/Tapas'; 
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EditIcon from '@mui/icons-material/Edit'; // Ikona edycji

import ProductModal from '../components/ProductModal';
import OrderSettingsModal from '../components/OrderSettingsModal';
import type { OrderSettings } from '../components/OrderSettingsModal';
import type { Product, CartItemPayload } from '../components/ProductModal';
interface Category { _id: string; name: string; }
interface MenuData { categories: Category[]; products: Product[]; }

interface CartItem {
  _id: string; cartId: string; name: string; basePrice: number; totalPrice: number; quantity: number;
  productId: string; 
  details?: { variant?: string; ingredients: { name: string, quantity: number, isBase: boolean }[]; comment: string; };
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('pizza') || n.includes('pizze')) return <LocalPizzaIcon />;
  if (n.includes('burger')) return <LunchDiningIcon />;
  if (n.includes('napoj') || n.includes('drink')) return <LocalDrinkIcon />;
  return <TapasIcon />;
};

function PosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(''); 
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCartId, setEditingCartId] = useState<string | null>(null);

  const [orderSettings, setOrderSettings] = useState<OrderSettings | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsMode, setSettingsMode] = useState<'takeout' | 'delivery'>('takeout');
  const [globalComment, setGlobalComment] = useState('');

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const stateInfo = location.state as { 
      tableId?: string; 
      tableNumber?: string;
      editOrder?: any; 
  } | null;
  
  useEffect(() => {
    const init = async () => {
      try {
        const response = await api.get('/menu');
        setMenu(response.data);
        if (response.data.categories.length > 0) setActiveCategory(response.data.categories[0]._id);

        if (stateInfo?.editOrder) {
            const oldOrder = stateInfo.editOrder;
            setEditingOrderId(oldOrder._id);
            setGlobalComment(oldOrder.orderComment || '');
            
            if (oldOrder.deliveryDetails) {
                setOrderSettings({
                    type: oldOrder.orderType,
                    ...oldOrder.deliveryDetails,
                    timeType: 'fixed',
                    timeValue: oldOrder.deliveryDetails.scheduledTime
                });
            }

            const restoredCart = oldOrder.items.map((item: any) => ({
                _id: item.productId,
                productId: item.productId,
                cartId: Math.random().toString(),
                name: item.name.split(' 32cm')[0].split(' 43cm')[0], 
                basePrice: item.price,
                totalPrice: item.price * item.quantity,
                quantity: item.quantity,
                details: item.details
            }));
            setCart(restoredCart);
        }

      } catch (error) { console.error('Błąd:', error); } finally { setLoading(false); }
    };
    init();
  }, []);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEditItem = (item: CartItem) => {
    const productDef = menu?.products.find(p => p._id === item.productId);
    if (!productDef) return;
    setSelectedProduct(productDef);
    setEditingCartId(item.cartId);
    setIsModalOpen(true);
  };

  const handleProductClick = (product: Product) => { 
      setEditingCartId(null);
      setSelectedProduct(product); 
      setIsModalOpen(true); 
  };

  const handleAddFromModal = (payload: CartItemPayload) => {
    const { product, selectedVariant, selectedIngredients, comment, finalPrice } = payload;
    
    const newItem: CartItem = {
      _id: product._id, 
      productId: product._id,
      cartId: editingCartId || Math.random().toString(36).substr(2, 9),
      name: product.name, 
      basePrice: finalPrice, 
      totalPrice: finalPrice, 
      quantity: 1,
      details: { variant: selectedVariant?.name, ingredients: selectedIngredients, comment: comment }
    };

    if (editingCartId) {
        setCart(prev => prev.map(item => item.cartId === editingCartId ? { ...newItem, quantity: item.quantity, totalPrice: newItem.basePrice * item.quantity } : item));
        setEditingCartId(null);
    } else {
        setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, totalPrice: item.basePrice * newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => setCart(cart.filter(i => i.cartId !== id));
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const openOrderSettings = (mode: 'takeout' | 'delivery') => {
    setSettingsMode(mode);
    setIsSettingsModalOpen(true);
  };

  const handleSaveSettings = (settings: OrderSettings) => {
    setOrderSettings(settings);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!stateInfo?.tableNumber && !orderSettings) {
      alert('Wybierz WYNOS lub DOWÓZ!');
      return;
    }

    try {
      const orderPayload = {
        items: cart.map(item => ({
          productId: item.productId,
          name: item.details?.variant ? `${item.name} ${item.details.variant}` : item.name,
          price: item.basePrice,
          quantity: item.quantity,
          details: item.details
        })),
        totalAmount: cartTotal,
        userId: localStorage.getItem('pos_user_id'),
        tableNumber: stateInfo?.tableNumber,
        orderType: stateInfo?.tableNumber ? 'dine-in' : orderSettings?.type,
        orderComment: globalComment,
        deliveryDetails: orderSettings ? {
            name: orderSettings.name,
            address: orderSettings.address,
            phone: orderSettings.phone,
            scheduledTime: orderSettings.timeType === 'delta' 
                ? `Za ${orderSettings.timeValue} min` 
                : `Na godz. ${orderSettings.timeValue}`
        } : undefined
      };

      if (editingOrderId) {
          await api.post('/orders', orderPayload); // W wersji produkcyjnej użyłbyś PUT
          alert('Zamówienie zaktualizowane (jako nowe)!');
      } else {
          await api.post('/orders', orderPayload);
          alert('Zamówienie przyjęte!');
      }

      setCart([]);
      setOrderSettings(null);
      setGlobalComment('');
      navigate('/orders');
    } catch (error) {
      console.error('Błąd:', error);
      alert('Błąd połączenia!');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: '#f4f6f8' }}>
      
      {/* LEWA STRONA */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Box p={2} bgcolor="white" borderBottom="1px solid #ddd" sx={{ zIndex: 10 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
             <Typography variant="h5" fontWeight="bold" color="#1a2027">Pizzeria Mario</Typography>
             {stateInfo?.tableNumber && <Chip icon={<RestaurantIcon />} label={`Stolik #${stateInfo.tableNumber}`} color="success" sx={{ fontWeight: 'bold', px: 1 }} />}
          </Box>
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
            {menu?.categories.map(cat => (
              <Chip key={cat._id} icon={getCategoryIcon(cat.name)} label={cat.name} onClick={() => scrollToCategory(cat._id)}
                color={activeCategory === cat._id ? "primary" : "default"} variant={activeCategory === cat._id ? "filled" : "outlined"}
                clickable sx={{ fontWeight: 'bold', px: 1 }}
              />
            ))}
          </Stack>
        </Box>
        
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto', bgcolor: '#f0f2f5' }}>
          {menu?.categories.map((category) => (
            <Box key={category._id} id={category._id} mb={5} sx={{ scrollMarginTop: '140px' }}>
              <Typography variant="h5" fontWeight="bold" color="text.secondary" gutterBottom sx={{ borderLeft: '5px solid #1976d2', pl: 2, mb: 3 }}>{category.name}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
  {menu.products
    .filter((p) => p.categoryId === category._id)
    .map((product) => {
      
      // --- BEZPIECZNE OBLICZANIE CENY (FIX BŁĘDU) ---
      let displayPrice = 0;
      let hasVariants = false;

      if (product.hasVariants && product.variants && product.variants.length > 0) {
          displayPrice = product.variants[0].price || 0;
          hasVariants = true;
      } else {
          displayPrice = product.price || 0;
      }
      // -----------------------------------------------

      return (
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
            height: '100%', 
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
                  {hasVariants ? "Wybierz wariant" : "Standard"}
                </Typography>
            </Box>
            
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Box sx={{ opacity: 0.1, color: 'primary.main', transform: 'scale(1.5)' }}>
                  {getCategoryIcon(category.name)}
                </Box>

                <Typography variant="h6" color="primary" fontWeight="bold">
                  {hasVariants ? <span style={{fontSize: '0.7em', color: '#666'}}>od </span> : ''}
                  {/* Używamy bezpiecznej zmiennej displayPrice */}
                  {displayPrice.toFixed(2)}
                  <span style={{fontSize: '0.7em'}}> zł</span>
                </Typography>
            </Box>
          </CardContent>
        </Card>
      );
  })}
</Box>
            </Box>
          ))}
          <Box height={100} /> 
        </Box>
      </Box>

      {/* PRAWA STRONA */}
      <Box sx={{ width: { xs: '340px', md: '450px' }, borderLeft: '1px solid #ddd', bgcolor: 'white', display: 'flex', flexDirection: 'column', height: '100%', zIndex: 20, boxShadow: -10 }}>
          
          <Box p={2} bgcolor="#1a2027" color="white" display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">{editingOrderId ? 'Edycja Zamówienia' : 'Nowe Zamówienie'}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>{new Date().toLocaleTimeString().slice(0,5)}</Typography>
          </Box>
          
          <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
            <List disablePadding>
              {cart.map((item) => (
                <ListItem key={item.cartId} disablePadding sx={{ color: 'black', borderBottom: '1px dashed #eee', display: 'block', p: 2, '&:hover': { bgcolor: '#fafafa' } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2, fontSize: '1rem' }}>{item.name}</Typography>
                            {item.details?.variant && (<Chip label={item.details.variant} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', mt: 0.5, fontWeight: 'bold', border: '1px solid #1976d2' }} />)}
                        </Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">{item.totalPrice.toFixed(2)} zł</Typography>
                    </Box>
                    {item.details && (
                        <Box mt={1} mb={1} pl={1} borderLeft="2px solid #eee">
                            {item.details.ingredients.filter(ing => !ing.isBase).map((ing, idx) => (
                                <Typography key={idx} variant="caption" display="block" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>+ {ing.quantity > 1 ? `${ing.quantity}x ` : ''}{ing.name}</Typography>
                            ))}
                            {item.details.ingredients.filter(ing => ing.isBase && ing.quantity > 1).map((ing, idx) => (
                                <Typography key={`extra-${idx}`} variant="caption" display="block" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>+ Extra {ing.name}</Typography>
                            ))}
                            {item.details.ingredients
                              .filter(ing => ing.isBase && ing.quantity === 0)
                              .map((ing, idx) => (
                              <Typography key={`remove-${idx}`} variant="caption" display="block" sx={{ color: '#d32f2f', textDecoration: 'line-through', opacity: 0.8 }}>
                                  - {ing.name}
                              </Typography>
                            ))}
                            {item.details.comment && (<Typography variant="caption" display="block" sx={{ color: '#ed6c02', fontStyle: 'italic', mt: 0.5 }}>Notatka: "{item.details.comment}"</Typography>)}
                        </Box>
                    )}
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <IconButton size="small" color="primary" onClick={() => handleEditItem(item)} sx={{ bgcolor: '#e3f2fd' }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <Box display="flex" alignItems="center" bgcolor="#f5f5f5" borderRadius={1}>
                                <IconButton size="small" onClick={() => updateQuantity(item.cartId, -1)} disabled={item.quantity <= 1} sx={{ p: 0.5 }}><RemoveIcon fontSize="small" /></IconButton>
                                <Typography sx={{ color: 'black', mx: 1.5, fontWeight: 'bold', minWidth: 15, textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</Typography>
                                <IconButton size="small" onClick={() => updateQuantity(item.cartId, 1)} sx={{ p: 0.5 }}><AddIcon fontSize="small" /></IconButton>
                            </Box>
                        </Box>
                        <IconButton size="small" color="error" onClick={() => removeFromCart(item.cartId)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                    </Box>
                </ListItem>
              ))}
              {cart.length === 0 && (<Box sx={{ textAlign: 'center', mt: 10, opacity: 0.4 }}><LunchDiningIcon sx={{ fontSize: 60, mb: 1 }} /><Typography variant="h6">Koszyk jest pusty</Typography></Box>)}
            </List>
          </Box>

          <Box p={3} bgcolor="#fff" borderTop="2px solid #eee">
            
            {!stateInfo?.tableNumber && (
                <Box mb={2}>
                    <ToggleButtonGroup
                        color="primary"
                        value={settingsMode}
                        exclusive
                        onChange={(_, val) => { if(val) { setSettingsMode(val); openOrderSettings(val); } }}
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value="takeout" sx={{ fontWeight: 'bold' }}>🛍️ WYNOS</ToggleButton>
                        <ToggleButton value="delivery" sx={{ fontWeight: 'bold' }}>🚚 DOWÓZ</ToggleButton>
                    </ToggleButtonGroup>
                    
                    {orderSettings ? (
                        <Box bgcolor={orderSettings.type === 'delivery' ? '#fff3e0' : '#e3f2fd'} p={1} borderRadius={1} mb={2} onClick={() => setIsSettingsModalOpen(true)} sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" fontWeight="bold">
                                {orderSettings.type === 'delivery' ? `${orderSettings.address} (${orderSettings.timeValue})` : `Odbiór: ${orderSettings.timeValue}`}
                            </Typography>
                            <EditIcon fontSize="small" sx={{ fontSize: 16, opacity: 0.5 }} />
                        </Box>
                    ) : (
                        <Typography variant="caption" color="error" display="block" mb={2} align="center">Wybierz opcję powyżej!</Typography>
                    )}
                </Box>
            )}

            <TextField
                fullWidth
                size="small"
                label="Komentarz do zamówienia (dla kuchni/kierowcy)"
                value={globalComment}
                onChange={(e) => setGlobalComment(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Divider sx={{ mb: 2 }} />
            
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5" fontWeight="bold">RAZEM:</Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">{cartTotal.toFixed(2)} zł</Typography>
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
                ZATWIERDŹ {editingOrderId ? '(AKTUALIZUJ)' : ''}
            </Button>
          </Box>
      </Box>

      <ProductModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
        onAddToCart={handleAddFromModal} 
        initialValues={editingCartId ? cart.find(c => c.cartId === editingCartId)?.details?.variant ? {
            variantName: cart.find(c => c.cartId === editingCartId)?.details?.variant,
            ingredients: cart.find(c => c.cartId === editingCartId)?.details?.ingredients || [],
            comment: cart.find(c => c.cartId === editingCartId)?.details?.comment || ''
        } : undefined : undefined} 
      />
      
      <OrderSettingsModal 
        open={isSettingsModalOpen} 
        mode={settingsMode} 
        onClose={() => setIsSettingsModalOpen(false)} 
        onSave={handleSaveSettings}
        currentSettings={orderSettings || undefined}
      />
    </Box>
  );
}

export default PosPage;