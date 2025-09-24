import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/ToastContainer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import SearchResults from "./pages/SearchResults";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

function App() {
    return (
        <Router>
            <Navbar />
            <ToastContainer />
            
            <Routes>
                {/* Ana sayfa */}
                <Route path="/" element={<HomePage />} />
                
                {/* Auth sayfaları */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                
                {/* Uçuş arama sonuçları */}
                <Route path="/search-results" element={<SearchResults />} />
                
                {/* Rezervasyonlarım - Ana Panel */}
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/dashboard" element={<BookingsPage />} />
                
                {/* Profil */}
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Tüm uçuşlar sayfası */}
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        </Router>
    );
}

export default App;