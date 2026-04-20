using Microsoft.AspNetCore.Mvc;
using YoldasGayrimenkul.API.DTOs;
using YoldasGayrimenkul.API.Services;

namespace YoldasGayrimenkul.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService) => _authService = authService;

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var sonuc = await _authService.LoginAsync(dto);
        if (sonuc == null)
            return Unauthorized(new { message = "Email veya şifre hatalı." });

        return Ok(sonuc);
    }

    // POST api/auth/kayit
    [HttpPost("kayit")]
    public async Task<IActionResult> Kayit([FromBody] KayitDto dto)
    {
        var basarili = await _authService.KayitOlAsync(dto);
        if (!basarili)
            return BadRequest(new { message = "Bu email zaten kayıtlı." });

        return Ok(new { message = "Kayıt başarılı." });
    }
}