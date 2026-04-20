using YoldasGayrimenkul.API.Models;

namespace YoldasGayrimenkul.API.Repositories;

public interface IMusteriRepository
{
    Task<IEnumerable<Musteri>> GetAllAsync(int kullaniciId, string? durum = null, string? tip = null, string? arama = null);
    Task<Musteri?> GetByIdAsync(int id, int kullaniciId);
    Task<Musteri> CreateAsync(Musteri musteri);
    Task<Musteri?> UpdateAsync(int id, Musteri musteri);
    Task<bool> DeleteAsync(int id, int kullaniciId);
}