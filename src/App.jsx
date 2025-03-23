import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import HomeScreen from './HomeScreen';  
import AdminDashboard from './AdminDasshboard';
import UsersRList from './UsersRList';


function App() {
  return (
    <Router>
      <Routes>
      
        {/* Página principal será el Login */}
        <Route path="/" element={<Login />} />
        
        {/* Página de registro */}
        <Route path="/register" element={<Register />} />
        
        {/* Ruta para la pagina principal */}
        <Route path="/HomeScreen" element={<HomeScreen />} />
        
        <Route path="/AdminDasshboard" element={<AdminDashboard />} />
        <Route path="/UserRList" element={<UsersRList />} />
      </Routes>
    </Router>
  );
}

export default App;

