// Açıklama: Interface — neyin implemente edileceğini tanımlar.
// Bağımlılık enjeksiyonu bu interface üzerinden çalışır.
using YoldasGayrimenkul.API.DTOs;
using YoldasGayrimenkul.API.Models;

namespace YoldasGayrimenkul.API.Repositories;

public interface IIlanRepository
{
    Task<IEnumerable<Ilan>> GetAllAsync(int kullaniciId, IlanFilterDto? filter = null);
    Task<Ilan?> GetByIdAsync(int id, int kullaniciId);
    Task<Ilan> CreateAsync(Ilan ilan);
    Task<Ilan?> UpdateAsync(int id, Ilan ilan);
    Task<bool> DeleteAsync(int id, int kullaniciId);
    Task<bool> ExistsAsync(int id);
}