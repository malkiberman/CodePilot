using CodePilot.CORE.DTOs;
using CodePilot.CORE.IRepositories;
using CodePilot.Data.Entites;
using CodePilot.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Service; // אם משתמשים ב-AUTHORIZATION

namespace CodePilot.Services.Services
{
   public class CodeFileService : ICodeFileService
    {
        private readonly ICodeFileRepository _codeFileRepository;
        private readonly ILogger<CodeFileService> _logger;
        private readonly S3Service _s3Service;
        private readonly IUserRepository _userRepository;
        public CodeFileService(ICodeFileRepository codeFileRepository, ILogger<CodeFileService> logger, S3Service s3Service, IUserRepository userRepository)
        {
            _codeFileRepository = codeFileRepository;
            _logger = logger;
            _s3Service = s3Service;
            _userRepository = userRepository;
        }

        public async Task<CodeFileToUploadDTO> UploadFileAsync(CodeFileToUploadDTO codeFileDTO, int userId)
        {
            try
            {
                // בודקים אם סוג הקובץ תקין
                var isValid = await ValidateFileTypeAsync(codeFileDTO.File);
                if (!isValid)
                {
                    _logger.LogWarning($"Attempt to upload invalid file type: {codeFileDTO.FileType} - {codeFileDTO.FileName}");
                    return null; // אפשר גם להחזיר BadRequest אם זה API
                }

                // מחפשים את המשתמש ומוודאים שהוא מחובר
                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning($"User with ID {userId} not found.");
                    return null; // במקרה של משתמש לא מחובר
                }

                // העלאת הקובץ ל-S3
                using (var stream = codeFileDTO.File.OpenReadStream())
                {
                    var filePathInS3 = await _s3Service.UploadFileAsync(stream, codeFileDTO.FileName); // Upload to S3

                    // מחברים את ה-DTO למחלקת ה-Entity של CodeFile
                    var codeFile = new CodeFile
                    {
                        FileName = codeFileDTO.FileName,
                        FilePath = filePathInS3, // מיקום הקובץ ב-S3
                        FileType = codeFileDTO.FileType,
                        UploadedAt = DateTime.UtcNow,
                        UserId = userId // מגדירים את מזהה המשתמש שנמצא
                    };

                    await _codeFileRepository.AddAsync(codeFile);

                    _logger.LogInformation($"Successfully uploaded file: {codeFileDTO.FileName}");

                    return codeFileDTO;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while uploading file: {ex.Message}", ex);
                throw;
            }
        }

        public async Task<bool> ValidateFileTypeAsync(IFormFile file)
        {
            try
            {
                var validTypes = new[] { ".cs", ".java", ".py", ".js", ".cpp", ".html", ".css", "ts", "tsx" }; // סוגי קבצים שנחשבים תקינים

                var fileExtension = Path.GetExtension(file.FileName); // בודק את הסיומת לפי שם הקובץ
                var isValid = validTypes.Contains(fileExtension);

                if (!isValid)
                {
                    _logger.LogWarning($"Invalid file extension detected: {fileExtension}.");
                }

                return isValid;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during file type validation: {ex.Message}", ex);
                throw;
            }
        }

        public async Task<CodeFileDTO> GetFileByIdAsync(int id)
        {
            try
            {
                var codeFile = await _codeFileRepository.GetByIdAsync(id);
                if (codeFile == null)
                {
                    _logger.LogWarning($"File with ID {id} not found.");
                    return null;
                }

                return new CodeFileDTO
                {
                    Id = codeFile.Id,
                    FileName = codeFile.FileName,
                    FilePath = codeFile.FilePath,
                    FileType = codeFile.FileType,
                    UploadedAt = codeFile.UploadedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving file with ID {id}: {ex.Message}", ex);
                throw;
            }
        }
    }
}
