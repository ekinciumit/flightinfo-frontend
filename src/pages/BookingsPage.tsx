import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserReservationsWithFlights, cancelReservation, restoreReservation, type Reservation } from "../services/flightService";
import "./BookingsPage.css";

function BookingsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [restoringId, setRestoringId] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState<"all" | "active" | "cancelled">("all");
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

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
                
                const userReservations = await getUserReservationsWithFlights();
                console.log("Rezervasyon verileri:", userReservations);
                console.log("İlk rezervasyon status:", userReservations[0]?.status, typeof userReservations[0]?.status);
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
        
        // Rezervasyon yapıldığında sayfayı yenile
        const handleReservationUpdate = () => {
            loadReservations();
        };
        
        window.addEventListener('reservationUpdated', handleReservationUpdate);
        
        return () => {
            window.removeEventListener('reservationUpdated', handleReservationUpdate);
        };
    }, []);

    // Filtreleme fonksiyonu
    const filterReservations = (filter: "all" | "active" | "cancelled") => {
        setActiveFilter(filter);
        let filtered = reservations;
        
        if (filter === "active") {
            filtered = reservations.filter(r => r.status === 1 || r.status === "Active" || r.status === "active");
        } else if (filter === "cancelled") {
            filtered = reservations.filter(r => r.status === 2 || r.status === "Cancelled" || r.status === "cancelled");
        }
        
        setFilteredReservations(filtered);
    };

    const getStatusColor = (status: string | number) => {
        if (status === 1 || status === "Active" || status === "active") {
            return "#27ae60"; // Active
        } else if (status === 2 || status === "Cancelled" || status === "cancelled") {
            return "#e74c3c"; // Cancelled
        } else {
            return "#95a5a6";
        }
    };

    const getStatusText = (status: string | number) => {
        if (status === 1 || status === "Active" || status === "active") {
            return "Aktif";
        } else if (status === 2 || status === "Cancelled" || status === "cancelled") {
            return "İptal Edildi";
        } else {
            return "Bilinmiyor";
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
            const updatedReservations = await getUserReservationsWithFlights();
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
            const updatedReservations = await getUserReservationsWithFlights();
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

    const handleShowDetails = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setShowDetailsModal(true);
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
                                <span className="tab-count">{reservations.filter(r => r.status === 1 || r.status === "Active" || r.status === "active").length} rezervasyon</span>
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
                                <span className="tab-count">{reservations.filter(r => r.status === 2 || r.status === "Cancelled" || r.status === "cancelled").length} rezervasyon</span>
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
                                        <h3>{reservation.flight?.flightNumber || 'Bilinmiyor'}</h3>
                                        <p>{reservation.flight?.origin || 'Bilinmiyor'} → {reservation.flight?.destination || 'Bilinmiyor'}</p>
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
                                            <span className="value">{reservation.flight ? formatTime(reservation.flight.departureTime) : 'Bilinmiyor'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Varış:</span>
                                            <span className="value">{reservation.flight ? formatTime(reservation.flight.arrivalTime) : 'Bilinmiyor'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <span className="label">Tarih:</span>
                                            <span className="value">{reservation.flight ? formatDate(reservation.flight.departureTime) : 'Bilinmiyor'}</span>
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
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleShowDetails(reservation)}
                                    >
                                        Detaylar
                                    </button>
                                    {(reservation.status === 1 || reservation.status === "Active" || reservation.status === "active") && (
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => handleCancelReservation(reservation.id)}
                                            disabled={cancellingId === reservation.id}
                                        >
                                            {cancellingId === reservation.id ? "İptal Ediliyor..." : "İptal Et"}
                                        </button>
                                    )}
                                    {(reservation.status === 2 || reservation.status === "Cancelled" || reservation.status === "cancelled") && (
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

                {/* Rezervasyon Detayları Modal */}
                {showDetailsModal && selectedReservation && (
                    <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Rezervasyon Detayları</h2>
                                <button 
                                    className="modal-close"
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="modal-body">
                                <div className="reservation-detail-card">
                                    <div className="detail-header">
                                        <h3>{selectedReservation.flight?.flightNumber || 'Bilinmiyor'}</h3>
                                        <p>{selectedReservation.flight?.origin || 'Bilinmiyor'} → {selectedReservation.flight?.destination || 'Bilinmiyor'}</p>
                                        <div 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(selectedReservation.status) }}
                                        >
                                            {getStatusText(selectedReservation.status)}
                                        </div>
                                    </div>

                                    <div className="detail-sections">
                                        <div className="detail-section">
                                            <h4>Uçuş Bilgileri</h4>
                                            <div className="detail-grid">
                                                <div className="detail-item">
                                                    <span className="label">Uçuş Numarası:</span>
                                                    <span className="value">{selectedReservation.flight?.flightNumber || 'Bilinmiyor'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Kalkış:</span>
                                                    <span className="value">{selectedReservation.flight?.origin || 'Bilinmiyor'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Varış:</span>
                                                    <span className="value">{selectedReservation.flight?.destination || 'Bilinmiyor'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Kalkış Saati:</span>
                                                    <span className="value">
                                                        {selectedReservation.flight ? formatTime(selectedReservation.flight.departureTime) : 'Bilinmiyor'}
                                                    </span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Varış Saati:</span>
                                                    <span className="value">
                                                        {selectedReservation.flight ? formatTime(selectedReservation.flight.arrivalTime) : 'Bilinmiyor'}
                                                    </span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Uçuş Tarihi:</span>
                                                    <span className="value">
                                                        {selectedReservation.flight ? formatDate(selectedReservation.flight.departureTime) : 'Bilinmiyor'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h4>Rezervasyon Bilgileri</h4>
                                            <div className="detail-grid">
                                                <div className="detail-item">
                                                    <span className="label">Rezervasyon ID:</span>
                                                    <span className="value">#{selectedReservation.id}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Durum:</span>
                                                    <span className="value">{getStatusText(selectedReservation.status)}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Oluşturulma Tarihi:</span>
                                                    <span className="value">{formatDate(selectedReservation.createdAt)}</span>
                                                </div>
                                                {selectedReservation.cancelledAt && (
                                                    <div className="detail-item">
                                                        <span className="label">İptal Tarihi:</span>
                                                        <span className="value">{formatDate(selectedReservation.cancelledAt)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    Kapat
                                </button>
                                {(selectedReservation.status === 1 || selectedReservation.status === "Active" || selectedReservation.status === "active") && (
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleCancelReservation(selectedReservation.id);
                                        }}
                                        disabled={cancellingId === selectedReservation.id}
                                    >
                                        {cancellingId === selectedReservation.id ? "İptal Ediliyor..." : "İptal Et"}
                                    </button>
                                )}
                                {(selectedReservation.status === 2 || selectedReservation.status === "Cancelled" || selectedReservation.status === "cancelled") && (
                                    <button 
                                        className="btn btn-success"
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleRestoreReservation(selectedReservation.id);
                                        }}
                                        disabled={restoringId === selectedReservation.id}
                                    >
                                        {restoringId === selectedReservation.id ? "Geri Alınıyor..." : "Geri Al"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default BookingsPage;
