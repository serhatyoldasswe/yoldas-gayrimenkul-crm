using Microsoft.EntityFrameworkCore;
using YoldasGayrimenkul.API.Data;
using YoldasGayrimenkul.API.Models;

namespace YoldasGayrimenkul.API.Repositories;

public class PortfoyRepository : IPortfoyRepository
{
    private readonly AppDbContext _context;
    public PortfoyRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Portfoy>> GetAllAsync(int kullaniciId)
        => await _context.Portfoyler
            .Include(p => p.PortfoyIlanlar)
                .ThenInclude(pi => pi.Ilan)  // İç içe JOIN
            .Where(p => p.KullaniciId == kullaniciId)
            .OrderByDescending(p => p.OlusturulmaTarihi)
            .ToListAsync();

    public async Task<Portfoy?> GetByIdAsync(int id, int kullaniciId)
        => await _context.Portfoyler
            .Include(p => p.PortfoyIlanlar)
                .ThenInclude(pi => pi.Ilan)
            .FirstOrDefaultAsync(p => p.Id == id && p.KullaniciId == kullaniciId);

    public async Task<Portfoy> CreateAsync(Portfoy portfoy, List<int> ilanIdleri)
    {
        portfoy.OlusturulmaTarihi = DateTime.UtcNow;
        _context.Portfoyler.Add(portfoy);
        await _context.SaveChangesAsync();

        // Portföy-ilan bağlantılarını ekle (köprü tablo)
        foreach (var ilanId in ilanIdleri)
        {
            _context.PortfoyIlanlar.Add(new PortfoyIlan
            {
                PortfoyId = portfoy.Id,
                IlanId = ilanId
            });
        }
        await _context.SaveChangesAsync();
        return portfoy;
    }

    public async Task<Portfoy?> UpdateAsync(int id, Portfoy guncellenen, List<int> ilanIdleri)
    {
        var portfoy = await _context.Portfoyler
            .Include(p => p.PortfoyIlanlar)
            .FirstOrDefaultAsync(p => p.Id == id && p.KullaniciId == guncellenen.KullaniciId);

        if (portfoy == null) return null;

        portfoy.Ad = guncellenen.Ad;
        portfoy.Aciklama = guncellenen.Aciklama;
        portfoy.Renk = guncellenen.Renk;
        portfoy.GuncellemeTarihi = DateTime.UtcNow;

        // Mevcut ilan bağlantılarını temizle, yenilerini ekle
        _context.PortfoyIlanlar.RemoveRange(portfoy.PortfoyIlanlar);
        foreach (var ilanId in ilanIdleri)
        {
            _context.PortfoyIlanlar.Add(new PortfoyIlan
            {
                PortfoyId = portfoy.Id,
                IlanId = ilanId
            });
        }

        await _context.SaveChangesAsync();
        return portfoy;
    }

    public async Task<bool> DeleteAsync(int id, int kullaniciId)
    {
        var portfoy = await _context.Portfoyler
            .FirstOrDefaultAsync(p => p.Id == id && p.KullaniciId == kullaniciId);
        if (portfoy == null) return false;
        _context.Portfoyler.Remove(portfoy);
        await _context.SaveChangesAsync();
        return true;
    }
}