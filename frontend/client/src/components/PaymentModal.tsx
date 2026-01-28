import { useState, useEffect } from 'react';
import { 
  Dialog, Box, Typography, Button, 
  TextField, InputAdornment, Divider, Stack, IconButton, Chip 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderToPay {
  _id: string;
  totalAmount: number;
  items: OrderItem[];
  tableNumber?: string;
  orderType?: string; 
}

interface Props {
  open: boolean;
  onClose: () => void;
  order: OrderToPay | null;
  onConfirmPayment: (method: 'cash' | 'card') => void;
}

export default function PaymentModal({ open, onClose, order, onConfirmPayment }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [change, setChange] = useState<number>(0);

  
  useEffect(() => {
    if (open) {
      setPaymentMethod('card');
      setCashReceived('');
      setChange(0);
    }
  }, [open, order]);

  
  useEffect(() => {
    if (order && cashReceived) {
      const received = parseFloat(cashReceived);
      if (!isNaN(received)) {
        setChange(received - order.totalAmount);
      }
    } else {
      setChange(0);
    }
  }, [cashReceived, order]);

  if (!order) return null;

  const isCashInvalid = paymentMethod === 'cash' && (parseFloat(cashReceived || '0') < order.totalAmount);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} height="70vh">
        
        
        <Box sx={{ flex: 1, bgcolor: '#f5f5f5', p: 3, display: 'flex', flexDirection: 'column', borderRight: '1px solid #ddd' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Podsumowanie
          </Typography>
          
          <Box mb={2}>
            {order.tableNumber ? (
                <Chip label={`Stolik #${order.tableNumber}`} color="primary" sx={{ fontWeight: 'bold' }} />
            ) : (
                <Chip label={order.orderType === 'delivery' ? 'Dostawa' : 'Na Wynos'} color="warning" sx={{ fontWeight: 'bold' }} />
            )}
            <Typography variant="caption" display="block" mt={1} color="text.secondary">ID: #{order._id.slice(-6)}</Typography>
          </Box>

          <Divider />

          <Box sx={{ flex: 1, overflowY: 'auto', my: 2 }}>
            {order.items.map((item, idx) => (
              <Box key={idx} display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">
                  {item.quantity}x {item.name}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {(item.price * item.quantity).toFixed(2)} zł
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider />
          
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="h5">DO ZAPŁATY:</Typography>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {order.totalAmount.toFixed(2)} zł
            </Typography>
          </Box>
        </Box>

        
        <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" fontWeight="bold">Rozliczenie</Typography>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </Box>

          
          <Stack direction="row" spacing={2} mb={4}>
            <Button 
              variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
              fullWidth
              size="large"
              startIcon={<CreditCardIcon />}
              onClick={() => setPaymentMethod('card')}
              sx={{ height: 60, fontSize: '1.1rem' }}
            >
              KARTA
            </Button>
            <Button 
              variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
              fullWidth
              size="large"
              startIcon={<LocalAtmIcon />}
              onClick={() => setPaymentMethod('cash')}
              sx={{ height: 60, fontSize: '1.1rem' }}
            >
              GOTÓWKA
            </Button>
          </Stack>

          
          {paymentMethod === 'cash' && (
            <Box bgcolor="#e3f2fd" p={3} borderRadius={2} mb={2}>
              <TextField
                label="Otrzymana gotówka"
                type="number"
                fullWidth
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                  style: { fontSize: '1.5rem', fontWeight: 'bold' }
                }}
                autoFocus
              />
              
              <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Reszta do wydania:</Typography>
                <Typography 
                    variant="h4" 
                    fontWeight="bold" 
                    color={change < 0 ? 'error' : 'success'}
                >
                  {change.toFixed(2)} zł
                </Typography>
              </Box>
            </Box>
          )}

          
          <Box flex={1} />

          <Button
            variant="contained"
            color="success"
            fullWidth
            size="large"
            disabled={isCashInvalid}
            onClick={() => onConfirmPayment(paymentMethod)}
            startIcon={<CheckCircleIcon />}
            sx={{ height: 70, fontSize: '1.3rem', fontWeight: 'bold' }}
          >
            ZATWIERDŹ I ZAMKNIJ
          </Button>

        </Box>
      </Box>
    </Dialog>
  );
}