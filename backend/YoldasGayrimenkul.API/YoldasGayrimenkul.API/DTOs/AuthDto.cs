namespace YoldasGayrimenkul.API.DTOs;

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Sifre { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string AdSoyad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
}

public class KayitDto
{
    public string AdSoyad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Sifre { get; set; } = string.Empty;
    public string? Telefon { get; set; }
}

// Analiz endpoint'i için özel DTO
public class AnalizDto
{
    public int ToplamIlan { get; set; }
    public int AktifIlan { get; set; }
    public int ToplamMusteri { get; set; }
    public int SicakMusteri { get; set; }
    public decimal ToplamPortfoyDegeri { get; set; }
    public int KapananIslem { get; set; }
    public List<IlceIlanSayisi> IlceIlanDagilimi { get; set; } = new();
    public List<KategoriSayisi> KategoriDagilimi { get; set; } = new();
}

public class IlceIlanSayisi
{
    public string Ilce { get; set; } = string.Empty;
    public int Sayi { get; set; }
    public decimal OrtalamaFiyat { get; set; }
}

public class KategoriSayisi
{
    public string Kategori { get; set; } = string.Empty;
    public int Sayi { get; set; }
}