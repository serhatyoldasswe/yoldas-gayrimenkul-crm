using Microsoft.EntityFrameworkCore;
using YoldasGayrimenkul.API.Data;
using YoldasGayrimenkul.API.Models;

namespace YoldasGayrimenkul.API.Repositories;

public class MusteriRepository : IMusteriRepository
{
    private readonly AppDbContext _context;
    public MusteriRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Musteri>> GetAllAsync(
        int kullaniciId, string? durum = null, string? tip = null, string? arama = null)
    {
        var query = _context.Musteriler
            .Where(m => m.KullaniciId == kullaniciId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(durum))
            query = query.Where(m => m.Durum == durum);

        if (!string.IsNullOrEmpty(tip))
            query = query.Where(m => m.MusteriTipi == tip);

        if (!string.IsNullOrEmpty(arama))
        {
            var a = arama.ToLower();
            query = query.Where(m =>
                m.AdSoyad.ToLower().Contains(a) ||
                m.Telefon.Contains(a) ||
                (m.Email != null && m.Email.ToLower().Contains(a)));
        }

        return await query.OrderByDescending(m => m.OlusturulmaTarihi).ToListAsync();
    }

    public async Task<Musteri?> GetByIdAsync(int id, int kullaniciId)
        => await _context.Musteriler
            .FirstOrDefaultAsync(m => m.Id == id && m.KullaniciId == kullaniciId);

    public async Task<Musteri> CreateAsync(Musteri musteri)
    {
        musteri.OlusturulmaTarihi = DateTime.UtcNow;
        _context.Musteriler.Add(musteri);
        await _context.SaveChangesAsync();
        return musteri;
    }

    public async Task<Musteri?> UpdateAsync(int id, Musteri guncellenen)
    {
        var musteri = await _context.Musteriler
            .FirstOrDefaultAsync(m => m.Id == id && m.KullaniciId == guncellenen.KullaniciId);

        if (musteri == null) return null;

        musteri.AdSoyad = guncellenen.AdSoyad;
        musteri.Telefon = guncellenen.Telefon;
        musteri.Email = guncellenen.Email;
        musteri.MusteriTipi = guncellenen.MusteriTipi;
        musteri.Durum = guncellenen.Durum;
        musteri.Butce = guncellenen.Butce;
        musteri.IlgiAlani = guncellenen.IlgiAlani;
        musteri.TercihIlce = guncellenen.TercihIlce;
        musteri.Notlar = guncellenen.Notlar;
        musteri.GuncellemeTarihi = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return musteri;
    }

    public async Task<bool> DeleteAsync(int id, int kullaniciId)
    {
        var musteri = await _context.Musteriler
            .FirstOrDefaultAsync(m => m.Id == id && m.KullaniciId == kullaniciId);
        if (musteri == null) return false;
        _context.Musteriler.Remove(musteri);
        await _context.SaveChangesAsync();
        return true;
    }
}