import { useState, useEffect } from "react";
import { getAllFlights, type Flight } from "../services/flightService";
import ConfirmationModal from "../components/ConfirmationModal";
import { getAirlineInfo, getAirlineColor, getAirlineLogo, getAirlineName } from "../utils/airlineUtils";
import "./SearchPage.css";

function SearchPage() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"departure" | "arrival" | "status">("departure");
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [isReserving, setIsReserving] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [flightToReserve, setFlightToReserve] = useState<Flight | null>(null);

    useEffect(() => {
        const loadFlights = async () => {
            try {
                setIsLoading(true);
                const allFlights = await getAllFlights();
                setFlights(allFlights);
                setFilteredFlights(allFlights);
            } catch (error) {
                console.error("Uçuşlar yüklenirken hata:", error);
                setError("Uçuşlar yüklenirken bir hata oluştu");
            } finally {
                setIsLoading(false);
            }
        };

        loadFlights();
    }, []);

    // Arama ve filtreleme
    useEffect(() => {
        let filtered = flights;

        // Arama terimi ile filtrele
        if (searchTerm) {
            filtered = filtered.filter(flight => 
                flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                flight.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sıralama
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "departure":
                    return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
                case "arrival":
                    return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
                case "status":
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        setFilteredFlights(filtered);
    }, [flights, searchTerm, sortBy]);

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OnTime": return "#27ae60";
            case "Delayed": return "#f39c12";
            case "Cancelled": return "#e74c3c";
            case "Boarding": return "#3498db";
            case "Scheduled": return "#9b59b6";
            case "Completed": return "#2ecc71";
            case "InProgress": return "#e67e22";
            default: return "#95a5a6";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "OnTime": return "Zamanında";
            case "Delayed": return "Gecikmeli";
            case "Cancelled": return "İptal";
            case "Boarding": return "Biniş";
            case "Scheduled": return "Planlandı";
            case "Completed": return "Tamamlandı";
            case "InProgress": return "Devam Ediyor";
            default: return "Bilinmiyor";
        }
    };

    const handleShowDetails = (flight: Flight) => {
        setSelectedFlight(flight);
        setShowDetailsModal(true);
    };

    const handleReserveFlight = (flight: Flight) => {
        if (!localStorage.getItem("token")) {
            (window as any).showToast.error(
                "Giriş Gerekli", 
                "Rezervasyon yapmak için giriş yapmanız gerekiyor!"
            );
            return;
        }

        if (flight.status === "Cancelled") {
            (window as any).showToast.warning(
                "Rezervasyon Yapılamaz", 
                "İptal edilmiş uçuşu rezerve edemezsiniz!"
            );
            return;
        }

        setFlightToReserve(flight);
        setShowConfirmModal(true);
    };

    const confirmReservation = async () => {
        if (!flightToReserve) return;

        try {
            setIsReserving(true);
            setShowConfirmModal(false);
            
            // Burada gerçek rezervasyon API çağrısı yapılacak
            // Şimdilik mock bir rezervasyon
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
            
            (window as any).showToast.success(
                "Rezervasyon Başarılı", 
                `${flightToReserve.flightNumber} uçuşu başarıyla rezerve edildi!`
            );
        } catch (error) {
            console.error("Rezervasyon hatası:", error);
            (window as any).showToast.error(
                "Rezervasyon Hatası", 
                "Rezervasyon sırasında bir hata oluştu!"
            );
        } finally {
            setIsReserving(false);
            setFlightToReserve(null);
        }
    };

    if (isLoading) {
        return (
            <div className="search-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <h2>Uçuşlar yükleniyor...</h2>
                        <p>Tüm uçuş bilgileri getiriliyor</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="search-page">
                <div className="container">
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <h2>Hata Oluştu</h2>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            Tekrar Dene
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="search-page">
            <div className="container">
                {/* Header */}
                <div className="search-header">
                    <h1>Tüm Uçuşlar</h1>
                    <p>Mevcut tüm uçuş seçeneklerini keşfedin</p>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Uçuş numarası, kalkış veya varış yeri ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="sort-options">
                        <label>Sırala:</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as "departure" | "arrival" | "status")}
                            className="sort-select"
                        >
                            <option value="departure">Kalkış Saati</option>
                            <option value="arrival">Varış Saati</option>
                            <option value="status">Durum</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-section">
                    <div className="stat-card">
                        <span className="stat-number">{flights.length}</span>
                        <span className="stat-label">Toplam Uçuş</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{filteredFlights.length}</span>
                        <span className="stat-label">Filtrelenmiş</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{flights.filter(f => f.status === "Scheduled").length}</span>
                        <span className="stat-label">Planlandı</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{flights.filter(f => f.status === "OnTime").length}</span>
                        <span className="stat-label">Zamanında</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{flights.filter(f => f.status === "Delayed").length}</span>
                        <span className="stat-label">Gecikmeli</span>
                    </div>
                </div>

                {/* Flights List */}
                {filteredFlights.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">✈️</div>
                        <h3>Arama kriterlerinize uygun uçuş bulunamadı</h3>
                        <p>Farklı arama terimleri deneyin veya filtreleri temizleyin</p>
                        <button 
                            onClick={() => setSearchTerm("")} 
                            className="btn btn-secondary"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                ) : (
                    <div className="flights-grid">
                        {filteredFlights.map(flight => (
                            <div key={flight.id} className="flight-card">
                                <div className="flight-header">
                                    <div className="flight-number">
                                        <div className="airline-section">
                                            <div className="airline-logo">
                                                {getAirlineLogo(flight.flightNumber)}
                                            </div>
                                            <div className="flight-info">
                                                <span className="flight-code">{flight.flightNumber}</span>
                                                <span className="airline-name">{getAirlineName(flight.flightNumber)}</span>
                                            </div>
                                        </div>
                                        <span className="flight-route">{flight.origin} → {flight.destination}</span>
                                    </div>
                                    <div 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(flight.status) }}
                                    >
                                        {getStatusText(flight.status)}
                                    </div>
                                </div>

                                <div className="flight-details">
                                    <div className="time-info">
                                        <div className="departure">
                                            <span className="time-label">Kalkış</span>
                                            <span className="time-value">{formatTime(flight.departureTime)}</span>
                                            <span className="date-value">{formatDate(flight.departureTime)}</span>
                                        </div>
                                        <div className="flight-duration">
                                            <span className="duration-icon">✈️</span>
                                        </div>
                                        <div className="arrival">
                                            <span className="time-label">Varış</span>
                                            <span className="time-value">{formatTime(flight.arrivalTime)}</span>
                                            <span className="date-value">{formatDate(flight.arrivalTime)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flight-actions">
                                    <button 
                                        className="btn btn-outline"
                                        onClick={() => handleShowDetails(flight)}
                                    >
                                        Detaylar
                                    </button>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleReserveFlight(flight)}
                                        disabled={isReserving || flight.status === "Cancelled"}
                                    >
                                        {isReserving ? "Rezerve Ediliyor..." : "Rezerve Et"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Flight Details Modal */}
                {showDetailsModal && selectedFlight && (
                    <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Uçuş Detayları</h2>
                                <button 
                                    className="modal-close"
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="modal-body">
                                <div className="flight-detail-card">
                                    <div className="flight-detail-header">
                                        <div className="flight-info">
                                            <h3>{selectedFlight.flightNumber}</h3>
                                            <p>{selectedFlight.origin} → {selectedFlight.destination}</p>
                                        </div>
                                        <div 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(selectedFlight.status) }}
                                        >
                                            {getStatusText(selectedFlight.status)}
                                        </div>
                                    </div>

                                    <div className="flight-detail-info">
                                        <div className="detail-section">
                                            <h4>Kalkış Bilgileri</h4>
                                            <div className="detail-item">
                                                <span className="label">Havalimanı:</span>
                                                <span className="value">{selectedFlight.origin}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Tarih:</span>
                                                <span className="value">{formatDate(selectedFlight.departureTime)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Saat:</span>
                                                <span className="value">{formatTime(selectedFlight.departureTime)}</span>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h4>Varış Bilgileri</h4>
                                            <div className="detail-item">
                                                <span className="label">Havalimanı:</span>
                                                <span className="value">{selectedFlight.destination}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Tarih:</span>
                                                <span className="value">{formatDate(selectedFlight.arrivalTime)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Saat:</span>
                                                <span className="value">{formatTime(selectedFlight.arrivalTime)}</span>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h4>Uçuş Bilgileri</h4>
                                            <div className="detail-item">
                                                <span className="label">Uçuş Numarası:</span>
                                                <span className="value">{selectedFlight.flightNumber}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Durum:</span>
                                                <span className="value">{getStatusText(selectedFlight.status)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Uçuş Süresi:</span>
                                                <span className="value">
                                                    {Math.round((new Date(selectedFlight.arrivalTime).getTime() - new Date(selectedFlight.departureTime).getTime()) / (1000 * 60 * 60))} saat
                                                </span>
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
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        handleReserveFlight(selectedFlight);
                                    }}
                                    disabled={isReserving || selectedFlight.status === "Cancelled"}
                                >
                                    {isReserving ? "Rezerve Ediliyor..." : "Rezerve Et"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showConfirmModal}
                    title="Rezervasyon Onayı"
                    message={`${flightToReserve?.flightNumber} uçuşunu rezerve etmek istediğinizden emin misiniz?`}
                    confirmText="Rezerve Et"
                    cancelText="İptal"
                    type="info"
                    onConfirm={confirmReservation}
                    onCancel={() => {
                        setShowConfirmModal(false);
                        setFlightToReserve(null);
                    }}
                />
            </div>
        </div>
    );
}

export default SearchPage;
