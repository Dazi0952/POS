import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, 
  Button, CircularProgress, Card, CardContent, Chip, Divider 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Ikony
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimerIcon from '@mui/icons-material/Timer';

import PaymentModal from '../components/PaymentModal';
import OrderDetailsModal from '../components/OrderDetailsModal';
interface Order {
  _id: string;
  dailyNumber?: number;
  tableNumber?: string;
  orderType?: string;
  deliveryDetails?: { address?: string; phone?: string; scheduledTime?: string; name?: string };
  totalAmount: number;
  status: 'kitchen' | 'ready' | 'closed';
  createdAt: string;
  items: any[]; 
}

export const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [now, setNow] = useState(new Date());

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) { console.error('Błąd:', error); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Szybsze odświeżanie
    const timerInterval = setInterval(() => setNow(new Date()), 60000);
    return () => {
        clearInterval(interval);
        clearInterval(timerInterval);
    };
  }, []);

  // --- ULEPSZONE OBLICZANIE CZASU ---
  const getRemainingTime = (order: Order) => {
      const scheduled = order.deliveryDetails?.scheduledTime;
      if (!scheduled) return null;

      let targetTime = new Date();
      let label = "";

      // 1. Format "Za X min"
      if (scheduled.toLowerCase().includes("za")) {
          const minutesToAdd = parseInt(scheduled.replace(/\D/g, '')) || 0;
          const createdAt = new Date(order.createdAt);
          targetTime = new Date(createdAt.getTime() + minutesToAdd * 60000);
      } 
      // 2. Format "HH:MM"
      else if (scheduled.includes(":")) {
          const timePart = scheduled.match(/(\d{2}):(\d{2})/);
          if (timePart) {
              const [_, h, m] = timePart;
              targetTime.setHours(parseInt(h), parseInt(m), 0, 0);
              label = "Na godz. ";
          }
      } else {
          return scheduled; // Inny tekst
      }

      const diffMs = targetTime.getTime() - now.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 0) return `Opóźnienie: ${Math.abs(diffMins)} min`;
      
      // Jeśli to była godzina, dodajemy prefix, jeśli "za ile" to samo "Zostało"
      const prefix = label ? `${label} (${scheduled})` : 'Zostało:';
      
      // Jeśli jest dużo tekstu, skracamy
      if(label) return `${scheduled} (za ${diffMins} min)`;
      
      return `${prefix} ${diffMins} min`;
  };

  const getRemainingTimeColor = (text: string | null) => {
      if (!text) return 'text.secondary';
      if (text.includes("Opóźnienie")) return 'error.main';
      // Parsujemy minuty z tekstu
      const match = text.match(/(\d+)\s*min/);
      if (match) {
          const mins = parseInt(match[1]);
          if (mins < 15) return 'warning.main';
      }
      return 'success.main';
  };

  // Handlery
  const openDetails = (order: Order) => { setDetailsOrder(order); setIsDetailsOpen(true); };
  const openPayment = (order: Order) => { setSelectedOrder(order); setIsPaymentOpen(true); };
  
  const handleConfirmPayment = async (method: 'cash' | 'card') => {
    if (!selectedOrder) return;
    try {
      await api.post(`/orders/${selectedOrder._id}/close`, { paymentMethod: method });
      fetchOrders();
      setIsPaymentOpen(false);
      setSelectedOrder(null);
    } catch (error) { alert('Błąd zamykania'); }
  };

  const handleEdit = (order: Order) => {
      navigate('/pos', { state: { editOrder: order } });
  };

  const currentOrders = orders.filter(o => o.status !== 'closed');
  const archivedOrders = orders.filter(o => o.status === 'closed');
  const displayedOrders = tabValue === 0 ? currentOrders : archivedOrders;

  const getOrderColor = (type?: string) => {
      if (type === 'delivery') return '#ed6c02'; 
      if (type === 'takeout') return '#0288d1';
      return '#2e7d32';
  };

  const getOrderLabel = (order: Order) => {
      if (order.tableNumber) return `STOLIK ${order.tableNumber}`;
      if (order.orderType === 'delivery') return 'DOSTAWA';
      return 'WYNOS';
  };

  if (loading) return <Box p={5} textAlign="center"><CircularProgress /></Box>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 10 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Zarządzanie Zamówieniami</Typography>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} indicatorColor="primary" textColor="primary" variant="fullWidth" sx={{ bgcolor: 'white' }}>
          <Tab label={`BIEŻĄCE (${currentOrders.length})`} sx={{ fontWeight: 'bold', fontSize: '1.1rem', py: 2 }} />
          <Tab label="ARCHIWUM" sx={{ fontWeight: 'bold', fontSize: '1.1rem', py: 2 }} />
        </Tabs>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
        {displayedOrders.map((order) => {
            const color = getOrderColor(order.orderType);
            const timeText = getRemainingTime(order);
            const timeColor = getRemainingTimeColor(timeText);

            return (
                <Card 
                    key={order._id}
                    sx={{ 
                        cursor: 'pointer', 
                        transition: '0.2s',
                        borderLeft: `8px solid ${color}`, 
                        boxShadow: 3,
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                        display: 'flex', 
                        flexDirection: 'column',
                        height: '100%', // Rozciągnij kartę
                        minHeight: '320px' // Minimalna wysokość
                    }}
                    onClick={() => openDetails(order)}
                >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        
                        {/* 1. GÓRA: Typ i Numer */}
                        <Box mb={1}>
                            <Typography variant="h4" fontWeight="900" color={color}>
                                #{order.dailyNumber || '?'}
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: '#555' }}>
                                {getOrderLabel(order)}
                            </Typography>
                        </Box>

                        {/* 2. CZAS REALIZACJI */}
                        {timeText && (
                            <Box display="flex" alignItems="center" gap={1} mb={2} bgcolor="#f5f5f5" p={1} borderRadius={1}>
                                <TimerIcon sx={{ color: timeColor }} />
                                <Typography fontWeight="bold" sx={{ color: timeColor, fontSize: '1rem' }}>
                                    {timeText}
                                </Typography>
                            </Box>
                        )}

                        {/* 3. LISTA (Rozpycha kartę) */}
                        <Box flexGrow={1} mb={2}>
                            {order.items.slice(0, 4).map((item, idx) => (
                                <Box key={idx} display="flex" justifyContent="space-between" mb={0.5} sx={{ borderBottom: '1px dashed #eee', pb: 0.5 }}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>
                                        <b>{item.quantity}x</b> {item.name}
                                    </Typography>
                                </Box>
                            ))}
                            {order.items.length > 4 && (
                                <Typography variant="caption" color="text.secondary" fontStyle="italic">
                                    ...i jeszcze {order.items.length - 4} poz.
                                </Typography>
                            )}
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* 4. DÓŁ: CENA I PRZYCISKI (Przyklejone do dołu) */}
                        <Box>
                            <Typography variant="h5" fontWeight="bold" align="right" sx={{ mb: 1 }}>
                                {order.totalAmount.toFixed(2)} zł
                            </Typography>

                            <Box display="flex" gap={1}>
                                {order.status !== 'closed' && (
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        onClick={(e) => { e.stopPropagation(); handleEdit(order); }}
                                        sx={{ flex: 1, fontWeight: 'bold' }}
                                        startIcon={<EditIcon />}
                                    >
                                        EDYTUJ
                                    </Button>
                                )}
                                {order.status !== 'closed' ? (
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        size="small" 
                                        onClick={(e) => { e.stopPropagation(); openPayment(order); }} 
                                        sx={{ flex: 1, fontWeight: 'bold' }}
                                        startIcon={<AttachMoneyIcon />}
                                    >
                                        ROZLICZ
                                    </Button>
                                ) : (
                                    <Chip label="ZAMKNIĘTE" sx={{ width: '100%' }} />
                                )}
                            </Box>
                        </Box>

                    </CardContent>
                </Card>
            );
        })}
      </Box>

      <PaymentModal open={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} order={selectedOrder} onConfirmPayment={handleConfirmPayment} />
      <OrderDetailsModal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} order={detailsOrder} onPay={() => {setIsDetailsOpen(false); if(detailsOrder) openPayment(detailsOrder)}} onEdit={() => {setIsDetailsOpen(false); if(detailsOrder) handleEdit(detailsOrder)}} />
    </Container>
  );
};