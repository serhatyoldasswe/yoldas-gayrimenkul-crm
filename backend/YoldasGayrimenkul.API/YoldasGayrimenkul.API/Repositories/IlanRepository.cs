// Açıklama: EF Core ile SQL Server'a giden asıl sorgu kodları burada.
// Include() → JOIN, Where() → WHERE clause, OrderByDescending() → ORDER BY
using Microsoft.EntityFrameworkCore;
using YoldasGayrimenkul.API.Data;
using YoldasGayrimenkul.API.DTOs;
using YoldasGayrimenkul.API.Models;

namespace YoldasGayrimenkul.API.Repositories;

public class IlanRepository : IIlanRepository
{
    private readonly AppDbContext _context;

    // Constructor Injection — DI container AppDbContext'i inject eder
    public IlanRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Ilan>> GetAllAsync(int kullaniciId, IlanFilterDto? filter = null)
    {
        // IQueryable — sorgu henüz çalışmıyor, sadece inşa ediliyor
        var query = _context.Ilanlar
            .Include(i => i.Kullanici)  // SQL: LEFT JOIN Kullanicilar
            .Where(i => i.KullaniciId == kullaniciId)
            .AsQueryable();

        // Dinamik filtreler — her biri opsiyonel WHERE koşulu ekler
        if (filter != null)
        {
            if (!string.IsNullOrEmpty(filter.IlanTuru))
                query = query.Where(i => i.IlanTuru == filter.IlanTuru);

            if (!string.IsNullOrEmpty(filter.Kategori))
                query = query.Where(i => i.Kategori == filter.Kategori);

            if (!string.IsNullOrEmpty(filter.Durum))
                query = query.Where(i => i.Durum == filter.Durum);

            if (!string.IsNullOrEmpty(filter.Ilce))
                query = query.Where(i => i.Ilce == filter.Ilce);

            if (filter.MinFiyat.HasValue)
                query = query.Where(i => i.Fiyat >= filter.MinFiyat.Value);

            if (filter.MaxFiyat.HasValue)
                query = query.Where(i => i.Fiyat <= filter.MaxFiyat.Value);

            if (!string.IsNullOrEmpty(filter.Arama))
            {
                var arama = filter.Arama.ToLower();
                // SQL: WHERE LOWER(Baslik) LIKE '%arama%' OR LOWER(Ilce) LIKE '%arama%'
                query = query.Where(i =>
                    i.Baslik.ToLower().Contains(arama) ||
                    i.Ilce.ToLower().Contains(arama) ||
                    (i.Aciklama != null && i.Aciklama.ToLower().Contains(arama)));
            }
        }

        // ToListAsync() → sorguyu çalıştırır, SQL Server'a gider
        return await query
            .OrderByDescending(i => i.OlusturulmaTarihi)
            .ToListAsync();
    }

    public async Task<Ilan?> GetByIdAsync(int id, int kullaniciId)
    {
        return await _context.Ilanlar
            .Include(i => i.Kullanici)
            .FirstOrDefaultAsync(i => i.Id == id && i.KullaniciId == kullaniciId);
    }

    public async Task<Ilan> CreateAsync(Ilan ilan)
    {
        ilan.OlusturulmaTarihi = DateTime.UtcNow;
        _context.Ilanlar.Add(ilan);
        await _context.SaveChangesAsync();  // INSERT INTO Ilanlar
        return ilan;
    }

    public async Task<Ilan?> UpdateAsync(int id, Ilan guncelIlan)
    {
        var ilan = await _context.Ilanlar
            .FirstOrDefaultAsync(i => i.Id == id && i.KullaniciId == guncelIlan.KullaniciId);

        if (ilan == null) return null;

        // EF Core change tracker — sadece değişen alanlar UPDATE edilir
        ilan.Baslik = guncelIlan.Baslik;
        ilan.IlanTuru = guncelIlan.IlanTuru;
        ilan.Kategori = guncelIlan.Kategori;
        ilan.Fiyat = guncelIlan.Fiyat;
        ilan.Alan = guncelIlan.Alan;
        ilan.OdaSayisi = guncelIlan.OdaSayisi;
        ilan.Ilce = guncelIlan.Ilce;
        ilan.Adres = guncelIlan.Adres;
        ilan.Aciklama = guncelIlan.Aciklama;
        ilan.Durum = guncelIlan.Durum;
        ilan.MalSahibiAd = guncelIlan.MalSahibiAd;
        ilan.MalSahibiTel = guncelIlan.MalSahibiTel;
        ilan.GuncellemeTarihi = DateTime.UtcNow;

        await _context.SaveChangesAsync();  // UPDATE Ilanlar SET ...
        return ilan;
    }

    public async Task<bool> DeleteAsync(int id, int kullaniciId)
    {
        var ilan = await _context.Ilanlar
            .FirstOrDefaultAsync(i => i.Id == id && i.KullaniciId == kullaniciId);

        if (ilan == null) return false;

        _context.Ilanlar.Remove(ilan);
        await _context.SaveChangesAsync();  // DELETE FROM Ilanlar WHERE Id = @id
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
        => await _context.Ilanlar.AnyAsync(i => i.Id == id);
}