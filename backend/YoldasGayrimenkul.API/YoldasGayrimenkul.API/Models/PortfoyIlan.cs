namespace YoldasGayrimenkul.API.Models;

public class PortfoyIlan
{
    public int PortfoyId { get; set; }
    public int IlanId { get; set; }
    public DateTime EklenmeTarihi { get; set; } = DateTime.UtcNow;

    public Portfoy Portfoy { get; set; } = null!;
    public Ilan Ilan { get; set; } = null!;
}