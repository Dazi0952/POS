import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Box, Typography, Paper, Button, Avatar, CircularProgress 
} from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import LockIcon from '@mui/icons-material/Lock';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';


interface Employee {
  _id: string;
  name: string;
  role: string;
}

export const PinPadPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Pobierz listę pracowników przy starcie
  useEffect(() => {
    const fetchEmployees = async () => {
      const tenantId = localStorage.getItem('pos_tenant_id');
      if (!tenantId) {
        navigate('/setup'); // Jeśli brak ID restauracji, idź do setupu
        return;
      }
      try {
        const res = await api.get('/auth/employees');
        setEmployees(res.data);
      } catch (error) {
        console.error(error);
        alert('Błąd połączenia z restauracją');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [navigate]);

  // 2. Obsługa klawiatury
  const handleNumClick = (num: string) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const handleBackspace = () => setPin(prev => prev.slice(0, -1));

  // 3. Logowanie
  const handleLogin = async () => {
    if (!selectedUser) return;
    try {
      const res = await api.post('/auth/login', {
       username: (selectedUser as any).username || selectedUser.name, 
        pin: pin
      });

      // Zapisz token usera (sesję pracownika)
      localStorage.setItem('pos_token', res.data.token);
      localStorage.setItem('pos_user_name', res.data.name);
      localStorage.setItem('pos_user_id', selectedUser._id);
      localStorage.setItem('pos_user_role', res.data.role); 
      
      navigate('/'); // Idź do Dashboardu
    } catch (error) {
      alert('Błędny PIN!');
      setPin('');
    }
  };

  // Auto-login po wpisaniu 4 cyfr
  useEffect(() => {
    if (pin.length === 4) handleLogin();
  }, [pin]);

  const handleReset = () => {
      localStorage.removeItem('pos_tenant_id');
      navigate('/setup');
  }

  if (loading) return <Box p={5} textAlign="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: '#263238' }}>
      
      {/* LEWA STRONA: LISTA PRACOWNIKÓW */}
      <Box sx={{ flex: 1, p: 4, overflowY: 'auto', borderRight: '1px solid #455a64' }}>
        <Typography variant="h4" color="white" fontWeight="bold" mb={4}>
          Kto pracuje?
        </Typography>
        <Grid container spacing={2}>
          {employees.map(emp => (
            <Grid size={{ xs: 6, md: 4 }}key={emp._id}>
              <Paper 
                onClick={() => { setSelectedUser(emp); setPin(''); }}
                sx={{ 
                  p: 3, textAlign: 'center', cursor: 'pointer',
                  bgcolor: selectedUser?._id === emp._id ? '#1976d2' : '#37474f',
                  color: 'white',
                  transition: '0.2s',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
                    {emp.name[0]}
                </Avatar>
                <Typography variant="h6">{emp.name}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>{emp.role}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Button startIcon={<SettingsIcon />} sx={{ mt: 5, color: 'grey.500' }} onClick={handleReset}>
            Zmień Restaurację
        </Button>
      </Box>

      {/* PRAWA STRONA: PIN PAD */}
      <Box sx={{ width: '400px', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#1c2429' }}>
        {selectedUser ? (
            <>
                <Typography variant="h5" color="white" mb={3}>
                    Witaj, {selectedUser.name}
                </Typography>
                <Box mb={4} display="flex" gap={2}>
                    {[1, 2, 3, 4].map(i => (
                        <Box key={i} sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: pin.length >= i ? '#4caf50' : '#546e7a' }} />
                    ))}
                </Box>

                <Grid container spacing={2} sx={{ maxWidth: 300 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <Grid size={{ xs: 4}} key={num}>
                            <Button 
                                variant="contained" 
                                sx={{ width: '100%', height: 60, fontSize: '1.5rem', bgcolor: '#37474f', '&:hover': { bgcolor: '#455a64' } }}
                                onClick={() => handleNumClick(num.toString())}
                            >
                                {num}
                            </Button>
                        </Grid>
                    ))}
                    <Grid size={{ xs: 4}}><Box /></Grid>
                    <Grid size={{ xs: 4}}>
                        <Button 
                            variant="contained" 
                            sx={{ width: '100%', height: 60, fontSize: '1.5rem', bgcolor: '#37474f' }}
                            onClick={() => handleNumClick('0')}
                        >
                            0
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 4}}>
                        <Button 
                            variant="contained" color="error"
                            sx={{ width: '100%', height: 60 }}
                            onClick={handleBackspace}
                        >
                            <BackspaceIcon />
                        </Button>
                    </Grid>
                </Grid>
            </>
        ) : (
            <Box textAlign="center" color="grey.500">
                <LockIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6">Wybierz pracownika z listy obok</Typography>
            </Box>
        )}
      </Box>
    </Box>
  );
};