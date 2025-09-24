import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Token kontrolü
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");
            setIsLoggedIn(!!token);
            setUser(userData ? JSON.parse(userData) : null);
        };

        checkAuth();

        // Storage değişikliklerini dinle
        window.addEventListener('storage', checkAuth);
        
        // Custom event dinle (login/logout için)
        window.addEventListener('authChange', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        
        // ✅ Navbar'ı güncelle
        window.dispatchEvent(new Event('authChange'));
        
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <span className="logo-icon">✈️</span>
                    <span className="logo-text">FlightInfo</span>
                </Link>

                <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Ana Sayfa
                    </Link>
                    <Link to="/search" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Uçuş Ara
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <span className="nav-user">
                                Hoş geldin, {user?.fullName || user?.email || "Kullanıcı"}!
                            </span>
                            <Link to="/bookings" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                Rezervasyonlarım
                            </Link>
                            <button onClick={handleLogout} className="nav-button logout">
                                Çıkış Yap
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                Giriş Yap
                            </Link>
                            <Link to="/register" className="nav-link register" onClick={() => setIsMenuOpen(false)}>
                                Kayıt Ol
                            </Link>
                        </>
                    )}
                </div>

                <div 
                    className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
