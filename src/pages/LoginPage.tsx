import { useState } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            (window as any).showToast.success("Giriş Başarılı", "Hoş geldiniz!");
            setError("");

            // ✅ Navbar'ı güncelle
            window.dispatchEvent(new Event('authChange'));

            // ✅ başarılı giriş sonrası yönlendirme
            navigate("/bookings");
        } catch {
            (window as any).showToast.error("Giriş Hatası", "Email veya şifre hatalı!");
            setError("Email veya şifre hatalı!");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <span className="logo-icon">✈️</span>
                        <span className="logo-text">FlightInfo</span>
                    </div>
                    <h2>Giriş Yap</h2>
                    <p>Hesabınıza giriş yapın</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Giriş Yap
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}

                <div className="auth-footer">
                    <p>
                        Hesabınız yok mu? <Link to="/register" className="auth-link">Kayıt olun</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
