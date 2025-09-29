import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type FlightWithPrice, createReservation } from "../services/flightService";
import "./SearchResults.css";

function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState<{flights: FlightWithPrice[], totalCount: number} | null>(null);
    const [searchParams, setSearchParams] = useState<any>(null);
    const [selectedFlight, setSelectedFlight] = useState<FlightWithPrice | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        if (location.state) {
            setSearchResults(location.state.searchResults);
            setSearchParams(location.state.searchParams);
        } else {
            // Eğer state yoksa ana sayfaya yönlendir
            navigate("/");
        }
    }, [location.state, navigate]);

    const handleBookFlight = async (flight: FlightWithPrice) => {
        setSelectedFlight(flight);
        setShowBookingForm(true);
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFlight) return;

        setIsBooking(true);
        try {
            await createReservation(selectedFlight.id);
            alert("Rezervasyon başarıyla oluşturuldu!");
            navigate("/dashboard");
        } catch (error: any) {
            console.error("Rezervasyon hatası:", error);
            alert("Rezervasyon oluşturulurken bir hata oluştu");
        } finally {
            setIsBooking(false);
        }
    };

    const formatTime = (time: string) => {
        return new Date(time).toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (!searchResults) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Uçuşlar yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="search-results">
            <div className="container">
                {/* Header */}
                <div className="results-header">
                    <h1>Uçuş Arama Sonuçları</h1>
                <div className="search-summary">
                    <p>
                        <strong>{searchParams?.from}</strong> → <strong>{searchParams?.to}</strong>
                    </p>
                    <p>
                        {searchParams?.departureDate && formatDate(searchParams.departureDate)}
                        {searchParams?.returnDate && ` - ${formatDate(searchParams.returnDate)}`}
                    </p>
                    <p>{searchParams?.passengers} Yolcu</p>
                </div>
                </div>

                {/* Results Count */}
                <div className="results-count">
                    <h2>{searchResults?.totalCount} uçuş bulundu</h2>
                </div>

                {/* Flights List */}
                <div className="flights-list">
                    {searchResults?.flights.map((flight) => (
                        <div key={flight.id} className="flight-card">
                            <div className="flight-header">
                                <div className="airline-info">
                                    <h3>FlightInfo Airlines</h3>
                                    <p>{flight.flightNumber}</p>
                                </div>
                                <div className="price">
                                    <span className="price-amount">
                                        {flight.prices.length > 0 ? 
                                            `${flight.prices[0].price} ${flight.prices[0].currency}` : 
                                            'Fiyat Yok'
                                        }
                                    </span>
                                    <span className="price-per-person">kişi başı</span>
                                </div>
                            </div>

                            <div className="flight-details">
                                <div className="route-info">
                                    <div className="departure">
                                        <div className="time">{formatTime(flight.departureTime)}</div>
                                        <div className="airport">{flight.origin}</div>
                                        <div className="date">{formatDate(flight.departureTime)}</div>
                                    </div>

                                    <div className="flight-path">
                                        <div className="duration">
                                            {flight.duration ? 
                                                `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m` : 
                                                'Hesaplanıyor...'
                                            }
                                        </div>
                                        <div className="stops">Direkt</div>
                                    </div>

                                    <div className="arrival">
                                        <div className="time">{formatTime(flight.arrivalTime)}</div>
                                        <div className="airport">{flight.destination}</div>
                                        <div className="date">{formatDate(flight.arrivalTime)}</div>
                                    </div>
                                </div>

                                <div className="flight-info">
                                    <div className="info-item">
                                        <span className="label">Durum:</span>
                                        <span className="value">{flight.status}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Kalan Koltuk:</span>
                                        <span className="value">
                                            {flight.prices.length > 0 ? 
                                                flight.prices.reduce((total, price) => total + price.availableSeats, 0) : 
                                                'Bilinmiyor'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flight-actions">
                                <button 
                                    className="book-button"
                                    onClick={() => handleBookFlight(flight)}
                                >
                                    Rezervasyon Yap
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {searchResults?.flights.length === 0 && (
                    <div className="no-results">
                        <div className="no-results-icon">✈️</div>
                        <h3>Uçuş bulunamadı</h3>
                        <p>Arama kriterlerinizi değiştirerek tekrar deneyin</p>
                        <button 
                            className="search-again-button"
                            onClick={() => navigate("/")}
                        >
                            Yeni Arama Yap
                        </button>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {showBookingForm && selectedFlight && (
                <div className="booking-modal">
                    <div className="booking-modal-content">
                        <div className="modal-header">
                            <h3>Rezervasyon Yap</h3>
                            <button 
                                className="close-button"
                                onClick={() => setShowBookingForm(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="flight-summary">
                            <h4>FlightInfo Airlines - {selectedFlight.flightNumber}</h4>
                            <p>{selectedFlight.origin} → {selectedFlight.destination}</p>
                            <p>{formatDate(selectedFlight.departureTime)} - {formatTime(selectedFlight.departureTime)}</p>
                            <p className="price">
                                {selectedFlight.prices.length > 0 ? 
                                    `${selectedFlight.prices[0].price} ${selectedFlight.prices[0].currency}` : 
                                    'Fiyat Yok'
                                }
                            </p>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="booking-form">
                            <div className="booking-confirmation">
                                <p>Bu uçuş için rezervasyon yapmak istediğinizden emin misiniz?</p>
                                <p><strong>Uçuş:</strong> {selectedFlight.flightNumber}</p>
                                <p><strong>Rota:</strong> {selectedFlight.origin} → {selectedFlight.destination}</p>
                                <p><strong>Tarih:</strong> {formatDate(selectedFlight.departureTime)}</p>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setShowBookingForm(false)}
                                >
                                    İptal
                                </button>
                                <button 
                                    type="submit" 
                                    className="confirm-button"
                                    disabled={isBooking}
                                >
                                    {isBooking ? "Rezervasyon Yapılıyor..." : "Rezervasyon Yap"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchResults;
