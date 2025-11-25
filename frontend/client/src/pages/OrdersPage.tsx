import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, CircularProgress, Stack 
} from '@mui/material';

// Importujemy ikony
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Importujemy Modale
import PaymentModal from '../components/PaymentModal';
import OrderDetailsModal from '../components/OrderDetailsModal'; // Importujemy też typ z modala

// --- TYPY ZGODNE Z BACKENDEM ---
// Zamiast definiować je ręcznie, użyjemy typu OrderDetails z modala, 
// ponieważ on ma już pełną strukturę (z details, ingredients itd.)
// Ale dla porządku w pliku, zdefiniuję je tutaj poprawnie:

interface DeliveryDetails {
    address?: string;
    phone?: string;
    scheduledTime?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  // TO JEST TO, CZEGO BRAKOWAŁO:
  details?: {
    variant?: string;
    ingredients: { name: string; quantity: number; isBase: boolean }[];
    comment?: string;
  };
}

interface Order {
  _id: string;
  tableNumber?: string;
  orderType?: string; // 'dine-in' | 'takeout' | 'delivery'
  deliveryDetails?: DeliveryDetails;
  totalAmount: number;
  status: 'kitchen' | 'ready' | 'closed';
  createdAt: string;
  items: OrderItem[]; 
}

export const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  // Stan Modala Płatności
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Stan Modala Szczegółów
  // Używamy 'any' przy rzutowaniu lub OrderDetails, żeby TypeScript nie marudził przy przekazywaniu propsów
  const [detailsOrder, setDetailsOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleRowClick = (order: Order) => {
    setDetailsOrder(order);
    setIsDetailsOpen(true);
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Błąd:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Odświeżaj co 10s
    return () => clearInterval(interval);
  }, []);

  // 1. Otwórz okno płatności
  const openPayment = (order: Order) => {
    setSelectedOrder(order);
    setIsPaymentOpen(true);
  };

  // 2. Zatwierdź płatność i zamknij zamówienie
  const handleConfirmPayment = async (method: 'cash' | 'card') => {
    if (!selectedOrder) return;

    try {
      await api.post(`/orders/${selectedOrder._id}/close`, {
          paymentMethod: method
      });
      
      fetchOrders(); // Odśwież listę
      setIsPaymentOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Błąd zamykania:', error);
      alert('Nie udało się zamknąć zamówienia.');
    }
  };

  // Filtrowanie
  const currentOrders = orders.filter(o => o.status !== 'closed');
  const archivedOrders = orders.filter(o => o.status === 'closed');
  const displayedOrders = tabValue === 0 ? currentOrders : archivedOrders;

  // Pomocnicze funkcje UI
  const getStatusChip = (status: string) => {
    const map: Record<string, any> = {
      'kitchen': { label: 'W Kuchni', color: 'warning' },
      'ready': { label: 'Gotowe', color: 'success' },
      'closed': { label: 'Zamknięte', color: 'default' }
    };
    const s = map[status] || { label: status, color: 'default' };
    return <Chip label={s.label} color={s.color} size="small" sx={{ fontWeight: 'bold' }} />;
  };

  const getOrderTypeIcon = (type?: string) => {
      switch(type) {
          case 'delivery': return <DeliveryDiningIcon color="warning" />;
          case 'takeout': return <ShoppingBagIcon color="info" />;
          default: return <RestaurantIcon color="success" />;
      }
  };

  const getOrderLabel = (order: Order) => {
      if (order.tableNumber) return `Stolik #${order.tableNumber}`;
      if (order.orderType === 'delivery') return 'Dostawa';
      if (order.orderType === 'takeout') return 'Wynos';
      return 'Inne';
  };

  if (loading) return <Box p={5} textAlign="center"><CircularProgress /></Box>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Zarządzanie Zamówieniami
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)} 
          indicatorColor="primary" 
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={`BIEŻĄCE (${currentOrders.length})`} sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
          <Tab label="ARCHIWUM" sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
        </Tabs>
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#263238' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Typ / Czas</TableCell>
              <TableCell sx={{ color: 'white' }}>Szczegóły (Adres/Stolik)</TableCell>
              <TableCell sx={{ color: 'white' }}>Zawartość</TableCell>
              <TableCell sx={{ color: 'white' }}>Kwota</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>Akcja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedOrders.map((order) => (
              <TableRow 
                key={order._id} 
                hover
                onClick={() => handleRowClick(order)}
                sx={{cursor: 'pointer'}}
              >
                
                {/* KOLUMNA 1: TYP I CZAS */}
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                    {getOrderTypeIcon(order.orderType)}
                    <Typography fontWeight="bold">{getOrderLabel(order)}</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Typography>
                </TableCell>

                {/* KOLUMNA 2: ADRES / CZAS DOSTAWY */}
                <TableCell>
                    {order.deliveryDetails ? (
                        <Box>
                            {order.deliveryDetails.address && (
                                <Typography variant="body2" fontWeight="bold">
                                    {order.deliveryDetails.address}
                                </Typography>
                            )}
                            {order.deliveryDetails.scheduledTime && (
                                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                    <AccessTimeIcon fontSize="small" color="action" />
                                    <Typography variant="caption" color="primary" fontWeight="bold">
                                        {order.deliveryDetails.scheduledTime}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                    )}
                </TableCell>

                {/* KOLUMNA 3: ZAWARTOŚĆ (SKRÓT) */}
                <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Pozycji: {order.items.reduce((acc, i) => acc + i.quantity, 0)}
                    </Typography>
                </TableCell>

                {/* KOLUMNA 4: KWOTA */}
                <TableCell>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {order.totalAmount.toFixed(2)} zł
                  </Typography>
                </TableCell>

                {/* KOLUMNA 5: STATUS */}
                <TableCell>
                  {getStatusChip(order.status)}
                </TableCell>

                {/* KOLUMNA 6: PRZYCISK */}
                <TableCell align="right">
  <Stack direction="row" spacing={1} justifyContent="flex-end">
      
      {/* PRZYCISK EDYCJI */}
      {order.status !== 'closed' && (
        <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
                e.stopPropagation();
                // Przenosimy do POS i przekazujemy całe zamówienie
                navigate('/pos', { state: { editOrder: order } });
            }}
        >
            EDYTUJ
        </Button>
      )}

      {/* PRZYCISK ROZLICZ (bez zmian) */}
      {order.status !== 'closed' && (
        <Button variant="contained" color="success" size="small" onClick={(e) => { e.stopPropagation(); openPayment(order); }}>
          ROZLICZ
        </Button>
      )}
  </Stack>
</TableCell>
              </TableRow>
            ))}
            
            {displayedOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography variant="h6" color="text.secondary">Brak zamówień</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL PŁATNOŚCI */}
      <PaymentModal 
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        order={selectedOrder}
        onConfirmPayment={handleConfirmPayment}
      />
      
      {/* MODAL SZCZEGÓŁÓW */}
      <OrderDetailsModal 
        open={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        order={detailsOrder} 
      />

    </Container>
  );
};