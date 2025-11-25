import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, Box, IconButton, Chip, Stack 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';

// Typy zgodne z tym co wysyła backend
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  details?: {
    variant?: string;
    ingredients: { name: string; quantity: number; isBase: boolean }[];
    comment?: string;
  };
}

export interface OrderDetails {
  _id: string;
  tableNumber?: string;
  orderType?: string; // 'dine-in' | 'takeout' | 'delivery'
  deliveryDetails?: { 
      address?: string; 
      phone?: string; 
      scheduledTime?: string; 
  };
  totalAmount: number;
  status: string;
  createdAt: string; // Data przyjęcia
  items: OrderItem[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  order: OrderDetails | null;
}

export default function OrderDetailsModal({ open, onClose, order }: Props) {
    if (!order) return null;

  // Ikona w zależności od typu
  const getIcon = () => {
    if (order.orderType === 'delivery') return <DeliveryDiningIcon fontSize="large" />;
    if (order.orderType === 'takeout') return <ShoppingBagIcon fontSize="large" />;
    return <RestaurantIcon fontSize="large" />;
  };

  // Tytuł w zależności od typu
  const getTitle = () => {
    if (order.tableNumber) return `Stolik #${order.tableNumber}`;
    if (order.orderType === 'delivery') return 'Dostawa';
    if (order.orderType === 'takeout') return 'Na Wynos';
    return 'Zamówienie';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      
      {/* --- NAGŁÓWEK (Ciemny) --- */}
      <DialogTitle sx={{ bgcolor: '#263238', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          {getIcon()}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                {getTitle()}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                ID: #{order._id.slice(-6)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        
        {/* --- SEKCJA 1: DANE LOGISTYCZNE (Szary Box) --- */}
        <Box mb={4} p={2} bgcolor="#f5f5f5" borderRadius={2} border="1px solid #e0e0e0">
            <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" mb={1} textTransform="uppercase">
                Szczegóły Realizacji
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Czas przyjęcia */}
                <Box>
                    <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                        <EventIcon fontSize="small" />
                        <Typography variant="caption" fontWeight="bold">PRZYJĘTO:</Typography>
                    </Box>
                    <Typography variant="body2">
                        {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        <span style={{ fontSize: '0.8em', color: '#666', marginLeft: 4 }}>
                            ({new Date(order.createdAt).toLocaleDateString()})
                        </span>
                    </Typography>
                </Box>

                {/* Czas realizacji (Na kiedy) */}
                {(order.deliveryDetails?.scheduledTime) && (
                    <Box>
                        <Box display="flex" alignItems="center" gap={0.5} color="primary.main">
                            <AccessTimeIcon fontSize="small" />
                            <Typography variant="caption" fontWeight="bold">NA GODZINĘ:</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="bold" color="primary">
                            {order.deliveryDetails.scheduledTime}
                        </Typography>
                    </Box>
                )}

                {/* Adres (tylko dla dostawy) */}
                {order.deliveryDetails?.address && (
                    <Box>
                        <Box display="flex" alignItems="center" gap={0.5} color="error.main">
                            <LocationOnIcon fontSize="small" />
                            <Typography variant="caption" fontWeight="bold">ADRES:</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                            {order.deliveryDetails.address}
                        </Typography>
                    </Box>
                )}

                {/* Telefon */}
                {order.deliveryDetails?.phone && (
                    <Box>
                        <Box display="flex" alignItems="center" gap={0.5} color="success.main">
                            <PhoneIcon fontSize="small" />
                            <Typography variant="caption" fontWeight="bold">TELEFON:</Typography>
                        </Box>
                        <Typography variant="body2">
                            {order.deliveryDetails.phone}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>

        {/* --- SEKCJA 2: LISTA POZYCJI --- */}
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ borderBottom: '2px solid #eee', pb: 1 }}>
            Pozycje Zamówienia
        </Typography>
        
        <Stack spacing={2} mt={2}>
            {order.items.map((item, idx) => (
                <Box key={idx} sx={{ borderBottom: '1px dashed #eee', pb: 2 }}>
                    {/* Wiersz główny: Nazwa + Cena */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {item.quantity}x {item.name} 
                                {item.details?.variant && (
                                    <Chip label={item.details.variant} size="small" variant="outlined" color="primary" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
                                )}
                            </Typography>
                        </Box>
                        <Typography fontWeight="bold">
                            {(item.price * item.quantity).toFixed(2)} zł
                        </Typography>
                    </Box>

                    {/* Szczegóły: Składniki i Komentarze */}
                    {item.details && (
                        <Box mt={0.5} ml={2} pl={1} borderLeft="3px solid #eee">
                            {/* Wypisujemy składniki (tylko te płatne/dodane, isBase=false) */}
                            {item.details.ingredients?.filter(ing => !ing.isBase).map((ing, i) => (
                                <Typography key={i} variant="body2" color="success.main" fontWeight="medium">
                                    + {ing.quantity > 1 ? `${ing.quantity}x ` : ''}{ing.name}
                                </Typography>
                            ))}
                            
                            {/* Ewentualnie podwójne składniki bazowe */}
                            {item.details.ingredients?.filter(ing => ing.isBase && ing.quantity > 1).map((ing, i) => (
                                <Typography key={`base-${i}`} variant="body2" color="success.main" fontWeight="medium">
                                    + Extra {ing.name}
                                </Typography>
                            ))}

                            {/* USUNIĘTE (NOWE) */}
                            {item.details.ingredients?.filter(ing => ing.isBase && ing.quantity === 0).map((ing, i) => (
                                <Typography key={`del-${i}`} variant="body2" color="error.main" sx={{ textDecoration: 'line-through' }}>
                                    - {ing.name}
                                </Typography>
                            ))}

                            {/* Komentarz */}
                            {item.details.comment && (
                                <Typography variant="body2" sx={{ color: '#ed6c02', fontStyle: 'italic', mt: 0.5 }}>
                                    Uwaga: "{item.details.comment}"
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            ))}
        </Stack>

        {/* --- SEKCJA 3: PODSUMOWANIE --- */}
        <Box mt={4} p={2} bgcolor="#fafafa" borderRadius={2} display="flex" justifyContent="flex-end" alignItems="center">
            <Typography variant="h6" sx={{ mr: 2, color: 'text.secondary' }}>RAZEM DO ZAPŁATY:</Typography>
            <Typography variant="h4" fontWeight="bold" color="primary">
                {order.totalAmount.toFixed(2)} zł
            </Typography>
        </Box>

      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" size="large" color="inherit">
            ZAMKNIJ OKNO
        </Button>
      </DialogActions>
    </Dialog>
  );
}