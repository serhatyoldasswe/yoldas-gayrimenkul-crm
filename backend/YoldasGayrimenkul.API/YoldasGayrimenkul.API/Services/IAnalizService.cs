using YoldasGayrimenkul.API.DTOs;

namespace YoldasGayrimenkul.API.Services;

public interface IAnalizService
{
    Task<AnalizDto> GetAnalizAsync(int kullaniciId);
}