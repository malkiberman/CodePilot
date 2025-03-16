
using CodePilot.CORE.DTOs;
using CodePilot.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Services.IServices
{
    public interface IFileVersionService
    {
        Task<FileVersionResponseDto> AddFileVersionAsync(int fileId, FileVersionDto fileVersionDto, int userId);
        Task<List<FileVersion>> GetFileVersionsAsync(int fileId);
    }

}
