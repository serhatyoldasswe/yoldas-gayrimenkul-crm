namespace YoldasGayrimenkul.API.DTOs;

public class PortfoyDto
{
    public int Id { get; set; }
    public string Ad { get; set; } = string.Empty;
    public string? Aciklama { get; set; }
    public string Renk { get; set; } = string.Empty;
    public List<IlanDto> Ilanlar { get; set; } = new();
    public DateTime OlusturulmaTarihi { get; set; }
}

public class PortfoyCreateDto
{
    public string Ad { get; set; } = string.Empty;
    public string? Aciklama { get; set; }
    public string Renk { get; set; } = "#E8570A";
    public List<int> IlanIdleri { get; set; } = new();  // Portföye eklenecek ilan ID'leri
}

public class PortfoyUpdateDto : PortfoyCreateDto { }