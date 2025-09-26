import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllFlights } from "../services/flightService";
import { getAllCountries, getCountryCities, getCityAirports, type Country, type City, type Airport } from "../services/locationService";
import "./HomePage.css";

function HomePage() {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        fromCountry: "",
        fromCity: "",
        toCountry: "",
        toCity: "",
        departureDate: "",
        returnDate: "",
        passengers: 1,
        tripType: "oneway" as "oneway" | "roundtrip"
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [countries, setCountries] = useState<Country[]>([]);
    const [fromCities, setFromCities] = useState<City[]>([]);
    const [toCities, setToCities] = useState<City[]>([]);
    const [fromAirports, setFromAirports] = useState<Airport[]>([]);
    const [toAirports, setToAirports] = useState<Airport[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    // Backend'den ülke verilerini çek
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const countriesData = await getAllCountries();
                setCountries(countriesData);
            } catch (error) {
                console.error("Ülke verileri yüklenirken hata:", error);
            }
        };
        loadCountries();
    }, []);

    // From Country seçildiğinde şehirleri yükle
    useEffect(() => {
        const loadFromCities = async () => {
            if (searchData.fromCountry) {
                try {
                    setIsLoadingCities(true);
                    const selectedCountry = countries.find(c => c.name === searchData.fromCountry);
                    if (selectedCountry) {
                        const cities = await getCountryCities(selectedCountry.id);
                        setFromCities(cities);
                    }
                } catch (error) {
                    console.error("Şehir verileri yüklenirken hata:", error);
                } finally {
                    setIsLoadingCities(false);
                }
            } else {
                setFromCities([]);
                setFromAirports([]);
            }
        };
        loadFromCities();
    }, [searchData.fromCountry, countries]);

    // To Country seçildiğinde şehirleri yükle
    useEffect(() => {
        const loadToCities = async () => {
            if (searchData.toCountry) {
                try {
                    setIsLoadingCities(true);
                    const selectedCountry = countries.find(c => c.name === searchData.toCountry);
                    if (selectedCountry) {
                        const cities = await getCountryCities(selectedCountry.id);
                        setToCities(cities);
                    }
                } catch (error) {
                    console.error("Şehir verileri yüklenirken hata:", error);
                } finally {
                    setIsLoadingCities(false);
                }
            } else {
                setToCities([]);
                setToAirports([]);
            }
        };
        loadToCities();
    }, [searchData.toCountry, countries]);

    // From City seçildiğinde havalimanlarını yükle
    useEffect(() => {
        const loadFromAirports = async () => {
            if (searchData.fromCity) {
                try {
                    const selectedCity = fromCities.find(c => c.name === searchData.fromCity);
                    if (selectedCity) {
                        const airports = await getCityAirports(selectedCity.id);
                        setFromAirports(airports);
                    }
                } catch (error) {
                    console.error("Havalimanı verileri yüklenirken hata:", error);
                }
            } else {
                setFromAirports([]);
            }
        };
        loadFromAirports();
    }, [searchData.fromCity, fromCities]);

    // To City seçildiğinde havalimanlarını yükle
    useEffect(() => {
        const loadToAirports = async () => {
            if (searchData.toCity) {
                try {
                    const selectedCity = toCities.find(c => c.name === searchData.toCity);
                    if (selectedCity) {
                        const airports = await getCityAirports(selectedCity.id);
                        setToAirports(airports);
                    }
                } catch (error) {
                    console.error("Havalimanı verileri yüklenirken hata:", error);
                }
            } else {
                setToAirports([]);
            }
        };
        loadToAirports();
    }, [searchData.toCity, toCities]);



    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Form validasyonu
            if (!searchData.fromCountry || !searchData.fromCity || !searchData.toCountry || !searchData.toCity || !searchData.departureDate) {
                setError("Lütfen tüm gerekli alanları doldurun");
                setIsLoading(false);
                return;
            }

            if (searchData.tripType === "roundtrip" && !searchData.returnDate) {
                setError("Gidiş-dönüş için dönüş tarihi gereklidir");
                setIsLoading(false);
                return;
            }

            // Backend'den tüm uçuşları çek ve filtrele
            const allFlights = await getAllFlights();
            
            // Arama kriterlerine göre filtrele
            const filteredFlights = allFlights.filter(flight => {
                const matchesOrigin = flight.origin.toLowerCase().includes(searchData.fromCity.toLowerCase());
                const matchesDestination = flight.destination.toLowerCase().includes(searchData.toCity.toLowerCase());
                
                // Tarih kontrolü (basit)
                const flightDate = new Date(flight.departureTime).toDateString();
                const searchDate = new Date(searchData.departureDate).toDateString();
                const matchesDate = flightDate === searchDate;
                
                return matchesOrigin && matchesDestination && matchesDate;
            });
            
            // Arama sonuçlarını state'e kaydet ve sonuç sayfasına yönlendir
            navigate("/search-results", { 
                state: { 
                    searchResults: {
                        flights: filteredFlights,
                        totalCount: filteredFlights.length
                    },
                    searchParams: searchData 
                } 
            });

        } catch (err: any) {
            console.error("Uçuş arama hatası:", err);
            setError(err.response?.data?.message || "Uçuş arama sırasında bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Dünyanın Her Yerine Uçun</h1>
                    <p>En uygun fiyatlarla hayalinizdeki destinasyona ulaşın</p>
                </div>
            </section>

            {/* Search Section */}
            <section className="search-section">
                <div className="search-container">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="trip-type">
                            <label>
                                <input
                                    type="radio"
                                    name="tripType"
                                    value="oneway"
                                    checked={searchData.tripType === "oneway"}
                                    onChange={(e) => setSearchData({...searchData, tripType: e.target.value as "oneway" | "roundtrip"})}
                                />
                                Tek Yön
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="tripType"
                                    value="roundtrip"
                                    checked={searchData.tripType === "roundtrip"}
                                    onChange={(e) => setSearchData({...searchData, tripType: e.target.value as "oneway" | "roundtrip"})}
                                />
                                Gidiş-Dönüş
                            </label>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Nereden</label>
                                <div className="location-selector">
                                    <select
                                        value={searchData.fromCountry}
                                        onChange={(e) => setSearchData({...searchData, fromCountry: e.target.value, fromCity: ""})}
                                        className="country-select"
                                    >
                                        <option value="">Ülke Seçin</option>
                                        {countries.map(country => (
                                            <option key={country.code} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={searchData.fromCity}
                                        onChange={(e) => setSearchData({...searchData, fromCity: e.target.value})}
                                        className="city-select"
                                        disabled={!searchData.fromCountry || isLoadingCities}
                                    >
                                        <option value="">
                                            {isLoadingCities ? "Şehirler yükleniyor..." : "Şehir Seçin"}
                                        </option>
                                        {fromCities.map(city => (
                                            <option key={city.id} value={city.name}>
                                                {city.name} - {city.flightTime}
                                            </option>
                                        ))}
                                    </select>
                                    {fromAirports.length > 0 && (
                                        <select className="airport-select">
                                            <option value="">Havalimanı Seçin</option>
                                            {fromAirports.map(airport => (
                                                <option key={airport.id} value={airport.code}>
                                                    {airport.code} - {airport.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Nereye</label>
                                <div className="location-selector">
                                    <select
                                        value={searchData.toCountry}
                                        onChange={(e) => setSearchData({...searchData, toCountry: e.target.value, toCity: ""})}
                                        className="country-select"
                                    >
                                        <option value="">Ülke Seçin</option>
                                        {countries.map(country => (
                                            <option key={country.code} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={searchData.toCity}
                                        onChange={(e) => setSearchData({...searchData, toCity: e.target.value})}
                                        className="city-select"
                                        disabled={!searchData.toCountry || isLoadingCities}
                                    >
                                        <option value="">
                                            {isLoadingCities ? "Şehirler yükleniyor..." : "Şehir Seçin"}
                                        </option>
                                        {toCities.map(city => (
                                            <option key={city.id} value={city.name}>
                                                {city.name} - {city.flightTime}
                                            </option>
                                        ))}
                                    </select>
                                    {toAirports.length > 0 && (
                                        <select className="airport-select">
                                            <option value="">Havalimanı Seçin</option>
                                            {toAirports.map(airport => (
                                                <option key={airport.id} value={airport.code}>
                                                    {airport.code} - {airport.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Gidiş Tarihi</label>
                                <input
                                    type="date"
                                    value={searchData.departureDate}
                                    onChange={(e) => setSearchData({...searchData, departureDate: e.target.value})}
                                />
                            </div>

                            {searchData.tripType === "roundtrip" && (
                                <div className="form-group">
                                    <label>Dönüş Tarihi</label>
                                    <input
                                        type="date"
                                        value={searchData.returnDate}
                                        onChange={(e) => setSearchData({...searchData, returnDate: e.target.value})}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Yolcu Sayısı</label>
                                <select
                                    value={searchData.passengers}
                                    onChange={(e) => setSearchData({...searchData, passengers: parseInt(e.target.value)})}
                                >
                                    {[1,2,3,4,5,6,7,8,9].map(num => (
                                        <option key={num} value={num}>{num} Yolcu</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="search-button" disabled={isLoading}>
                            {isLoading ? "Aranıyor..." : "Uçuş Ara"}
                        </button>
                        
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2>Neden Bizi Seçmelisiniz?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">✈️</div>
                            <h3>Geniş Rota Seçenekleri</h3>
                            <p>Dünya çapında 200+ destinasyona uçuş seçenekleri</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💰</div>
                            <h3>En Uygun Fiyatlar</h3>
                            <p>Rekabetçi fiyatlarla en iyi uçuş deneyimi</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🛡️</div>
                            <h3>Güvenli Rezervasyon</h3>
                            <p>Güvenli ödeme ve anında onay sistemi</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Kolay Yönetim</h3>
                            <p>Rezervasyonlarınızı kolayca yönetin ve değiştirin</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Hemen Başlayın</h2>
                    <p>Hesabınız yok mu? Ücretsiz kayıt olun ve avantajlardan yararlanın</p>
                    <div className="cta-buttons">
                        <Link to="/register" className="btn btn-primary">Kayıt Ol</Link>
                        <Link to="/login" className="btn btn-secondary">Giriş Yap</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
