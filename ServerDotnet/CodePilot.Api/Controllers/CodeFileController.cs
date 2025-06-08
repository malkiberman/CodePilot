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
        // 📌 העלאת קובץ חדש עם ניהול גרסאות מובנה ב-S3
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
                return Unauthorized("User is not authenticated.");

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

        // 📌 הוספת גרסה חדשה לקובץ
        [HttpPost("{fileId}/version")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddFileVersion(int fileId, [FromForm] IFormFile file)
        {
            if (file == null)
                return BadRequest("No file uploaded.");

            var userId = User.Claims
                .Where(c => c.Type == ClaimTypes.NameIdentifier)
                .Select(c => c.Value)
                .FirstOrDefault(v => int.TryParse(v, out _));
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User is not authenticated.");

            try
            {
                var fileData = await _codeFileService.GetFileByIdAsync(fileId);
                if (fileData == null)
                    return NotFound("File not found.");

                using var stream = file.OpenReadStream();
                string s3Path = await _s3Service.UploadCodeFileAsync(stream, fileData.FileName, userId);

                var fileVersionDto = new FileVersionDto
                {
                    FileId = fileId,
                    CreatedAt = DateTime.UtcNow,
                    S3Path = s3Path  // הוספת הנתיב ל-S3
                };

                var result = await _fileVersionService.AddFileVersionAsync(fileId, fileVersionDto, int.Parse(userId));
                return result != null ? Ok(result) : BadRequest("Failed to add file version.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error uploading file version: {ex.Message}");
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
        [HttpDelete("{fileId}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteFile(int fileId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            try
            {
                var file = await _codeFileService.GetFileByIdAsync(fileId);
                if (file == null)
                    return NotFound("File not found.");

                // מחיקת קובץ וגרסאותיו מה-S3
                var s3DeleteResult = await _s3Service.DeleteFileWithVersionsAsync(userId, file.FileName);
                if (!s3DeleteResult)
                    return BadRequest("Failed to delete file from S3.");

                // מחיקת הקובץ מה-DB
                await _codeFileService.DeleteCodeFileAsync(fileId);

                return Ok("File and versions deleted successfully.");
            }
            catch
            {
                return StatusCode(500, "Error deleting file.");
            }
        }

        // 📌 עדכון שם קובץ
        [HttpPut("{fileId}/rename")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RenameFile(int fileId, [FromBody] RenameFileDto renameFileDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            try
            {
                var file = await _codeFileService.GetFileByIdAsync(fileId);
                if (file == null)
                    return NotFound("File not found.");

                // שינוי שם הקובץ ב-S3
                var s3RenameResult = await _s3Service.RenameFileAsync(userId, file.FileName, renameFileDto.NewFileName);
                if (!s3RenameResult)
                    return BadRequest("Failed to rename file in S3.");

                // שינוי שם הקובץ במסד הנתונים
                file.FileName = renameFileDto.NewFileName;

                // עדכון הנתיב עם שם הקובץ החדש
                var path = file.FilePath;
                var lastSlashIndex = path.LastIndexOf('/');
                if (lastSlashIndex >= 0)
                {
                    file.FilePath = path.Substring(0, lastSlashIndex + 1) + renameFileDto.NewFileName;
                }
                else
                {
                    return NotFound("");
                }
                Console.WriteLine("filepath------------------"+file.FilePath);
                await _codeFileService.UpdateCodeFileAsync(file);

                return Ok("File renamed successfully.");
            }
            catch
            {
                return StatusCode(500, "Error renaming file.");
            }
        }


    }
}



