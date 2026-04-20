// Açıklama: .NET 8'in giriş noktası. Tüm servisler buraya kaydedilir (DI Container),
// middleware pipeline buraya kurulur.
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using YoldasGayrimenkul.API.Data;
using YoldasGayrimenkul.API.Mappings;
using YoldasGayrimenkul.API.Repositories;
using YoldasGayrimenkul.API.Services;

var builder = WebApplication.CreateBuilder(args);

// ── 1. VERITABANI ────────────────────────────────────────────
// EF Core → SQL Server bağlantısı
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── 2. DEPENDENCY INJECTION ──────────────────────────────────
// Repository'leri kaydet (her istek için yeni instance → Scoped)
builder.Services.AddScoped<IIlanRepository, IlanRepository>();
builder.Services.AddScoped<IMusteriRepository, MusteriRepository>();
builder.Services.AddScoped<IPortfoyRepository, PortfoyRepository>();

// Service'leri kaydet
builder.Services.AddScoped<IIlanService, IlanService>();
builder.Services.AddScoped<IMusteriService, MusteriService>();
builder.Services.AddScoped<IAnalizService, AnalizService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// ── 3. AUTOMAPPER ─────────────────────────────────────────────
builder.Services.AddAutoMapper(typeof(MappingProfile));

// ── 4. JWT AUTHENTICATION ────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// ── 5. CORS ──────────────────────────────────────────────────
// React frontend localhost:5173'ten API'ye erişebilsin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
            "http://localhost:5177",
            "http://localhost:5178",
            "http://localhost:5179",
            "http://localhost:5180",
            "http://localhost:5181",
            "http://localhost:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// ── 6. SWAGGER ───────────────────────────────────────────────
// Geliştirme sırasında API'yi test etmek için Swagger UI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Yoldaş Gayrimenkul API",
        Version = "v1",
        Description = "Emlak ofisi yönetim sistemi"
    });

    // Swagger'a JWT desteği ekle — token girebileceğimiz kutu çıkar
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Token: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme { Reference = new OpenApiReference
                { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddControllers();

// ── APP PIPELINE ─────────────────────────────────────────────
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");       
app.UseAuthentication();           
app.UseAuthorization();             
app.MapControllers();

app.Run();