using System.Threading.Tasks;
using CodePilot.CORE.DTOs;
using CodePilot.Data.Entites;
using Microsoft.AspNetCore.Http;

namespace CodePilot.Services.IServices
{
    public interface ICodeFileService
    {
        Task<CodeFileToUploadDTO> UploadFileAsync(CodeFileToUploadDTO codeFileDTO, int userId);
        Task<CodeFileDTO> GetFileByIdAsync(int id);

        Task<IEnumerable<CodeFileDTO>> GetFilesByUserIdAsync(int userId);
        Task DeleteCodeFileAsync(int id);
        Task UpdateCodeFileAsync(CodeFileDTO codeFile);
    }
}
