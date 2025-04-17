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
import PlaylistDetail from './PlaylistDetail';
import EmailVerificationPage from './screens/EmailVerificationPage';
import CompleteProfile from './screens/CompleteProfile';

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

                <Route path="/verify-email" element={<EmailVerificationPage />} />

                <Route path="/complete-profile" element={<CompleteProfile />} />

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
                    path="/UsersRList"
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
                    path="/PlaylistList/:userId"
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <PlaylistList />
                            </>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/playlist/:playlistId"
                    element={
                    <ProtectedRoute>
                        <>
                        <Navbar />
                        <PlaylistDetail />
                        </>
                    </ProtectedRoute>
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;

