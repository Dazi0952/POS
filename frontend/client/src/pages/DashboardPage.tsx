import { Container, Typography, Card, CardContent, Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const userRole = localStorage.getItem('pos_user_role') || "";
  
  console.log("AKTUALNA ROLA UŻYTKOWNIKA:", userRole);
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
  if (['manager', 'admin'].includes(userRole)) {
    menuItems.push({ 
      title: 'MANAGER', 
      subtitle: 'Rozliczenia i Raporty', 
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 50 }} />, 
      path: '/manager', 
      color: '#607d8b' 
    });
    menuItems.push({ 
      title: 'EDYTOR MENU', 
      subtitle: 'Zarządzanie Produktami', 
      icon: <RestaurantIcon sx={{ fontSize: 50 }} />, 
      path: '/admin/menu', 
      color: '#9c27b0'
    });
  }
  

  const handleLogout = () => {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user_name');
    localStorage.removeItem('pos_user_id');   
    localStorage.removeItem('pos_user_role');
    navigate('/login');
  }
  

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
        Zalogowany jako:  {localStorage.getItem('pos_user_name')} 
      </Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<LogoutIcon />} 
                  onClick={handleLogout}
                >
                  PRZEŁĄCZ UŻYTKOWNIKA
              </Button>

      <Grid container spacing={4} justifyContent="center">
        {menuItems.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.title}>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
              
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