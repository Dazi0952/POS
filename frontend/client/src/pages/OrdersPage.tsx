import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, CircularProgress 
} from '@mui/material';

interface Order {
  _id: string;
  tableNumber?: string;
  totalAmount: number;
  status: 'kitchen' | 'ready' | 'closed';
  createdAt: string;
  items: { name: string, quantity: number }[];
}

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0); // 0 = Bieżące, 1 = Archiwum

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
  }, []);

  const handleCloseOrder = async (orderId: string) => {
    if (!window.confirm('Czy na pewno chcesz zamknąć ten rachunek? Tej operacji nie można cofnąć.')) {
      return;
    }

    try {
      await api.post(`/orders/${orderId}/close`);
      fetchOrders();
    } catch (error) {
      console.error('Błąd zamykania:', error);
      alert('Nie udało się zamknąć zamówienia.');
    }
  };
  const currentOrders = orders.filter(o => o.status !== 'closed');
  const archivedOrders = orders.filter(o => o.status === 'closed');

  const displayedOrders = tabValue === 0 ? currentOrders : archivedOrders;

  const getStatusChip = (status: string) => {
    const map: Record<string, any> = {
      'kitchen': { label: 'W Kuchni', color: 'warning' },
      'ready': { label: 'Gotowe', color: 'success' },
      'closed': { label: 'Zamknięte', color: 'default' }
    };
    const s = map[status] || { label: status, color: 'default' };
    return <Chip label={s.label} color={s.color} size="small" />;
  };

  if (loading) return <Box p={5} textAlign="center"><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Lista Zamówień
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_e, newValue) => setTabValue(newValue)} 
          indicatorColor="primary" 
          textColor="primary"
          centered
        >
          <Tab label={`Bieżące (${currentOrders.length})`} />
          <Tab label="Archiwum" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID / Czas</TableCell>
              <TableCell>Stolik / Typ</TableCell>
              <TableCell>Kwota</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Akcja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">#{order._id.slice(-4)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.tableNumber ? (
                    <Chip label={`Stolik ${order.tableNumber}`} color="primary" variant="outlined" size="small" />
                  ) : (
                    <Typography variant="body2">Wynos</Typography>
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {order.totalAmount.toFixed(2)} zł
                </TableCell>
                <TableCell>
                  {getStatusChip(order.status)}
                </TableCell>
                <TableCell align="right">
                  {/* Przycisk tylko dla bieżących */}
                  {order.status !== 'closed' && (
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => handleCloseOrder(order._id)}
                    >
                      ROZLICZ
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {displayedOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Brak zamówień w tej kategorii.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};