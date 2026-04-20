// Açıklama: EF Core'un kalbi. Hangi tablolar var, aralarındaki ilişkiler nasıl
// kurulacak, composite key'ler nerede var — hepsini burada tanımlıyoruz.
using Microsoft.EntityFrameworkCore;
using YoldasGayrimenkul.API.Models;

namespace YoldasGayrimenkul.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Her DbSet bir SQL tablosuna karşılık gelir
    public DbSet<Kullanici> Kullanicilar => Set<Kullanici>();
    public DbSet<Ilan> Ilanlar => Set<Ilan>();
    public DbSet<Musteri> Musteriler => Set<Musteri>();
    public DbSet<Portfoy> Portfoyler => Set<Portfoy>();
    public DbSet<PortfoyIlan> PortfoyIlanlar => Set<PortfoyIlan>();
    public DbSet<MusteriIlanIlgi> MusteriIlanIlgiler => Set<MusteriIlanIlgi>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // PortfoyIlan — composite primary key tanımı
        // EF Core bunu otomatik anlayamaz, elle belirtmemiz gerekir
        modelBuilder.Entity<PortfoyIlan>()
            .HasKey(pi => new { pi.PortfoyId, pi.IlanId });

        modelBuilder.Entity<PortfoyIlan>()
            .HasOne(pi => pi.Portfoy)
            .WithMany(p => p.PortfoyIlanlar)
            .HasForeignKey(pi => pi.PortfoyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PortfoyIlan>()
            .HasOne(pi => pi.Ilan)
            .WithMany(i => i.PortfoyIlanlar)
            .HasForeignKey(pi => pi.IlanId)
            .OnDelete(DeleteBehavior.Cascade);

        // Kullanici → Ilan: bir kullanıcı silinince ilanlar da silinmesin
        modelBuilder.Entity<Ilan>()
            .HasOne(i => i.Kullanici)
            .WithMany(k => k.Ilanlar)
            .HasForeignKey(i => i.KullaniciId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Musteri>()
            .HasOne(m => m.Kullanici)
            .WithMany(k => k.Musteriler)
            .HasForeignKey(m => m.KullaniciId)
            .OnDelete(DeleteBehavior.Restrict);

        // Decimal precision — SQL Server için fiyat alanında hassasiyet
        modelBuilder.Entity<Ilan>()
            .Property(i => i.Fiyat)
            .HasPrecision(18, 2);

        // Email unique index
        modelBuilder.Entity<Kullanici>()
            .HasIndex(k => k.Email)
            .IsUnique();

        base.OnModelCreating(modelBuilder);
    }
}