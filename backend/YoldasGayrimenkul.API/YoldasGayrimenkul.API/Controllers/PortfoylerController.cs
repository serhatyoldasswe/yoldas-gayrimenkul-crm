using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YoldasGayrimenkul.API.DTOs;
using YoldasGayrimenkul.API.Models;
using YoldasGayrimenkul.API.Repositories;

namespace YoldasGayrimenkul.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PortfoylerController : ControllerBase
{
    private readonly IPortfoyRepository _repo;
    private readonly IMapper _mapper;

    public PortfoylerController(IPortfoyRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    private int GetKullaniciId()
        => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var portfoyler = await _repo.GetAllAsync(GetKullaniciId());
        return Ok(_mapper.Map<IEnumerable<PortfoyDto>>(portfoyler));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var portfoy = await _repo.GetByIdAsync(id, GetKullaniciId());
        return portfoy == null ? NotFound() : Ok(_mapper.Map<PortfoyDto>(portfoy));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PortfoyCreateDto dto)
    {
        var portfoy = _mapper.Map<Portfoy>(dto);
        portfoy.KullaniciId = GetKullaniciId();
        var olusturulan = await _repo.CreateAsync(portfoy, dto.IlanIdleri);
        return CreatedAtAction(nameof(GetById),
            new { id = olusturulan.Id },
            _mapper.Map<PortfoyDto>(olusturulan));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PortfoyUpdateDto dto)
    {
        var portfoy = _mapper.Map<Portfoy>(dto);
        portfoy.KullaniciId = GetKullaniciId();
        var guncellenen = await _repo.UpdateAsync(id, portfoy, dto.IlanIdleri);
        return guncellenen == null ? NotFound() : Ok(_mapper.Map<PortfoyDto>(guncellenen));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var silindi = await _repo.DeleteAsync(id, GetKullaniciId());
        return silindi ? NoContent() : NotFound();
    }
}