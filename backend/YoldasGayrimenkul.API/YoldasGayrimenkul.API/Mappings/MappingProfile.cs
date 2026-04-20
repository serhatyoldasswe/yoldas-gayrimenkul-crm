// Açıklama: AutoMapper hangi sınıfı hangi sınıfa dönüştüreceğini buradan öğrenir.
// Model → DTO (GET response), DTO → Model (POST/PUT request) için ayrı kurallar.
using AutoMapper;
using YoldasGayrimenkul.API.DTOs;
using YoldasGayrimenkul.API.Models;

namespace YoldasGayrimenkul.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Ilan mappingleri
        CreateMap<Ilan, IlanDto>()
            .ForMember(dest => dest.KullaniciAd,
                opt => opt.MapFrom(src => src.Kullanici != null ? src.Kullanici.AdSoyad : ""));

        CreateMap<IlanCreateDto, Ilan>();
        CreateMap<IlanUpdateDto, Ilan>();

        // Musteri mappingleri
        CreateMap<Musteri, MusteriDto>();
        CreateMap<MusteriCreateDto, Musteri>();
        CreateMap<MusteriUpdateDto, Musteri>();

        // Portfoy mappingleri
        CreateMap<Portfoy, PortfoyDto>()
            .ForMember(dest => dest.Ilanlar,
                opt => opt.MapFrom(src =>
                    src.PortfoyIlanlar.Select(pi => pi.Ilan)));

        CreateMap<PortfoyCreateDto, Portfoy>()
            .ForMember(dest => dest.PortfoyIlanlar, opt => opt.Ignore());
    }
}