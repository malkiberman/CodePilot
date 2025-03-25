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
               

                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning($"User with ID {userId} not found.");
                    return null;
                }

                using (var stream = codeFileDTO.File.OpenReadStream())
                {
                    var filePathInS3 = await _s3Service.UploadCodeFileAsync(stream, codeFileDTO.FileName, user.Username);

                    var codeFile = new CodeFile
                    {
                        FileName = codeFileDTO.FileName,
                        FilePath = filePathInS3,
                        FileType = codeFileDTO.FileType,
                        UploadedAt = DateTime.UtcNow,
                        UserId = userId
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

        public async Task<IEnumerable<CodeFileDTO>> GetFilesByUserIdAsync(int userId)
        {
            try
            {
                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning($"User with ID {userId} not found.");
                    return null;
                }

                var codeFiles = await _codeFileRepository.GetAllAsync();
                var userCodeFiles = codeFiles.Where(cf => cf.UserId == userId);

                var codeFileDTOs = userCodeFiles.Select(cf => new CodeFileDTO
                {
                    Id = cf.Id,
                    FileName = cf.FileName,
                    FilePath = cf.FilePath,
                    FileType = cf.FileType,
                    UploadedAt = cf.UploadedAt
                });

                return codeFileDTOs;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving files for user with ID {userId}: {ex.Message}", ex);
                throw;
            }
        }
        public async Task DeleteCodeFileAsync(int id)
    {
        try
        {
            _logger.LogInformation($"Attempting to delete CodeFile and its versions with ID {id}");
            await _codeFileRepository.DeleteAsync(id);
            _logger.LogInformation($"Successfully deleted CodeFile and its versions with ID {id}");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error occurred while deleting CodeFile with ID {id}: {ex.Message}");
            throw;
        }
    }

        // עדכון שם קובץ
        public async Task UpdateCodeFileAsync(CodeFileDTO codeFile)
        {
            try
            {
                _logger.LogInformation($"Attempting to update CodeFile with ID {codeFile.Id}");
                await _codeFileRepository.UpdateAsync(codeFile);
                _logger.LogInformation($"Successfully updated CodeFile with ID {codeFile.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while updating CodeFile with ID {codeFile.Id}: {ex.Message}");
                throw;
            }
        }
    }
}
