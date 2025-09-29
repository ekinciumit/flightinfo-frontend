import api from "./api";

// Backend'den gelen Flight DTO'su (Database şemasına uygun)
export interface Flight {
    id: number;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
}

// FlightPrices tablosu için interface
export interface FlightPrice {
    id: number;
    flightId: number;
    class: string; // "Economy", "Business", "First"
    price: number;
    currency: string; // "TRY", "USD", "EUR"
    availableSeats: number;
    createdAt: string;
}

// Flight + Price bilgileri birleştirilmiş
export interface FlightWithPrice extends Flight {
    prices: FlightPrice[];
    // Hesaplanan alanlar
    duration?: number; // arrivalTime - departureTime (dakika)
}

// User DTO'su (Database şemasına uygun)
export interface User {
    id: number;
    email: string;
    fullName: string;
    role: number; // 0: User, 1: Admin
    createdAt: string;
    isDeleted: boolean;
}

// Rezervasyon DTO'su (Backend'den gelen gerçek veri yapısı)
export interface Reservation {
    id: number;
    userId: number;
    flightId: number;
    status: string | number; // Backend'den string veya number olarak gelebilir
    createdAt: string;
    cancelledAt?: string;
    // Join edilen veriler
    flight?: Flight;
    user?: User;
}

// Uçuş arama parametreleri (basitleştirilmiş)
export interface FlightSearchParams {
    from: string;
    to: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    tripType: "oneway" | "roundtrip";
}

// Tüm uçuşları getir
export async function getAllFlights(): Promise<Flight[]> {
    const response = await api.get<Flight[]>("/Flight");
    return response.data;
}

// Uçuşları fiyat bilgileriyle getir
export async function getAllFlightsWithPrices(): Promise<FlightWithPrice[]> {
    const response = await api.get<FlightWithPrice[]>("/Flight/with-prices");
    return response.data;
}

// Uçuş fiyatlarını getir
export async function getFlightPrices(flightId: number): Promise<FlightPrice[]> {
    const response = await api.get<FlightPrice[]>(`/Flight/${flightId}/prices`);
    return response.data;
}

// Tek uçuş detayları
export async function getFlightDetails(flightId: number): Promise<Flight> {
    const response = await api.get<Flight>(`/Flight/${flightId}`);
    return response.data;
}

// Rezervasyon oluştur (backend'de sadece flightId gerekli)
export async function createReservation(flightId: number): Promise<Reservation> {
    const response = await api.post<Reservation>("/Reservation", { flightId });
    return response.data;
}

// Kullanıcının rezervasyonlarını getir
export async function getUserReservations(): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>("/Reservation");
    return response.data;
}

// Rezervasyonları flight bilgileriyle birlikte getir
export async function getUserReservationsWithFlights(): Promise<Reservation[]> {
    const reservations = await getUserReservations();
    
    // Her rezervasyon için flight bilgilerini çek
    const reservationsWithFlights = await Promise.all(
        reservations.map(async (reservation) => {
            try {
                const flight = await getFlightDetails(reservation.flightId);
                return {
                    ...reservation,
                    flight: flight
                };
            } catch (error) {
                console.error(`Flight ${reservation.flightId} yüklenirken hata:`, error);
                return reservation;
            }
        })
    );
    
    return reservationsWithFlights;
}

// Rezervasyon iptal et
export async function cancelReservation(reservationId: number): Promise<void> {
    await api.delete(`/Reservation/${reservationId}`);
}

// Rezervasyon detayları
export async function getReservationDetails(reservationId: number): Promise<Reservation> {
    const response = await api.get<Reservation>(`/Reservation/${reservationId}`);
    return response.data;
}

// İptal edilen rezervasyonu geri al (gerçek API çağrısı)
export async function restoreReservation(reservationId: number): Promise<Reservation> {
    const response = await api.put<Reservation>(`/Reservation/restore/${reservationId}`);
    return response.data;
}
