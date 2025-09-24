import api from "./api";

// Backend'den gelen veri tipleri
export interface Country {
    id: number;
    code: string;
    name: string;
    flag?: string;
    cities: City[];
}

export interface City {
    id: number;
    name: string;
    countryId: number;
    flightTime: string; // Backend'den gelen uçuş süresi
    airports: Airport[];
}

export interface Airport {
    id: number;
    code: string;
    name: string;
    cityId: number;
}

// API fonksiyonları
export async function getAllCountries(): Promise<Country[]> {
    const response = await api.get<Country[]>("/Country");
    return response.data;
}

export async function getCountryCities(countryId: number): Promise<City[]> {
    const response = await api.get<City[]>(`/Country/${countryId}/cities`);
    return response.data;
}

export async function getCityAirports(cityId: number): Promise<Airport[]> {
    const response = await api.get<Airport[]>(`/Country/cities/${cityId}/airports`);
    return response.data;
}

export async function getCountryById(countryId: number): Promise<Country> {
    const response = await api.get<Country>(`/Country/${countryId}`);
    return response.data;
}
