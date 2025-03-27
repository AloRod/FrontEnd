import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import HomeScreen from './HomeScreen';
import AdminDasshboard from './AdminDasshboard';
import UsersRList from './UsersRList';
import VideoList from './VideoList';
import UserRForm from './UserRForm';
import PlaylistManager from './PlaylistManager';
import PlaylistList from './PlaylistList';
import Navbar from './Navbar'; // Importa el Navbar

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        // Si no hay token, redirige al login
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Página principal será el Login */}
                <Route path="/" element={<Login />} />

                {/* Página de registro */}
                <Route path="/register" element={<Register />} />

                {/* Rutas protegidas */}
                <Route
                    path="/HomeScreen"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <HomeScreen />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/AdminDasshboard"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <AdminDasshboard />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/UserRList"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <UsersRList />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/UserRForm"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <UserRForm />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/VideoList"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <VideoList />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/PlaylistManager"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <PlaylistManager />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/PlaylistList"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <PlaylistList />
                            </>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;

