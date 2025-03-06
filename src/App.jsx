import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';  

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal será el Login */}
        <Route path="/" element={<Login />} />
        
        {/* Página de registro */}
        <Route path="/register" element={<Register />} />
        
        {/* Ruta para la pagina principal */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

