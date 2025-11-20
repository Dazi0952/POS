import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import PosPage from './pages/PosPage';
const HallPage = () => <h1>Tu będzie Sala</h1>;
const OrdersPage = () => <h1>Tu będą Zamówienia</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pos" element={<PosPage />} />
        <Route path="/hall" element={<HallPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;