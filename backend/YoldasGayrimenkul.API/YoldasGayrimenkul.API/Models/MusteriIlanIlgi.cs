namespace YoldasGayrimenkul.API.Models;

public class MusteriIlanIlgi
{
    public int Id { get; set; }
    public int MusteriId { get; set; }
    public int IlanId { get; set; }
    public string? Notlar { get; set; }
    public DateTime Tarih { get; set; } = DateTime.UtcNow;

    public Musteri Musteri { get; set; } = null!;
    public Ilan Ilan { get; set; } = null!;
}