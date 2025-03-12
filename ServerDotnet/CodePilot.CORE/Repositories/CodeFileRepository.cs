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
            var codeFile = await _context.CodeFiles.FindAsync(id);
            if (codeFile == null)
            {
                _logger.LogWarning($"CodeFile with ID {id} not found.");
            }
            else
            {
                _logger.LogInformation($"Successfully retrieved CodeFile with ID {id}");
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

        public async Task UpdateAsync(CodeFile codeFile)
        {
            try
            {
                _logger.LogInformation($"Attempting to update CodeFile with ID: {codeFile.Id}");
                _context.CodeFiles.Update(codeFile);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Successfully updated CodeFile with ID: {codeFile.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while updating CodeFile with ID: {codeFile.Id}. Error: {ex.Message}");
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
                    _context.CodeFiles.Remove(codeFile);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Successfully deleted CodeFile with ID {id}");
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
    }
}
