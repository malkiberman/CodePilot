using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using CodePilot.Data;
using Microsoft.EntityFrameworkCore;
using CodePilot.Services.IServices;
using CodePilot.Services.Services;
using CodePilot.CORE.IRepositories;
using CodePilot.CORE.Repositories;
using CodePilot.Data.Entites;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

var logger = builder.Logging;
logger.ClearProviders();
logger.AddConsole();

// 🛠️ טעינת הגדרות JWT מה-AppSettings
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

// 🛠️ הוספת DbContext
builder.Services.AddDbContext<CodePilotDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();



// 🛠️ הוספת שירותי Authentication + JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false; // הפעלת HTTPS רק בפרודקשן
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(secretKey)
        };
    });

// 🛠️ הוספת Authorization
builder.Services.AddAuthorization();

// 🛠️ הוספת Swagger עם תמיכה ב-JWT
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CodePilot API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "הכנס את ה-JWT שלך כאן (למשל: Bearer {token})",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new List<string>()
        }
    });
});

builder.Services.AddControllers();
var app = builder.Build();

// 🛠️ שימוש ב-Swagger רק בפיתוח
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication(); // 🛠️ הפעלת אימות JWT
app.UseAuthorization();
app.MapControllers();
app.Run();
