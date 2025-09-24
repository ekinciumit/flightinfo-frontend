import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(fullName, email, password);
            (window as any).showToast.success("Kayıt Başarılı", "Hesabınız oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...");
            setMessage({ text: "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...", type: "success" });

            setTimeout(() => {
                navigate("/login"); // ✅ başarıyla kayıt → login sayfasına git
            }, 2000);

            setFullName("");
            setEmail("");
            setPassword("");
        } catch (err) {
            console.error("Register hatası:", err);
            (window as any).showToast.error("Kayıt Hatası", "Kayıt başarısız. Lütfen tekrar deneyin.");
            setMessage({ text: "Kayıt başarısız. Lütfen tekrar deneyin.", type: "error" });
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
                    <h2>Kayıt Ol</h2>
                    <p>Yeni hesap oluşturun</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Ad Soyad</label>
                        <input
                            type="text"
                            value={fullName}
                            required
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ad Soyad"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Şifre</label>
                        <input
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Kayıt Ol
                    </button>
                </form>

                {message && (
                    <div className={`message ${message.type === "success" ? "success-message" : "error-message"}`}>
                        {message.text}
                    </div>
                )}

                <div className="auth-footer">
                    <p>
                        Zaten hesabınız var mı? <Link to="/login" className="auth-link">Giriş yapın</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
