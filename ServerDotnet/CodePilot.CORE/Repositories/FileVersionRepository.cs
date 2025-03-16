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
                                 .OrderByDescending(fv => fv.VersionId)
                                 .FirstOrDefaultAsync();
        }
    }
}
