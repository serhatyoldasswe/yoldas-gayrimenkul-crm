// Açıklama: RESTful API endpoint'leri.
// [Authorize] → JWT token olmadan erişilemez.
// GetKullaniciId() → Token'dan logged-in kullanıcının ID'sini alır.
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YoldasGayrimenkul.API.DTOs;
using YoldasGayrimenkul.API.Services;

namespace YoldasGayrimenkul.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]  // Tüm endpoint'ler JWT gerektirir
public class IlanlarController : ControllerBase
{
    private readonly IIlanService _service;
    public IlanlarController(IIlanService service) => _service = service;

    // Token'dan kullanıcı ID'sini çeker — her controller'da kullanıyoruz
    private int GetKullaniciId()
        => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET api/ilanlar
    // GET api/ilanlar?ilanTuru=Satilik&ilce=Karsiyaka&arama=daire
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] IlanFilterDto filter)
    {
        var ilanlar = await _service.GetAllAsync(GetKullaniciId(), filter);
        return Ok(ilanlar);
    }

    // GET api/ilanlar/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ilan = await _service.GetByIdAsync(id, GetKullaniciId());
        return ilan == null ? NotFound() : Ok(ilan);
    }

    // POST api/ilanlar
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] IlanCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var olusturulan = await _service.CreateAsync(dto, GetKullaniciId());
        // 201 Created + Location header ile döner
        return CreatedAtAction(nameof(GetById), new { id = olusturulan.Id }, olusturulan);
    }

    // PUT api/ilanlar/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] IlanUpdateDto dto)
    {
        var guncellenen = await _service.UpdateAsync(id, dto, GetKullaniciId());
        return guncellenen == null ? NotFound() : Ok(guncellenen);
    }

    // DELETE api/ilanlar/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var silindi = await _service.DeleteAsync(id, GetKullaniciId());
        return silindi ? NoContent() : NotFound();  // 204 No Content başarıda
    }
}