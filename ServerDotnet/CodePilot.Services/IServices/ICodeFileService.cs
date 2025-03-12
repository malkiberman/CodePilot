using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodePilot.CORE.DTOs;
using Microsoft.AspNetCore.Http;


namespace CodePilot.Services.IServices
{
    public interface ICodeFileService
    {
       Task<CodeFileToUploadDTO> UploadFileAsync(CodeFileToUploadDTO codeFileDTO, int userId);

        Task<CodeFileDTO> GetFileByIdAsync(int id);
        Task<bool> ValidateFileTypeAsync(IFormFile file);
    }
}
