namespace YoldasGayrimenkul.API.DTOs;

// GET /api/ilanlar → bu DTO dönecek
public class IlanDto
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
    public string Durum { get; set; } = string.Empty;
    public string? MalSahibiAd { get; set; }
    public string? MalSahibiTel { get; set; }
    public string KullaniciAd { get; set; } = string.Empty;  // JOIN'den gelen
    public DateTime OlusturulmaTarihi { get; set; }
}

// POST/PUT → client bu DTO'yu gönderecek
public class IlanCreateDto
{
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
}

public class IlanUpdateDto : IlanCreateDto { }

// Filtreleme için query parametreleri
public class IlanFilterDto
{
    public string? IlanTuru { get; set; }
    public string? Kategori { get; set; }
    public string? Durum { get; set; }
    public string? Ilce { get; set; }
    public decimal? MinFiyat { get; set; }
    public decimal? MaxFiyat { get; set; }
    public string? Arama { get; set; }
}