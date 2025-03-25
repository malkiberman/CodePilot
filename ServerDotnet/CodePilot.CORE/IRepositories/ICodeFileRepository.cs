using CodePilot.CORE.DTOs;
using CodePilot.Data.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.CORE.IRepositories
{
    public interface ICodeFileRepository
    {
        Task<CodeFile> GetByIdAsync(int id);
        Task<IEnumerable<CodeFile>> GetAllAsync();
        Task AddAsync(CodeFile codeFile);
        Task DeleteAsync(int id);
        Task UpdateAsync(CodeFileDTO codeFile);
    }
}
