using FlightInfo.Api.Data;
using FlightInfo.Api.Domain;

namespace FlightInfo.Api.Services
{
    public class SeedDataService
    {
        private readonly AppDbContext _context;

        public SeedDataService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SeedFlightsAsync()
        {
            // Eğer zaten veri varsa ekleme
            if (_context.Flights.Any())
                return;

            var flights = new List<Flight>
            {
                new Flight { FlightNumber = "TK101", Origin = "Istanbul", Destination = "Berlin", DepartureTime = DateTime.Parse("2025-09-24 09:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 11:30:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "TK102", Origin = "Istanbul", Destination = "Paris", DepartureTime = DateTime.Parse("2025-09-24 14:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 16:45:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "TK103", Origin = "Istanbul", Destination = "London", DepartureTime = DateTime.Parse("2025-09-24 18:30:00"), ArrivalTime = DateTime.Parse("2025-09-24 21:15:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "TK104", Origin = "Istanbul", Destination = "Amsterdam", DepartureTime = DateTime.Parse("2025-09-25 08:00:00"), ArrivalTime = DateTime.Parse("2025-09-25 10:30:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "TK105", Origin = "Istanbul", Destination = "Rome", DepartureTime = DateTime.Parse("2025-09-25 12:00:00"), ArrivalTime = DateTime.Parse("2025-09-25 14:45:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "TK106", Origin = "Istanbul", Destination = "Madrid", DepartureTime = DateTime.Parse("2025-09-25 16:00:00"), ArrivalTime = DateTime.Parse("2025-09-25 18:30:00"), Status = "Scheduled" },
                
                new Flight { FlightNumber = "PC201", Origin = "Ankara", Destination = "Istanbul", DepartureTime = DateTime.Parse("2025-09-24 08:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 09:30:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "PC202", Origin = "Ankara", Destination = "Izmir", DepartureTime = DateTime.Parse("2025-09-24 12:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 13:30:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "PC203", Origin = "Ankara", Destination = "Antalya", DepartureTime = DateTime.Parse("2025-09-24 16:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 17:30:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "PC204", Origin = "Ankara", Destination = "Trabzon", DepartureTime = DateTime.Parse("2025-09-25 10:00:00"), ArrivalTime = DateTime.Parse("2025-09-25 11:30:00"), Status = "Scheduled" },
                
                new Flight { FlightNumber = "TK301", Origin = "Izmir", Destination = "Istanbul", DepartureTime = DateTime.Parse("2025-09-24 07:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 08:30:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "TK302", Origin = "Izmir", Destination = "Ankara", DepartureTime = DateTime.Parse("2025-09-24 11:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 12:30:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "TK303", Origin = "Izmir", Destination = "Antalya", DepartureTime = DateTime.Parse("2025-09-24 15:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 16:00:00"), Status = "Scheduled" },
                
                new Flight { FlightNumber = "PGS401", Origin = "Antalya", Destination = "Istanbul", DepartureTime = DateTime.Parse("2025-09-24 09:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 10:30:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "PGS402", Origin = "Antalya", Destination = "Ankara", DepartureTime = DateTime.Parse("2025-09-24 13:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 14:30:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "PGS403", Origin = "Antalya", Destination = "Izmir", DepartureTime = DateTime.Parse("2025-09-24 17:00:00"), ArrivalTime = DateTime.Parse("2025-09-24 18:00:00"), Status = "Scheduled" },
                
                new Flight { FlightNumber = "TK501", Origin = "Istanbul", Destination = "New York", DepartureTime = DateTime.Parse("2025-09-25 22:00:00"), ArrivalTime = DateTime.Parse("2025-09-26 06:00:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "TK502", Origin = "Istanbul", Destination = "Dubai", DepartureTime = DateTime.Parse("2025-09-25 20:00:00"), ArrivalTime = DateTime.Parse("2025-09-26 02:00:00"), Status = "Scheduled" },
                new Flight { FlightNumber = "TK503", Origin = "Istanbul", Destination = "Tokyo", DepartureTime = DateTime.Parse("2025-09-25 18:00:00"), ArrivalTime = DateTime.Parse("2025-09-26 10:00:00"), Status = "Scheduled" }
            };

            _context.Flights.AddRange(flights);
            await _context.SaveChangesAsync();
        }
    }
}
