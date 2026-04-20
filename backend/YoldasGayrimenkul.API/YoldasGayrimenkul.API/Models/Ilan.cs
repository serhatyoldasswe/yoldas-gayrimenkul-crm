namespace YoldasGayrimenkul.API.Models;

public class Ilan
{
    public int Id { get; set; }
    public string Baslik { get; set; } = string.Empty;
    public string IlanTuru { get; set; } = string.Empty;       
    public string Kategori { get; set; } = string.Empty;       
    public decimal Fiyat { get; set; }
    public int? Alan { get; set; }
    public string? OdaSayisi { get; set; }
    public string Ilce { get; set; } = string.Empty;
    public string? Adres { get; set; }
    public string? Aciklama { get; set; }
    public string Durum { get; set; } = "Aktif";
    public string? MalSahibiAd { get; set; }
    public string? MalSahibiTel { get; set; }
    public int KullaniciId { get; set; }
    public DateTime OlusturulmaTarihi { get; set; } = DateTime.UtcNow;
    public DateTime? GuncellemeTarihi { get; set; }
    public Kullanici Kullanici { get; set; } = null!;
    public ICollection<PortfoyIlan> PortfoyIlanlar { get; set; } = new List<PortfoyIlan>();
    public ICollection<MusteriIlanIlgi> MusteriIlgileri { get; set; } = new List<MusteriIlanIlgi>();
}