import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  Container, Typography, Box, Paper, CircularProgress, Chip 
} from '@mui/material';
import Grid from '@mui/material/Grid';
//import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import PersonIcon from '@mui/icons-material/Person';

interface Table {
  _id: string;
  number: string;
  seats: number;
  status: 'free' | 'occupied' | 'reserved' | 'to-pay';
}

export const HallPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Błąd pobierania stolików:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free': return '#4caf50';    
      case 'occupied': return '#f44336'; 
      case 'to-pay': return '#ff9800';  
      case 'reserved': return '#9e9e9e'; 
      default: return '#e0e0e0';
    }
  };

  const handleTableClick = (table: Table) => {
    navigate('/pos', { state: { tableId: table._id, tableNumber: table.number } });
  };

  if (loading) return <Box p={5} textAlign="center"><CircularProgress /></Box>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Mapa Sali
        </Typography>
        
        {/* Legenda */}
        <Box display="flex" gap={2}>
          <Chip label="Wolny" sx={{ bgcolor: '#4caf50', color: 'white' }} />
          <Chip label="Zajęty" sx={{ bgcolor: '#f44336', color: 'white' }} />
          <Chip label="Do zapłaty" sx={{ bgcolor: '#ff9800', color: 'white' }} />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {tables.map((table) => (
            <Grid size={{ xs: 6, md: 3, lg: 2 }}>
            <Paper
              elevation={3}
              onClick={() => handleTableClick(table)}
              sx={{
                height: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                borderTop: `6px solid ${getStatusColor(table.status)}`,
                bgcolor: table.status === 'occupied' ? '#ffebee' : 'white',
                transition: '0.2s',
                '&:hover': { transform: 'scale(1.05)', boxShadow: 6 }
              }}
            >
              <Typography variant="h4" fontWeight="bold" color="text.secondary">
                {table.number}
              </Typography>
              
              <Box display="flex" alignItems="center" mt={1} color="text.disabled">
                <PersonIcon fontSize="small" />
                <Typography variant="body2">{table.seats}</Typography>
              </Box>

              {table.status === 'occupied' && (
                <Typography variant="caption" color="error" fontWeight="bold" mt={1}>
                  OTWARTY
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};