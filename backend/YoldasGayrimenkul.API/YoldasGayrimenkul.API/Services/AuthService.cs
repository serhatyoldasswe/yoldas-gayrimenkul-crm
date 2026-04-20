// Açıklama: JWT token üretimi ve şifre doğrulama burada.
// BCrypt → şifreler veritabanında hash'li saklanır, düz metin asla tutulmaz.
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using YoldasGayrimenkul.API.Data;
using YoldasGayrimenkul.API.DTOs;
using YoldasGayrimenkul.API.Models;

namespace YoldasGayrimenkul.API.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
    Task<bool> KayitOlAsync(KayitDto dto);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        var kullanici = await _context.Kullanicilar
            .FirstOrDefaultAsync(k => k.Email == dto.Email && k.AktifMi);

        if (kullanici == null) return null;

        // BCrypt.Verify — girilen şifreyi DB'deki hash ile karşılaştırır
        if (!BCrypt.Net.BCrypt.Verify(dto.Sifre, kullanici.SifreHash))
            return null;

        var token = GenerateJwtToken(kullanici);

        return new LoginResponseDto
        {
            Token = token,
            AdSoyad = kullanici.AdSoyad,
            Email = kullanici.Email,
            Rol = kullanici.Rol
        };
    }

    public async Task<bool> KayitOlAsync(KayitDto dto)
    {
        if (await _context.Kullanicilar.AnyAsync(k => k.Email == dto.Email))
            return false;  // Email zaten kayıtlı

        var kullanici = new Kullanici
        {
            AdSoyad = dto.AdSoyad,
            Email = dto.Email,
            // BCrypt.HashPassword → şifreyi güvenli hash'e çevirir (salt otomatik)
            SifreHash = BCrypt.Net.BCrypt.HashPassword(dto.Sifre, 11),
            Telefon = dto.Telefon,
            Rol = "Emlakci"
        };

        _context.Kullanicilar.Add(kullanici);
        await _context.SaveChangesAsync();
        return true;
    }

    private string GenerateJwtToken(Kullanici kullanici)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Claims — token içine gömülen bilgiler
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, kullanici.Id.ToString()),
            new Claim(ClaimTypes.Email, kullanici.Email),
            new Claim(ClaimTypes.Name, kullanici.AdSoyad),
            new Claim(ClaimTypes.Role, kullanici.Rol)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}