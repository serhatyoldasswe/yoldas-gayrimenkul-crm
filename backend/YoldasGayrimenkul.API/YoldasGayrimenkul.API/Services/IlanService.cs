// Açıklama: İş mantığı burada. Repository'den ham veriyi alır,
// DTO'ya dönüştürür, business rule'ları uygular.
using AutoMapper;
using YoldasGayrimenkul.API.DTOs;
using YoldasGayrimenkul.API.Models;
using YoldasGayrimenkul.API.Repositories;

namespace YoldasGayrimenkul.API.Services;

public class IlanService : IIlanService
{
    private readonly IIlanRepository _repo;
    private readonly IMapper _mapper;  // AutoMapper — Model ↔ DTO dönüşümü

    public IlanService(IIlanRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<IlanDto>> GetAllAsync(int kullaniciId, IlanFilterDto? filter = null)
    {
        var ilanlar = await _repo.GetAllAsync(kullaniciId, filter);
        return _mapper.Map<IEnumerable<IlanDto>>(ilanlar);
    }

    public async Task<IlanDto?> GetByIdAsync(int id, int kullaniciId)
    {
        var ilan = await _repo.GetByIdAsync(id, kullaniciId);
        return ilan == null ? null : _mapper.Map<IlanDto>(ilan);
    }

    public async Task<IlanDto> CreateAsync(IlanCreateDto dto, int kullaniciId)
    {
        var ilan = _mapper.Map<Ilan>(dto);
        ilan.KullaniciId = kullaniciId;
        var olusturulan = await _repo.CreateAsync(ilan);
        return _mapper.Map<IlanDto>(olusturulan);
    }

    public async Task<IlanDto?> UpdateAsync(int id, IlanUpdateDto dto, int kullaniciId)
    {
        var ilan = _mapper.Map<Ilan>(dto);
        ilan.KullaniciId = kullaniciId;
        var guncellenen = await _repo.UpdateAsync(id, ilan);
        return guncellenen == null ? null : _mapper.Map<IlanDto>(guncellenen);
    }

    public async Task<bool> DeleteAsync(int id, int kullaniciId)
        => await _repo.DeleteAsync(id, kullaniciId);
}