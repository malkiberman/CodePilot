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
using Service;

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});;



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

// 🛠️ הוספת שירותים נוספים עבור CodeFile
builder.Services.AddScoped<ICodeFileService, CodeFileService>();
builder.Services.AddScoped<ICodeFileRepository, CodeFileRepository>();
builder.Services.AddScoped<S3Service>(); // שירות לניהול קבצים ב-S3

// 🛠️ הוספת שירותים עבור Authentication
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// 🛠️ הוספת Controllers
builder.Services.AddControllers();


var app = builder.Build();




// 🛠️ שימוש ב-Swagger רק בפיתוח
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication(); // 🛠️ הפעלת אימות JWT
app.UseAuthorization();
app.MapControllers();

app.Run();
