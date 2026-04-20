using YoldasGayrimenkul.API.DTOs;

namespace YoldasGayrimenkul.API.Services;

public interface IIlanService
{
    Task<IEnumerable<IlanDto>> GetAllAsync(int kullaniciId, IlanFilterDto? filter = null);
    Task<IlanDto?> GetByIdAsync(int id, int kullaniciId);
    Task<IlanDto> CreateAsync(IlanCreateDto dto, int kullaniciId);
    Task<IlanDto?> UpdateAsync(int id, IlanUpdateDto dto, int kullaniciId);
    Task<bool> DeleteAsync(int id, int kullaniciId);
}