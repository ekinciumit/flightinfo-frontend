import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserReservations, cancelReservation, restoreReservation, type Reservation } from "../services/flightService";
import "./BookingsPage.css";

function BookingsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [restoringId, setRestoringId] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState<"all" | "active" | "cancelled">("all");

    useEffect(() => {
        const loadReservations = async () => {
            try {
                setIsLoading(true);
                
                // Token kontrolü
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Giriş yapmanız gerekiyor. Lütfen tekrar giriş yapın.");
                    return;
                }
                
                console.log("Token mevcut:", token.substring(0, 20) + "...");
                
                const userReservations = await getUserReservations();
                setReservations(userReservations);
                setFilteredReservations(userReservations);
            } catch (error: any) {
                console.error("Rezervasyonlar yüklenirken hata:", error);
                
                if (error.response?.status === 401) {
                    setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
                    // Token'ı temizle
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                } else {
                    setError("Rezervasyonlar yüklenirken bir hata oluştu");
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadReservations();
    }, []);

    // Filtreleme fonksiyonu
    const filterReservations = (filter: "all" | "active" | "cancelled") => {
        setActiveFilter(filter);
        let filtered = reservations;
        
        if (filter === "active") {
            filtered = reservations.filter(r => r.status === "Active");
        } else if (filter === "cancelled") {
            filtered = reservations.filter(r => r.status === "Cancelled");
        }
        
        setFilteredReservations(filtered);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "#27ae60";
            case "Cancelled": return "#e74c3c";
            default: return "#95a5a6";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "Active": return "Aktif";
            case "Cancelled": return "İptal Edildi";
            default: return "Bilinmiyor";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCancelReservation = async (reservationId: number) => {
        if (!window.confirm("Bu rezervasyonu iptal etmek istediğinizden emin misiniz?")) {
            return;
        }

        try {
            setCancellingId(reservationId);
            await cancelReservation(reservationId);
            
            // Rezervasyonları yeniden yükle
            const updatedReservations = await getUserReservations();
            setReservations(updatedReservations);
            setFilteredReservations(updatedReservations);
            
            alert("Rezervasyon başarıyla iptal edildi!");
        } catch (error: any) {
            console.error("Rezervasyon iptal hatası:", error);
            alert("Rezervasyon iptal edilirken bir hata oluştu");
        } finally {
            setCancellingId(null);
        }
    };

    const handleRestoreReservation = async (reservationId: number) => {
        if (!window.confirm("Bu rezervasyonu geri almak istediğinizden emin misiniz?")) {
            return;
        }

        try {
            setRestoringId(reservationId);
            
            // Gerçek API çağrısı
            await restoreReservation(reservationId);
            
            // Rezervasyonları yeniden yükle
            const updatedReservations = await getUserReservations();
            setReservations(updatedReservations);
            setFilteredReservations(updatedReservations);
            
            alert("Rezervasyon başarıyla geri alındı!");
        } catch (error: any) {
            console.error("Rezervasyon geri alma hatası:", error);
            alert("Rezervasyon geri alınırken bir hata oluştu");
        } finally {
            setRestoringId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="bookings-page">
                <div className="container">
                    <div className="bookings-header">
                        <h1>Rezervasyonlarım</h1>
                        <p>Rezervasyonlarınız yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bookings-page">
                <div className="container">
                    <div className="bookings-header">
                        <h1>Rezervasyonlarım</h1>
                        <div className="error-message">
                            <p>{error}</p>
                            <div className="error-actions">
                                <button onClick={() => window.location.reload()} className="btn btn-primary">
                                    Tekrar Dene
                                </button>
                                {error.includes("giriş") && (
                                    <Link to="/login" className="btn btn-secondary">
                                        Giriş Yap
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bookings-page">
            <div className="container">
                  {/* Header */}
                  <div className="bookings-header">
                      <h1>Rezervasyonlarım</h1>
                      <p>Geçmiş ve aktif rezervasyonlarınız</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="stats-grid">
                      <div className="stat-card">
                          <div className="stat-icon">✈️</div>
                          <div className="stat-content">
                              <h3>{reservations.length}</h3>
                              <p>Toplam Rezervasyon</p>
                          </div>
                      </div>
                      <div className="stat-card">
                          <div className="stat-icon">✅</div>
                          <div className="stat-content">
                              <h3>{reservations.filter(r => r.status === "Active").length}</h3>
                              <p>Aktif</p>
                          </div>
                      </div>
                      <div className="stat-card">
                          <div className="stat-icon">❌</div>
                          <div className="stat-content">
                              <h3>{reservations.filter(r => r.status === "Cancelled").length}</h3>
                              <p>İptal Edilen</p>
                          </div>
                      </div>
                      <div className="stat-card">
                          <div className="stat-icon">📅</div>
                          <div className="stat-content">
                              <h3>{reservations.filter(r => new Date(r.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</h3>
                              <p>Son 30 Gün</p>
                          </div>
                      </div>
                  </div>

                {/* Filtreleme Butonları */}
                <div className="filter-tabs">
                    <button 
                        className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
                        onClick={() => filterReservations("all")}
                    >
                        <div className="tab-content">
                            <span className="tab-icon">📋</span>
                            <div className="tab-text">
                                <span className="tab-title">Tümü</span>
                                <span className="tab-count">{reservations.length} rezervasyon</span>
                            </div>
                        </div>
                    </button>
                    <button 
                        className={`filter-tab ${activeFilter === "active" ? "active" : ""}`}
                        onClick={() => filterReservations("active")}
                    >
                        <div className="tab-content">
                            <span className="tab-icon">✅</span>
                            <div className="tab-text">
                                <span className="tab-title">Aktif</span>
                                <span className="tab-count">{reservations.filter(r => r.status === "Active").length} rezervasyon</span>
                            </div>
                        </div>
                    </button>
                    <button 
                        className={`filter-tab ${activeFilter === "cancelled" ? "active" : ""}`}
                        onClick={() => filterReservations("cancelled")}
                    >
                        <div className="tab-content">
                            <span className="tab-icon">❌</span>
                            <div className="tab-text">
                                <span className="tab-title">İptal Edilen</span>
                                <span className="tab-count">{reservations.filter(r => r.status === "Cancelled").length} rezervasyon</span>
                            </div>
                        </div>
                    </button>
                </div>


                {/* Reservations List */}
                {filteredReservations.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>
                            {activeFilter === "all" ? "Henüz rezervasyonunuz yok" : 
                             activeFilter === "active" ? "Aktif rezervasyonunuz yok" : 
                             "İptal edilen rezervasyonunuz yok"}
                        </h3>
                        <p>
                            {activeFilter === "all" ? "İlk rezervasyonunuzu yapmak için uçuş aramaya başlayın" :
                             activeFilter === "active" ? "Aktif rezervasyonlarınız burada görünecek" :
                             "İptal ettiğiniz rezervasyonlar burada görünecek"}
                        </p>
                        {activeFilter === "all" && (
                            <Link to="/" className="btn btn-primary">Uçuş Ara</Link>
                        )}
                    </div>
                ) : (
                    <div className="reservations-list">
                        {filteredReservations.map(reservation => (
                            <div key={reservation.id} className="reservation-card">
                                <div className="reservation-header">
                                    <div className="flight-info">
                                        <h3>{reservation.flightNumber}</h3>
                                        <p>{reservation.origin} → {reservation.destination}</p>
                                    </div>
                                    <div 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(reservation.status) }}
                                    >
                                        {getStatusText(reservation.status)}
                                    </div>
                                </div>

                                <div className="reservation-details">
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <span className="label">Kalkış:</span>
                                            <span className="value">{formatTime(reservation.departureTime)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Varış:</span>
                                            <span className="value">{formatTime(reservation.arrivalTime)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <span className="label">Tarih:</span>
                                            <span className="value">{formatDate(reservation.departureTime)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Oluşturulma:</span>
                                            <span className="value">{formatDate(reservation.createdAt)}</span>
                                        </div>
                                    </div>

                                    {reservation.cancelledAt && (
                                        <div className="detail-row">
                                            <div className="detail-item">
                                                <span className="label">İptal Tarihi:</span>
                                                <span className="value">{formatDate(reservation.cancelledAt)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="reservation-actions">
                                    <button className="btn btn-secondary">Detaylar</button>
                                    {reservation.status === "Active" && (
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => handleCancelReservation(reservation.id)}
                                            disabled={cancellingId === reservation.id}
                                        >
                                            {cancellingId === reservation.id ? "İptal Ediliyor..." : "İptal Et"}
                                        </button>
                                    )}
                                    {reservation.status === "Cancelled" && (
                                        <button 
                                            className="btn btn-success"
                                            onClick={() => handleRestoreReservation(reservation.id)}
                                            disabled={restoringId === reservation.id}
                                        >
                                            {restoringId === reservation.id ? "Geri Alınıyor..." : "Geri Al"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>Hızlı İşlemler</h2>
                    <div className="actions-grid">
                        <Link to="/" className="action-card">
                            <span className="action-icon">🔍</span>
                            <span>Yeni Uçuş Ara</span>
                        </Link>
                        <Link to="/dashboard" className="action-card">
                            <span className="action-icon">📊</span>
                            <span>Dashboard</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingsPage;
