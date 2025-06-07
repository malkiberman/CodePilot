using CodePilot.CORE.DTOs;
using CodePilot.Services;
using CodePilot.Services.IServices;
using CodePilot.Services.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CodePilot.Services.Services;
namespace CodePilot.Api.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AiController : Controller
    {
        private readonly IAiService _aiService;

        public AiController(IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeFile([FromBody] string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                return BadRequest("No content provided.");

            string suggestions = await _aiService.GetCodeImprovementsAsync(content);
            return Ok(suggestions); // או Json(new { suggestions }) אם רוצים עטיפה
        }
    }
}
