// Açıklama: Veritabanındaki Kullanicilar tablosunu temsil eder.
// EF Core bu sınıfı okuyup tablo ile eşleştirir.
namespace YoldasGayrimenkul.API.Models;

public class Kullanici
{
    public int Id { get; set; }
    public string AdSoyad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SifreHash { get; set; } = string.Empty;
    public string? Telefon { get; set; }
    public string Rol { get; set; } = "Emlakci";
    public bool AktifMi { get; set; } = true;
    public DateTime OlusturulmaTarihi { get; set; } = DateTime.UtcNow;
    public DateTime? GuncellemeTarihi { get; set; }
    public ICollection<Ilan> Ilanlar { get; set; } = new List<Ilan>();
    public ICollection<Musteri> Musteriler { get; set; } = new List<Musteri>();
    public ICollection<Portfoy> Portfoyler { get; set; } = new List<Portfoy>();
}