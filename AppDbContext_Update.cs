// AppDbContext.cs dosyasına eklenecek:

public DbSet<Country> Countries { get; set; }
public DbSet<City> Cities { get; set; }
public DbSet<Airport> Airports { get; set; }

// OnModelCreating metoduna eklenecek:

// Country - City relationship
modelBuilder.Entity<City>()
    .HasOne(c => c.Country)
    .WithMany(co => co.Cities)
    .HasForeignKey(c => c.CountryId)
    .OnDelete(DeleteBehavior.Cascade);

// City - Airport relationship
modelBuilder.Entity<Airport>()
    .HasOne(a => a.City)
    .WithMany(c => c.Airports)
    .HasForeignKey(a => a.CityId)
    .OnDelete(DeleteBehavior.Cascade);
