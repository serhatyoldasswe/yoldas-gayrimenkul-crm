namespace YoldasGayrimenkul.API.Models;

public class Portfoy
{
    public int Id { get; set; }
    public string Ad { get; set; } = string.Empty;
    public string? Aciklama { get; set; }
    public string Renk { get; set; } = "#E8570A";
    public int KullaniciId { get; set; }
    public DateTime OlusturulmaTarihi { get; set; } = DateTime.UtcNow;
    public DateTime? GuncellemeTarihi { get; set; }

    public Kullanici Kullanici { get; set; } = null!;
    public ICollection<PortfoyIlan> PortfoyIlanlar { get; set; } = new List<PortfoyIlan>();
}