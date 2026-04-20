using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YoldasGayrimenkul.API.DTOs;
using YoldasGayrimenkul.API.Services;

namespace YoldasGayrimenkul.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MusterilerController : ControllerBase
{
    private readonly IMusteriService _service;
    public MusterilerController(IMusteriService service) => _service = service;

    private int GetKullaniciId()
        => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET api/musteriler?durum=Sicak&tip=Alici&arama=ahmet
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? durum,
        [FromQuery] string? tip,
        [FromQuery] string? arama)
    {
        var musteriler = await _service.GetAllAsync(GetKullaniciId(), durum, tip, arama);
        return Ok(musteriler);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var musteri = await _service.GetByIdAsync(id, GetKullaniciId());
        return musteri == null ? NotFound() : Ok(musteri);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MusteriCreateDto dto)
    {
        var olusturulan = await _service.CreateAsync(dto, GetKullaniciId());
        return CreatedAtAction(nameof(GetById), new { id = olusturulan.Id }, olusturulan);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] MusteriUpdateDto dto)
    {
        var guncellenen = await _service.UpdateAsync(id, dto, GetKullaniciId());
        return guncellenen == null ? NotFound() : Ok(guncellenen);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var silindi = await _service.DeleteAsync(id, GetKullaniciId());
        return silindi ? NoContent() : NotFound();
    }
}