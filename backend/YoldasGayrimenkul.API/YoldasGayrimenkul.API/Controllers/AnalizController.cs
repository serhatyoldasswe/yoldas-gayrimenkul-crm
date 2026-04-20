using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YoldasGayrimenkul.API.Services;

namespace YoldasGayrimenkul.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalizController : ControllerBase
{
    private readonly IAnalizService _service;
    public AnalizController(IAnalizService service) => _service = service;

    private int GetKullaniciId()
        => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET api/analiz
    [HttpGet]
    public async Task<IActionResult> GetAnaliz()
    {
        var analiz = await _service.GetAnalizAsync(GetKullaniciId());
        return Ok(analiz);
    }
}