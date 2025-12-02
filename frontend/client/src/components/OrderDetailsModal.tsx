import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, Box, IconButton, Chip 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Definicja typu pojedynczego składnika
interface IngredientDetail {
    name: string;
    quantity: number;
    isBase: boolean;
}

// Typy zgodne z tym co wysyła backend
export interface OrderItem {
  name: string;
  categoryName: string;
  quantity: number;
  price: number;
  details?: {
    variant?: string;
    ingredients: IngredientDetail[];
    comment?: string;
  };
}

export interface OrderDetails {
  _id: string;
  dailyNumber?: number;
  tableNumber?: string;
  orderType?: string; // 'dine-in' | 'takeout' | 'delivery'
  deliveryDetails?: { 
      address?: string; 
      phone?: string; 
      scheduledTime?: string; 
      name?: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  orderComment?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  order: OrderDetails | null;
  onPay: () => void;
  onEdit: () => void;
}

export default function OrderDetailsModal({ open, onClose, order, onPay, onEdit }: Props) {
  if (!order) return null;

  const getIcon = () => {
    if (order.orderType === 'delivery') return <DeliveryDiningIcon fontSize="large" />;
    if (order.orderType === 'takeout') return <ShoppingBagIcon fontSize="large" />;
    return <RestaurantIcon fontSize="large" />;
  };

  const getTitle = () => {
   const num = order.dailyNumber ? `#${order.dailyNumber}` : '';
    
    if (order.tableNumber) return `Stolik ${order.tableNumber}`;
    if (order.orderType === 'delivery') return `Dostawa ${num}`;
    if (order.orderType === 'takeout') return `Wynos ${num}`;
    return `Zamówienie ${num}`;
  };

 return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      
      {/* NAGŁÓWEK */}
      <DialogTitle sx={{ bgcolor: '#263238', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          {getIcon()}
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                {getTitle()}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                ID: #{order._id.slice(-6)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        
        {/* SEKCJA 1: LOGISTYKA */}
        <Box mb={4} p={2} bgcolor="#f5f5f5" borderRadius={2} border="1px solid #e0e0e0">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">SZCZEGÓŁY REALIZACJI</Typography>
                <Chip label={order.status === 'closed' ? 'ZAMKNIĘTE' : 'W REALIZACJI'} color={order.status === 'closed' ? 'default' : 'warning'} size="small" />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                {/* Data */}
                <Box>
                    <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                        <EventIcon fontSize="small" />
                        <Typography variant="caption" fontWeight="bold">PRZYJĘTO:</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                        {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Typography>
                </Box>

                {/* Klient */}
                <Box>
                    <Box display="flex" alignItems="center" gap={0.5} color="text.primary">
                        <PersonIcon fontSize="small" />
                        <Typography variant="caption" fontWeight="bold">KLIENT:</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                        {order.deliveryDetails?.name || 'Anonim'}
                    </Typography>
                    <Typography variant="caption" display="block">
                        {order.deliveryDetails?.phone}
                    </Typography>
                </Box>

                {/* Adres / Czas */}
                <Box>
                    {order.deliveryDetails?.address && (
                        <>
                            <Box display="flex" alignItems="center" gap={0.5} color="error.main">
                                <LocationOnIcon fontSize="small" />
                                <Typography variant="caption" fontWeight="bold">ADRES:</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="bold" noWrap title={order.deliveryDetails.address}>
                                {order.deliveryDetails.address}
                            </Typography>
                        </>
                    )}
                    {order.deliveryDetails?.scheduledTime && (
                        <Box mt={0.5} display="flex" alignItems="center" gap={0.5} color="primary.main">
                            <AccessTimeIcon fontSize="small" />
                            <Typography variant="caption" fontWeight="bold">
                                {order.deliveryDetails.scheduledTime}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Komentarz */}
            {order.orderComment && (
                <Box mt={2} pt={1} borderTop="1px dashed #ccc">
                    <Typography variant="caption" color="warning.dark" fontWeight="bold">UWAGI: </Typography>
                    <Typography variant="body2" component="span">{order.orderComment}</Typography>
                </Box>
            )}
        </Box>

        {/* SEKCJA 2: POZYCJE */}
        <Box sx={{ bgcolor: '#fafafa', borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                {order.items.map((item, idx) => (
                    <Box 
                        key={idx} 
                        sx={{ 
                            borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #eee', 
                            p: 2,
                            bgcolor: 'white'
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            {/* LEWA STRONA: ILOŚĆ + NAZWA + DETALE */}
                            <Box>
                                {/* KATEGORIA (Mały tag nad nazwą) */}
                                {item.categoryName && (
                                    <Chip 
                                        label={item.categoryName.toUpperCase()} 
                                        size="small" 
                                        sx={{ 
                                            height: 16, 
                                            fontSize: '0.6rem', 
                                            mb: 0.5, 
                                            bgcolor: '#e0f7fa', 
                                            color: '#006064',
                                            fontWeight: 'bold',
                                            borderRadius: 1
                                        }} 
                                    />
                                )}
                                
                                <Box display="flex" alignItems="baseline" gap={1}>
                                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                                        {item.quantity}x
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {item.name}
                                    </Typography>
                                </Box>
                                
                                {/* WARIANT (np. 360g) */}
                                {item.details?.variant && (
                                    <Chip 
                                        label={item.details.variant} 
                                        size="small" 
                                        variant="outlined" 
                                        sx={{ mt: 0.5, height: 20, fontSize: '0.7rem', borderColor: '#999', color: '#666' }} 
                                    />
                                )}

                                {/* LISTA SKŁADNIKÓW */}
                                <Box mt={1} pl={1} borderLeft="2px solid #eee">
                                    {item.details?.ingredients?.filter(i => !i.isBase).map((ing, i) => (
                                        <Typography key={i} variant="body2" sx={{ color: '#2e7d32', fontWeight: '500', fontSize: '0.85rem' }}>
                                            + {ing.quantity > 1 ? `${ing.quantity}x ` : ''}{ing.name}
                                        </Typography>
                                    ))}
                                </Box>

                                {/* KOMENTARZ */}
                                {item.details?.comment && (
                                    <Typography variant="caption" display="block" sx={{ color: '#ed6c02', mt: 0.5, bgcolor: '#fff3e0', px: 0.5, borderRadius: 1, width: 'fit-content' }}>
                                        📝 {item.details.comment}
                                    </Typography>
                                )}
                            </Box>

                            {/* PRAWA STRONA: CENA */}
                            <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                                {(item.price * item.quantity).toFixed(2)} zł
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

        {/* SEKCJA 3: PODSUMOWANIE */}
        <Box mt={3} display="flex" justifyContent="flex-end" alignItems="center">
            <Typography variant="h6" sx={{ mr: 2, color: 'text.secondary' }}>RAZEM DO ZAPŁATY:</Typography>
            <Typography variant="h3" fontWeight="bold" color="primary">
                {order.totalAmount.toFixed(2)} zł
            </Typography>
        </Box>

      </DialogContent>

      {/* PRZYCISKI AKCJI (Zawsze widoczne na dole) */}
      <DialogActions sx={{ p: 3, bgcolor: '#fafafa', justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="inherit">ZAMKNIJ</Button>
        
        {order.status !== 'closed' ? (
            <Box display="flex" gap={2}>
                <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />} 
                    onClick={onEdit}
                >
                    EDYTUJ
                </Button>
                <Button 
                    variant="contained" 
                    color="success" 
                    size="large"
                    startIcon={<AttachMoneyIcon />} 
                    onClick={onPay}
                    sx={{ px: 4, fontWeight: 'bold' }}
                >
                    ROZLICZ
                </Button>
            </Box>
        ) : (
            <Button variant="outlined" disabled>ZAMÓWIENIE ZAMKNIĘTE</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}