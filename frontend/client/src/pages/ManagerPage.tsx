import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Card, CardContent 
} from '@mui/material';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';

interface EmployeeStats {
  name: string;
  cash: number;
  card: number;
  unpaid: number;
  total: number;
}

export const ManagerPage = () => {
  const [stats, setStats] = useState<EmployeeStats[]>([]);
  const [globalTotal, setGlobalTotal] = useState({ cash: 0, card: 0, total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/reports/settlements');
        setStats(res.data);
        
        // Oblicz sumy globalne
        const totals = res.data.reduce((acc: any, curr: any) => ({
            cash: acc.cash + curr.cash,
            card: acc.card + curr.card,
            total: acc.total + curr.total
        }), { cash: 0, card: 0, total: 0 });
        setGlobalTotal(totals);

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Panel Managera - Rozliczenie Zmiany
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Raport z dnia: {new Date().toLocaleDateString()}
      </Typography>

      {/* KAFELKI PODSUMOWANIA */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <LocalAtmIcon color="success" />
                        <Typography color="text.secondary" fontWeight="bold">GOTÓWKA W KASIE</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold">{globalTotal.cash.toFixed(2)} zł</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={{ xs: 12,  md: 4 }}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <CreditCardIcon color="primary" />
                        <Typography color="text.secondary" fontWeight="bold">TERMINAL (KARTA)</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold">{globalTotal.card.toFixed(2)} zł</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: '#fafafa', border: '1px solid #ddd' }}>
                <CardContent>
                    <Typography color="text.secondary" fontWeight="bold" mb={1}>UTARG CAŁKOWITY</Typography>
                    <Typography variant="h4" fontWeight="bold">{globalTotal.total.toFixed(2)} zł</Typography>
                </CardContent>
            </Card>
        </Grid>
      </Grid>

      {/* TABELA PRACOWNIKÓW */}
      <Typography variant="h5" fontWeight="bold" mb={2}>Rozliczenie Pracowników</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#263238' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Pracownik</TableCell>
              <TableCell align="right" sx={{ color: 'lightgreen', fontWeight: 'bold' }}>Gotówka (Do oddania)</TableCell>
              <TableCell align="right" sx={{ color: 'lightblue', fontWeight: 'bold' }}>Karta</TableCell>
              <TableCell align="right" sx={{ color: 'orange', fontWeight: 'bold' }}>Nierozliczone (Otwarte)</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Razem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((row) => (
              <TableRow key={row.name}>
                <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon color="action" />
                        <Typography fontWeight="bold">{row.name}</Typography>
                    </Box>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {row.cash.toFixed(2)} zł
                </TableCell>
                <TableCell align="right">{row.card.toFixed(2)} zł</TableCell>
                <TableCell align="right">{row.unpaid.toFixed(2)} zł</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{row.total.toFixed(2)} zł</TableCell>
              </TableRow>
            ))}
            {stats.length === 0 && (
                <TableRow><TableCell colSpan={5} align="center">Brak sprzedaży dzisiaj</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};