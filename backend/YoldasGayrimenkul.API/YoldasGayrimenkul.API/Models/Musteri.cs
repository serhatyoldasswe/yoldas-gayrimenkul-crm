namespace YoldasGayrimenkul.API.Models;

public class Musteri
{
    public int Id { get; set; }
    public string AdSoyad { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string MusteriTipi { get; set; } = string.Empty;    
    public string Durum { get; set; } = "Orta";                
    public string? Butce { get; set; }
    public string? IlgiAlani { get; set; }
    public string? TercihIlce { get; set; }
    public string? Notlar { get; set; }
    public int KullaniciId { get; set; }
    public DateTime OlusturulmaTarihi { get; set; } = DateTime.UtcNow;
    public DateTime? GuncellemeTarihi { get; set; }

    public Kullanici Kullanici { get; set; } = null!;
    public ICollection<MusteriIlanIlgi> IlanIlgileri { get; set; } = new List<MusteriIlanIlgi>();
}