using CodePilot.Data.Entities;
using CodePilot.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using codepilot.core.Repositories.Interfaces;
using CodePilot.Data;

namespace CodePilot.Core.Repositories
{
    public class FileVersionRepository : IFileVersionRepository
    {
        private readonly CodePilotDbContext _context;

        public FileVersionRepository(CodePilotDbContext context)
        {
            _context = context;
        }

        // קבלת כל הגירסאות של קובץ לפי ID
        public async Task<List<FileVersion>> GetFileVersionsByFileIdAsync(int fileId)
        {
            return await _context.FileVersions
                                 .Where(fv => fv.CodeFileId == fileId)
                                 .OrderByDescending(fv => fv.CreatedAt) // למיין לפי CreatedAt או לפי VersionId
                                 .ToListAsync();
        }


        // הוספת גירסה חדשה
        public async Task<FileVersion> AddFileVersionAsync(FileVersion fileVersion)
        {
            await _context.FileVersions.AddAsync(fileVersion);
            await SaveChangesAsync();
            return fileVersion;
        }

        // שמירת שינויים
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        // קבלת הגירסה האחרונה של קובץ
        public async Task<FileVersion> GetLatestVersionAsync(int fileId)
        {
            return await _context.FileVersions
                                 .Where(fv => fv.CodeFileId == fileId)
                                 .OrderByDescending(fv => fv.CreatedAt) // שינוי מ- VersionId ל-CreatedAt
                                 .FirstOrDefaultAsync();
        }


        public async Task<FileVersion> GetFileVersionAsync(int fileId, int versionId)
        {
            try
            {
                // שליפת הגרסה המתאימה של הקובץ מתוך ה-DB
                var fileVersion = await _context.FileVersions
                    .Where(fv => fv.CodeFileId == fileId && fv.VersionId == versionId)
                    .FirstOrDefaultAsync();

                if (fileVersion == null)
                {
                    throw new Exception($"File version {versionId} for file {fileId} not found.");
                }

                // החזרת פרטי הגרסה
                return fileVersion; // מחזיר את כל פרטי הגרסה
            }
            catch (Exception ex)
            {
                //_logger.LogError($"Error retrieving file version {versionId} for file {fileId}: {ex.Message}");
                throw new Exception($"Error retrieving file version {versionId}: {ex.Message}", ex);
            }
        }


        public async Task<FileVersion> GetFileVersionByIdAsync(int fileId, int versionId)
        {
            try
            {
                // שליפת הגרסה הספציפית לפי fileId ו-versionId
                var fileVersion = await _context.FileVersions
                    .Where(fv => fv.CodeFileId == fileId && fv.VersionId == versionId)
                    .FirstOrDefaultAsync();

                if (fileVersion == null)
                {
                    throw new Exception($"File version {versionId} for file {fileId} not found.");
                }

                return fileVersion;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving file version {versionId}: {ex.Message}", ex);
            }
        }

    }

}
