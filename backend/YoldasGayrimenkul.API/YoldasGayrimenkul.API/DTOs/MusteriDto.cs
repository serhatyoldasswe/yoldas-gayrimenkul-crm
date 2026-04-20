namespace YoldasGayrimenkul.API.DTOs;

public class MusteriDto
{
    public int Id { get; set; }
    public string AdSoyad { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string MusteriTipi { get; set; } = string.Empty;
    public string Durum { get; set; } = string.Empty;
    public string? Butce { get; set; }
    public string? IlgiAlani { get; set; }
    public string? TercihIlce { get; set; }
    public string? Notlar { get; set; }
    public DateTime OlusturulmaTarihi { get; set; }
}

public class MusteriCreateDto
{
    public string AdSoyad { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string MusteriTipi { get; set; } = string.Empty;
    public string Durum { get; set; } = "Orta";
    public string? Butce { get; set; }
    public string? IlgiAlani { get; set; }
    public string? TercihIlce { get; set; }
    public string? Notlar { get; set; }
}

public class MusteriUpdateDto : MusteriCreateDto { }