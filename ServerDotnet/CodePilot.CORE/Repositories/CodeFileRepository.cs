using CodePilot.CORE.DTOs;
using CodePilot.CORE.IRepositories;
using CodePilot.Data;
using CodePilot.Data.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.CORE.Repositories
{
    public class CodeFileRepository : ICodeFileRepository
    {
        private readonly CodePilotDbContext _context;

        private readonly ILogger<CodeFileRepository> _logger;  // הוספת ILogger

        public CodeFileRepository(CodePilotDbContext context, ILogger<CodeFileRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<CodeFile> GetByIdAsync(int id)
        {
            _logger.LogInformation($"Attempting to retrieve CodeFile with ID {id}");

            // שליפת הקובץ על פי ה-ID
            var codeFile = await _context.CodeFiles
                .Include(c => c.FileVersions) // כולל את הגרסאות של הקובץ
                .FirstOrDefaultAsync(c => c.Id == id); // מחפש את הקובץ לפי ה-ID

            if (codeFile == null)
            {
                _logger.LogWarning($"CodeFile with ID {id} not found.");
                return null; // מחזיר null אם לא נמצא קובץ
            }

            // בדיקה אם יש גרסאות לקובץ
            if (codeFile.FileVersions != null && codeFile.FileVersions.Any())
            {
                // מחפש את הגרסה האחרונה (נניח שיש לך תאריך או ID שמאפשר לזהות את הגרסה החדשה ביותר)
                var latestVersion = codeFile.FileVersions.OrderByDescending(v => v.CreatedAt).FirstOrDefault();
                //if (latestVersion != null)
                //{
                //    _logger.LogInformation($"Successfully retrieved CodeFile with ID {id}, latest version ID {latestVersion.Id}");
                //    codeFile.CurrentVersion = latestVersion; // מגדיר את הגרסה האחרונה בקובץ (אם צריך)
                //}
                //else
                //{
                //    _logger.LogWarning($"No versions found for CodeFile with ID {id}");
                //}
            }

            return codeFile;
        }


        public async Task<IEnumerable<CodeFile>> GetAllAsync()
        {
            _logger.LogInformation("Attempting to retrieve all CodeFiles.");
            var codeFiles = await _context.CodeFiles.ToListAsync();
            _logger.LogInformation($"Retrieved {codeFiles.Count()} CodeFiles.");
            return codeFiles;
        }

        public async Task AddAsync(CodeFile codeFile)
        {
            try
            {
                _logger.LogInformation($"Attempting to add new CodeFile with name: {codeFile.FileName}");
                await _context.CodeFiles.AddAsync(codeFile);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Successfully added CodeFile with name: {codeFile.FileName}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while adding CodeFile with name: {codeFile.FileName}. Error: {ex.Message}");
                throw;
            }
        }

 

        public async Task DeleteAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Attempting to delete CodeFile with ID {id}");
                var codeFile = await GetByIdAsync(id);
                if (codeFile != null)
                {
                    // מחיקת כל הגרסאות של הקובץ לפני מחיקת הקובץ עצמו
                    var fileVersions = await _context.FileVersions
                        .Where(fv => fv.CodeFileId == id)
                        .ToListAsync();

                    foreach (var version in fileVersions)
                    {
                        _context.FileVersions.Remove(version);
                    }

                    _context.CodeFiles.Remove(codeFile);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Successfully deleted CodeFile with ID {id} and its versions.");
                }
                else
                {
                    _logger.LogWarning($"CodeFile with ID {id} not found, nothing to delete.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while deleting CodeFile with ID {id}. Error: {ex.Message}");
                throw;
            }
        }

        public async Task UpdateAsync(CodeFileDTO codeFile)
        {
            try
            {
                var entity = await _context.CodeFiles.FindAsync(codeFile.Id);

                _logger.LogInformation($"Attempting to update CodeFile with ID: {codeFile.Id}");

                entity.FileName = codeFile.FileName;
                entity.FilePath = codeFile.FilePath;

                await _context.SaveChangesAsync(); // ✔️ רק משנה את האובייקט הקיים
                // עדכון שם הקובץ בכל הגרסאות גם
                var fileVersions = await _context.FileVersions
                                                 .Where(fv => fv.CodeFileId == codeFile.Id)
                                                 .ToListAsync();

                foreach (var version in fileVersions)
                {
                    version.CodeFileId = codeFile.Id; // עדכון שם הקובץ בגרסאות
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation($"Successfully updated CodeFile with ID: {codeFile.Id} and its versions.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while updating CodeFile with ID: {codeFile.Id}. Error: {ex.Message}");
                throw;
            }
        }

    }
}
