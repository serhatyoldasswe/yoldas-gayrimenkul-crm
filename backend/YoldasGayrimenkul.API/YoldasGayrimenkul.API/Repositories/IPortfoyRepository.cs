using YoldasGayrimenkul.API.Models;

namespace YoldasGayrimenkul.API.Repositories;

public interface IPortfoyRepository
{
    Task<IEnumerable<Portfoy>> GetAllAsync(int kullaniciId);
    Task<Portfoy?> GetByIdAsync(int id, int kullaniciId);
    Task<Portfoy> CreateAsync(Portfoy portfoy, List<int> ilanIdleri);
    Task<Portfoy?> UpdateAsync(int id, Portfoy portfoy, List<int> ilanIdleri);
    Task<bool> DeleteAsync(int id, int kullaniciId);
}