using Microsoft.EntityFrameworkCore;
using YoldasGayrimenkul.API.Data;
using YoldasGayrimenkul.API.DTOs;

namespace YoldasGayrimenkul.API.Services;

public class AnalizService : IAnalizService
{
    private readonly AppDbContext _context;
    public AnalizService(AppDbContext context) => _context = context;

    public async Task<AnalizDto> GetAnalizAsync(int kullaniciId)
    {
        // LINQ sorguları — EF Core bunları SQL'e çevirir
        var ilanlar = await _context.Ilanlar
            .Where(i => i.KullaniciId == kullaniciId)
            .ToListAsync();

        var musteriler = await _context.Musteriler
            .Where(m => m.KullaniciId == kullaniciId)
            .ToListAsync();
        var ilceDagilimi = ilanlar
            .GroupBy(i => i.Ilce)
            .Select(g => new IlceIlanSayisi
            {
                Ilce = g.Key,
                Sayi = g.Count(),
                OrtalamaFiyat = Math.Round(g.Average(i => i.Fiyat), 0)
            })
            .OrderByDescending(x => x.Sayi)
            .Take(8)
            .ToList();

        var kategoriDagilimi = ilanlar
            .GroupBy(i => i.Kategori)
            .Select(g => new KategoriSayisi
            {
                Kategori = g.Key,
                Sayi = g.Count()
            })
            .OrderByDescending(x => x.Sayi)
            .ToList();

        return new AnalizDto
        {
            ToplamIlan = ilanlar.Count,
            AktifIlan = ilanlar.Count(i => i.Durum == "Aktif"),
            ToplamMusteri = musteriler.Count,
            SicakMusteri = musteriler.Count(m => m.Durum == "Sicak"),
            ToplamPortfoyDegeri = ilanlar
                .Where(i => i.IlanTuru == "Satilik" && i.Durum == "Aktif")
                .Sum(i => i.Fiyat),
            KapananIslem = ilanlar.Count(i => i.Durum == "Satildi" || i.Durum == "Kiralik"),
            IlceIlanDagilimi = ilceDagilimi,
            KategoriDagilimi = kategoriDagilimi
        };
    }
}