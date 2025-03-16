using CodePilot.CORE.DTOs;
using CodePilot.Data.Entities;
using CodePilot.Core.Repositories;
using CodePilot.Services.IServices;
using System;
using System.Threading.Tasks;
using codepilot.core.Repositories.Interfaces;
using CodePilot.CORE.IRepositories;

namespace CodePilot.Services.Services
{
    public class FileVersionService : IFileVersionService
    {
        private readonly IFileVersionRepository _fileVersionRepository;
        private readonly ICodeFileRepository _fileRepository;

        public FileVersionService(IFileVersionRepository fileVersionRepository, ICodeFileRepository fileRepository)
        {
            _fileVersionRepository = fileVersionRepository;
            _fileRepository = fileRepository;
        }

        public async Task<FileVersionResponseDto> AddFileVersionAsync(int fileId, FileVersionDto fileVersionDto, int userId)
        {
            // קבלת הקובץ על פי ID
            var file = await _fileRepository.GetByIdAsync(fileId);
            if (file == null)
            {
                return null; // הקובץ לא נמצא
            }

            // קבלת הגירסה האחרונה של הקובץ
            var latestVersion = await _fileVersionRepository.GetLatestVersionAsync(fileId);
            int newVersionNumber = (latestVersion?.VersionId ?? 0) + 1;

            // יצירת אובייקט חדש של FileVersion
            var fileVersion = new FileVersion
            {
                CodeFileId = fileId,
                VersionId = newVersionNumber,
                FilePath = fileVersionDto.S3Path,
                CreatedAt = DateTime.UtcNow
            };

            // הוספת הגירסה החדשה למסד הנתונים
            await _fileVersionRepository.AddFileVersionAsync(fileVersion);
            await _fileVersionRepository.SaveChangesAsync();

            // החזרת התשובה ב-DTO
            return new FileVersionResponseDto
            {
                VersionId = fileVersion.Id,
                FileId = fileId,
                VersionNumber = fileVersion.VersionId,
                S3Path = fileVersion.FilePath,
                CreatedAt = fileVersion.CreatedAt
            };
        }

        public async Task<List<FileVersion>> GetFileVersionsAsync(int fileId)
        {
            return await _fileVersionRepository.GetFileVersionsByFileIdAsync(fileId);
        }
    }
}
