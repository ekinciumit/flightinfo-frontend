import api from "./api";

// Backend'den gelen Flight DTO'su
export interface Flight {
    id: number;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
}

// Rezervasyon DTO'su
export interface Reservation {
    id: number;
    userId: number;
    flightId: number;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
    createdAt: string;
    cancelledAt?: string;
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
