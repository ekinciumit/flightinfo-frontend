import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: ""
    });

    useEffect(() => {
        const loadUserData = () => {
            const userData = localStorage.getItem("user");
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setFormData({
                    fullName: parsedUser.fullName || "",
                    email: parsedUser.email || ""
                });
            }
        };

        loadUserData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Burada API'ye güncelleme isteği gönderilecek
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        alert("Profil başarıyla güncellendi!");
    };

    const handleCancel = () => {
        setFormData({
            fullName: user?.fullName || "",
            email: user?.email || ""
        });
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="profile-header">
                        <h1>Profil</h1>
                        <p>Kullanıcı bilgileri yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container">
                {/* Header */}
                <div className="profile-header">
                    <h1>Profil Bilgileri</h1>
                    <p>Hesap ayarlarınızı yönetin</p>
                </div>

                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {user.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
                        </div>
                        <h2>{user.fullName || "Kullanıcı"}</h2>
                        <p className="user-role">
                            {user.role === "Admin" ? "Yönetici" : "Kullanıcı"}
                        </p>
                    </div>

                    <div className="profile-info">
                        {isEditing ? (
                            <div className="edit-form">
                                <div className="form-group">
                                    <label htmlFor="fullName">Ad Soyad</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="form-input"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">E-posta</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button onClick={handleSave} className="btn btn-primary">
                                        Kaydet
                                    </button>
                                    <button onClick={handleCancel} className="btn btn-secondary">
                                        İptal
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="info-display">
                                <div className="info-item">
                                    <span className="label">Ad Soyad:</span>
                                    <span className="value">{user.fullName || "Belirtilmemiş"}</span>
                                </div>
                                
                                <div className="info-item">
                                    <span className="label">E-posta:</span>
                                    <span className="value">{user.email}</span>
                                </div>
                                
                                <div className="info-item">
                                    <span className="label">Rol:</span>
                                    <span className="value">{user.role === "Admin" ? "Yönetici" : "Kullanıcı"}</span>
                                </div>
                                
                                <div className="info-item">
                                    <span className="label">Üyelik Tarihi:</span>
                                    <span className="value">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : "Bilinmiyor"}
                                    </span>
                                </div>

                                <div className="profile-actions">
                                    <button onClick={handleEdit} className="btn btn-primary">
                                        Düzenle
                                    </button>
                                    <button onClick={handleLogout} className="btn btn-danger">
                                        Çıkış Yap
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="profile-stats">
                    <div className="stat-card">
                        <div className="stat-icon">✈️</div>
                        <div className="stat-content">
                            <h3>Toplam Uçuş</h3>
                            <p>Son 30 günde yapılan aramalar</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">🎫</div>
                        <div className="stat-content">
                            <h3>Aktif Rezervasyon</h3>
                            <p>Devam eden rezervasyonlarınız</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-content">
                            <h3>Üyelik Seviyesi</h3>
                            <p>{user.role === "Admin" ? "Premium" : "Standart"}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>Hızlı İşlemler</h2>
                    <div className="actions-grid">
                        <Link to="/dashboard" className="action-card">
                            <span className="action-icon">📊</span>
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/bookings" className="action-card">
                            <span className="action-icon">📋</span>
                            <span>Rezervasyonlarım</span>
                        </Link>
                        <Link to="/" className="action-card">
                            <span className="action-icon">🔍</span>
                            <span>Uçuş Ara</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
