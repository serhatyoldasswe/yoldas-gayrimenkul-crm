using YoldasGayrimenkul.API.DTOs;

namespace YoldasGayrimenkul.API.Services;

public interface IMusteriService
{
    Task<IEnumerable<MusteriDto>> GetAllAsync(int kullaniciId, string? durum, string? tip, string? arama);
    Task<MusteriDto?> GetByIdAsync(int id, int kullaniciId);
    Task<MusteriDto> CreateAsync(MusteriCreateDto dto, int kullaniciId);
    Task<MusteriDto?> UpdateAsync(int id, MusteriUpdateDto dto, int kullaniciId);
    Task<bool> DeleteAsync(int id, int kullaniciId);
}