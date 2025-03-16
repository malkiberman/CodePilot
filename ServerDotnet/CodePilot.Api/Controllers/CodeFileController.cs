using CodePilot.CORE.DTOs;
using CodePilot.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CodePilot.Services;


namespace CodePilot.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeFileController : ControllerBase
    {
        private readonly ICodeFileService _codeFileService;
        private readonly IFileVersionService _fileVersionService;
        private S3Service _s3Service;

        public CodeFileController(ICodeFileService codeFileService, IFileVersionService fileVersionService)
        {
            _codeFileService = codeFileService;
            _fileVersionService = fileVersionService;
        }

        // 📌 העלאת קובץ חדש
        [HttpPost("upload")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UploadFile([FromForm] CodeFileToUploadDTO codeFileDTO)
        {
            if (codeFileDTO?.File == null)
                return BadRequest("File is required.");
            if (string.IsNullOrEmpty(codeFileDTO.FileName) || string.IsNullOrEmpty(codeFileDTO.FileType))
                return BadRequest("FileName and LanguageType are required.");
            var claims = User.Claims.Select(c => new { c.Type, c.Value });
            foreach (var claim in claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }
            var userId = User.Claims
      .Where(c => c.Type == ClaimTypes.NameIdentifier)
      .Select(c => c.Value)
      .FirstOrDefault(v => int.TryParse(v, out _));
            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("⚠️ User is not authenticated!");
                return Unauthorized("User is not authenticated.");
            }

            try
            {
                var result = await _codeFileService.UploadFileAsync(codeFileDTO, int.Parse(userId));
                return result != null ? Ok(new { FileUrl = result }) : BadRequest("Failed to upload file.");
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }

        // 📌 קבלת קובץ לפי מזהה
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFileById(int id)
        {
            var file = await _codeFileService.GetFileByIdAsync(id);
            if (file == null)
                return NotFound("File not found.");
            return Ok(file);
        }

        // 📌 שליפת כל הקבצים של משתמש מסוים
        [HttpGet("user")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetAllFilesByUser()
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value });
            foreach (var claim in claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }
            var userId = User.Claims
.Where(c => c.Type == ClaimTypes.NameIdentifier)
.Select(c => c.Value)
.FirstOrDefault(v => int.TryParse(v, out _));
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User is not authenticated.");

            var files = await _codeFileService.GetFilesByUserIdAsync(int.Parse("1"));
            if (files == null || !files.Any())
                return NotFound("No files found for this user.");
            return Ok(files);
        }

        // 📌 הוספת גרסה חדשה לקובץ קיים
        [HttpPost("{fileId}/version")]
        public async Task<IActionResult> AddFileVersion(int fileId, [FromBody] FileVersionDto fileVersionDto)
        {
            if (fileVersionDto == null)
            {
                return BadRequest("Invalid file version data.");
            }

            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            var result = await _fileVersionService.AddFileVersionAsync(fileId, fileVersionDto, int.Parse(userId));

            return result != null ? Ok(result) : BadRequest("Failed to add file version.");
        }

        // 📌 שליפת כל הגרסאות של קובץ מסוים
        [HttpGet("{fileId}/versions")]
        public async Task<IActionResult> GetFileVersions(int fileId)
        {
            var versions = await _fileVersionService.GetFileVersionsAsync(fileId);
            return Ok(versions);
        }
        // 📌 שליפת URL חתום להורדת קובץ
        [HttpGet("{fileId}/download")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetPresignedUrl(int fileId)
        {
            var userId = User.Claims
                .Where(c => c.Type == ClaimTypes.NameIdentifier)
                .Select(c => c.Value)
                .FirstOrDefault(v => int.TryParse(v, out _));

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User is not authenticated.");

            // שליפת הקובץ לפי מזהה
            var file = await _codeFileService.GetFileByIdAsync(fileId);
            if (file == null)
                return NotFound("File not found.");

            //// בדיקת האם הקובץ שייך למשתמש
            //if (file.UserId != int.Parse(userId))
            //    return Unauthorized("You are not authorized to download this file.");

            try
            {
                // קבלת ה-URL החתום מה-S3
               // var presignedUrl = await _s3Service.GetPresignedUrlAsync(file.FileName, userId);
                return Ok( file.FilePath);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
