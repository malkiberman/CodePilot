using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ����� ����� �-Controllers
builder.Services.AddControllers();

// ����� Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CodePilot API",
        Version = "v1",
        Description = "API ������ ���� ���"
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CodePilot API V1");
        c.RoutePrefix = "swagger"; // ����� ��-Swagger ���� ��� /swagger
    });
}


app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
