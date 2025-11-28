import { Container, Typography, Card, CardContent, Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout'

export const DashboardPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      title: 'DODAJ', 
      subtitle: 'Wynos / Dostawa', 
      icon: <RestaurantMenuIcon sx={{ fontSize: 60 }} />, 
      path: '/pos',
      color: '#4caf50' 
    },
    { 
      title: 'SALA', 
      subtitle: 'Mapa Stolików', 
      icon: <TableRestaurantIcon sx={{ fontSize: 60 }} />, 
      path: '/hall',
      color: '#2196f3' 
    },
    { 
      title: 'ZAMÓWIENIA', 
      subtitle: 'Bieżące i Archiwum', 
      icon: <ReceiptLongIcon sx={{ fontSize: 60 }} />, 
      path: '/orders', 
      color: '#ff9800' 
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user_name');
    navigate('/login');
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
        Witaj, Jan Kowalski
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" mb={8}>
        Wybierz moduł pracy
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {menuItems.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.title}>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                  <Typography variant="h4" fontWeight="bold">
                  Dzień Dobry, {localStorage.getItem('pos_user_name') || 'Managerze'} 👋
                  </Typography>
                  {/* ... */}
              </Box>
              <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<LogoutIcon />} 
                  onClick={handleLogout}
              >
                  PRZEŁĄCZ UŻYTKOWNIKA
              </Button>
            </Box>
            <Card 
              sx={{ 
                height: 250, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: '0.3s',
                bgcolor: item.color,
                color: 'white',
                '&:hover': { transform: 'scale(1.05)', boxShadow: 10 }
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                {item.icon}
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                  {item.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {item.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};