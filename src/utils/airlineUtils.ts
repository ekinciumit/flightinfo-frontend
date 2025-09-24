// Uçak firması bilgileri ve logoları
export interface AirlineInfo {
    code: string;
    name: string;
    logo: string;
    color: string;
    country: string;
}

// Uçak firması veritabanı
export const airlines: Record<string, AirlineInfo> = {
    'TK': {
        code: 'TK',
        name: 'Turkish Airlines',
        logo: '🇹🇷',
        color: '#E30A17',
        country: 'Türkiye'
    },
    'PC': {
        code: 'PC',
        name: 'Pegasus Airlines',
        logo: '🦅',
        color: '#FF6B35',
        country: 'Türkiye'
    },
    'PGS': {
        code: 'PGS',
        name: 'Pegasus Airlines',
        logo: '🦅',
        color: '#FF6B35',
        country: 'Türkiye'
    },
    'LH': {
        code: 'LH',
        name: 'Lufthansa',
        logo: '🇩🇪',
        color: '#D52B1E',
        country: 'Almanya'
    },
    'AF': {
        code: 'AF',
        name: 'Air France',
        logo: '🇫🇷',
        color: '#002395',
        country: 'Fransa'
    },
    'BA': {
        code: 'BA',
        name: 'British Airways',
        logo: '🇬🇧',
        color: '#E4002B',
        country: 'İngiltere'
    },
    'KL': {
        code: 'KL',
        name: 'KLM Royal Dutch Airlines',
        logo: '🇳🇱',
        color: '#00A1DE',
        country: 'Hollanda'
    },
    'IB': {
        code: 'IB',
        name: 'Iberia',
        logo: '🇪🇸',
        color: '#CC0000',
        country: 'İspanya'
    },
    'AZ': {
        code: 'AZ',
        name: 'Alitalia',
        logo: '🇮🇹',
        color: '#0066CC',
        country: 'İtalya'
    },
    'OS': {
        code: 'OS',
        name: 'Austrian Airlines',
        logo: '🇦🇹',
        color: '#ED1C24',
        country: 'Avusturya'
    },
    'LX': {
        code: 'LX',
        name: 'Swiss International Air Lines',
        logo: '🇨🇭',
        color: '#FF0000',
        country: 'İsviçre'
    },
    'AA': {
        code: 'AA',
        name: 'American Airlines',
        logo: '🇺🇸',
        color: '#1E3A8A',
        country: 'Amerika'
    },
    'DL': {
        code: 'DL',
        name: 'Delta Air Lines',
        logo: '🇺🇸',
        color: '#C8102E',
        country: 'Amerika'
    },
    'UA': {
        code: 'UA',
        name: 'United Airlines',
        logo: '🇺🇸',
        color: '#003DA5',
        country: 'Amerika'
    },
    'EK': {
        code: 'EK',
        name: 'Emirates',
        logo: '🇦🇪',
        color: '#D71921',
        country: 'BAE'
    },
    'EY': {
        code: 'EY',
        name: 'Etihad Airways',
        logo: '🇦🇪',
        color: '#C8102E',
        country: 'BAE'
    },
    'JL': {
        code: 'JL',
        name: 'Japan Airlines',
        logo: '🇯🇵',
        color: '#E60012',
        country: 'Japonya'
    },
    'NH': {
        code: 'NH',
        name: 'ANA (All Nippon Airways)',
        logo: '🇯🇵',
        color: '#E60012',
        country: 'Japonya'
    }
};

// Uçuş numarasından firma kodunu çıkar
export function getAirlineCode(flightNumber: string): string {
    // Uçuş numarasının başındaki harfleri al (TK123 -> TK)
    const match = flightNumber.match(/^([A-Z]+)/);
    return match ? match[1] : 'UNKNOWN';
}

// Uçuş numarasına göre firma bilgisini getir
export function getAirlineInfo(flightNumber: string): AirlineInfo {
    const code = getAirlineCode(flightNumber);
    return airlines[code] || {
        code: 'UNKNOWN',
        name: 'Bilinmeyen Havayolu',
        logo: '✈️',
        color: '#95a5a6',
        country: 'Bilinmiyor'
    };
}

// Firma rengini getir
export function getAirlineColor(flightNumber: string): string {
    return getAirlineInfo(flightNumber).color;
}

// Firma logosunu getir
export function getAirlineLogo(flightNumber: string): string {
    return getAirlineInfo(flightNumber).logo;
}

// Firma adını getir
export function getAirlineName(flightNumber: string): string {
    return getAirlineInfo(flightNumber).name;
}
