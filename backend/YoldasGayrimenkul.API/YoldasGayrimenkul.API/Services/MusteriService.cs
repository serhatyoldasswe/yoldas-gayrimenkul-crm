using AutoMapper;
using YoldasGayrimenkul.API.DTOs;
using YoldasGayrimenkul.API.Models;
using YoldasGayrimenkul.API.Repositories;

namespace YoldasGayrimenkul.API.Services;

public class MusteriService : IMusteriService
{
    private readonly IMusteriRepository _repo;
    private readonly IMapper _mapper;

    public MusteriService(IMusteriRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<MusteriDto>> GetAllAsync(
        int kullaniciId, string? durum, string? tip, string? arama)
    {
        var musteriler = await _repo.GetAllAsync(kullaniciId, durum, tip, arama);
        return _mapper.Map<IEnumerable<MusteriDto>>(musteriler);
    }

    public async Task<MusteriDto?> GetByIdAsync(int id, int kullaniciId)
    {
        var musteri = await _repo.GetByIdAsync(id, kullaniciId);
        return musteri == null ? null : _mapper.Map<MusteriDto>(musteri);
    }

    public async Task<MusteriDto> CreateAsync(MusteriCreateDto dto, int kullaniciId)
    {
        var musteri = _mapper.Map<Musteri>(dto);
        musteri.KullaniciId = kullaniciId;
        var olusturulan = await _repo.CreateAsync(musteri);
        return _mapper.Map<MusteriDto>(olusturulan);
    }

    public async Task<MusteriDto?> UpdateAsync(int id, MusteriUpdateDto dto, int kullaniciId)
    {
        var musteri = _mapper.Map<Musteri>(dto);
        musteri.KullaniciId = kullaniciId;
        var guncellenen = await _repo.UpdateAsync(id, musteri);
        return guncellenen == null ? null : _mapper.Map<MusteriDto>(guncellenen);
    }

    public async Task<bool> DeleteAsync(int id, int kullaniciId)
        => await _repo.DeleteAsync(id, kullaniciId);
}