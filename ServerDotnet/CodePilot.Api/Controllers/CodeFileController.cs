using CodePilot.CORE.DTOs;
using CodePilot.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CodePilot.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeFileController : ControllerBase
    {
        private readonly ICodeFileService _codeFileService;

        public CodeFileController(ICodeFileService codeFileService)
        {
            _codeFileService = codeFileService;
        }

        // Endpoint להעלאת קובץ
        // Endpoint להעלאת קובץ
        [HttpPost("upload")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UploadFile([FromForm] CodeFileToUploadDTO codeFileDTO)
        {
            Console.WriteLine($"Received file: {codeFileDTO?.File?.FileName}");
            Console.WriteLine($"FileName: {codeFileDTO?.FileName}");
            Console.WriteLine($"LanguageType: {codeFileDTO?.FileType}");
            var authHeader = Request.Headers["Authorization"].ToString();
            Console.WriteLine($"Received Token: {authHeader}");


            if (codeFileDTO?.File == null)
            {
                Console.WriteLine("⚠️ No file received!");
                return BadRequest("File is required.");
            }

            if (string.IsNullOrEmpty(codeFileDTO.FileName) || string.IsNullOrEmpty(codeFileDTO.FileType))
            {
                Console.WriteLine("⚠️ Missing required fields!");
                return BadRequest("FileName and LanguageType are required.");
            }
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
            }
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("⚠️ User is not authenticated!");
                return Unauthorized("User is not authenticated.");
            }

            Console.WriteLine("✅ Everything looks good, proceeding with upload...");

            var result = await _codeFileService.UploadFileAsync(codeFileDTO, int.Parse(userId));
            return result != null ? Ok(result) : BadRequest("Invalid file type or failed to upload file.");
        }


        // Endpoint לשליפת קובץ לפי מזהה
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFileById(int id)
        {
            var file = await _codeFileService.GetFileByIdAsync(id);
            if (file == null)
            {
                return NotFound("File not found.");
            }
            return Ok(file);
        }
    }
}
