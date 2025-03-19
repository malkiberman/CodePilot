using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using CodePilot.Data.Entities;

namespace codepilot.core.Repositories.Interfaces
{
    public interface IFileVersionRepository
    {
        // קבלת כל הגירסאות של קובץ לפי ID
        Task<List<FileVersion>> GetFileVersionsByFileIdAsync(int fileId);

        // הוספת גירסה חדשה
        Task<FileVersion> AddFileVersionAsync(FileVersion fileVersion);

        // שמירת שינויים
        Task SaveChangesAsync();

        // קבלת הגירסה האחרונה של קובץ
        Task<FileVersion> GetLatestVersionAsync(int fileId);

        Task<FileVersion> GetFileVersionByIdAsync(int fileId, int versionId);
    }
}
