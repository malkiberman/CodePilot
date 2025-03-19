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

using codepilot.core.Repositories.Interfaces;
using CodePilot.Data.Entities;


namespace CodePilot.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeFileController : ControllerBase
    {
        private readonly ICodeFileService _codeFileService;
        private readonly IFileVersionService _fileVersionService;
        private S3Service _s3Service;

        public CodeFileController(ICodeFileService codeFileService, IFileVersionService fileVersionService, S3Service s3Service)
        {
            _codeFileService = codeFileService;
            _fileVersionService = fileVersionService;
            _s3Service = s3Service;
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

            var files = await _codeFileService.GetFilesByUserIdAsync(int.Parse(userId));
            if (files == null || !files.Any())
                return NotFound("No files found for this user.");
            return Ok(files);
        }

        [HttpPost("{fileId}/version")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddFileVersion(int fileId, [FromForm] IFormFile file, [FromForm] string fileName)
        {
            if (file == null)
            {
                return BadRequest("No file uploaded.");
            }

            // קבלת מזהה המשתמש מתוך הטוקן
            var userId = User.Claims
                .Where(c => c.Type == ClaimTypes.NameIdentifier)
                .Select(c => c.Value)
                .FirstOrDefault(v => int.TryParse(v, out _));
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            try
            {
                // יצירת סטרים מהקובץ לצורך העלאה
                using (var stream = file.OpenReadStream())
                {

                    // חישוב מספר גרסה חדש
                    var versions = await _fileVersionService.GetFileVersionsAsync(fileId);
                    var versionNumber = versions.Any() ? versions.Max(v => v.VersionId) : 0; ;  // גרסה + 1 או 1 אם אין גרסאות

                    // שליחת הקובץ ל-S3 ושמירת הנתיב
                    string s3Path = await _s3Service.UploadCodeFileAsync(stream, fileName + versionNumber, userId,true);
                    // יצירת DTO לגרסה חדשה
                    var fileVersionDto = new FileVersionDto
                    {
                        FileId = fileId,
                        VersionNumber = versionNumber,  // הגרסה החדשה
                        CreatedAt = DateTime.UtcNow,
                        S3Path = s3Path  // הוספת הנתיב ל-S3
                    };

                    // הוספת גרסה חדשה למסד נתונים או כל פעולה אחרת שתצטרך לבצע
                    var result = await _fileVersionService.AddFileVersionAsync(fileId, fileVersionDto, int.Parse(userId));

                    return result != null ? Ok(result) : BadRequest("Failed to add file version.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error uploading file version: {ex.Message}");
            }
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
                return Ok(file.FilePath);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("{fileId}/version/{versionId1}/compare/{versionId2}")]

        public async Task<IActionResult> CompareFileVersions(int fileId, int versionId1, int versionId2)
        {
            try
            {
                // שליפת פרטי הגרסאות מתוך ה-DB (מכאן אנחנו מקבלים את פרטי הגרסה)
                var fileVersion1 = await _fileVersionService.GetFileVersionByIdAsync(fileId, versionId1);
                var fileVersion2 = await _fileVersionService.GetFileVersionByIdAsync(fileId, versionId2);

                if (fileVersion1 == null || fileVersion2 == null)
                {
                    return NotFound("One or both versions not found.");
                }

                // הורדת תוכן הגרסאות מתוך S3
                var fileVersion1Content = await _s3Service.DownloadFileVersionAsync(fileId, versionId1);
                var fileVersion2Content = await _s3Service.DownloadFileVersionAsync(fileId, versionId2);

                if (fileVersion1Content == null || fileVersion2Content == null)
                {
                    return NotFound("File content for one or both versions could not be retrieved.");
                }

                // החזרת התכנים של הגרסאות
                return Ok(new { fileVersion1Content, fileVersion2Content });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error comparing file versions: {ex.Message}");
            }
        }

    }


}
