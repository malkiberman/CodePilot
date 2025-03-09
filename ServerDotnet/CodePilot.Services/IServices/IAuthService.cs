using CodePilot.Data.Entites;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Services.IServices
{
    public interface IAuthService
    {
        Task<ServiceResponse<int>> RegisterUser(User user, string password);
        Task<ServiceResponse<string>> Login(string email, string password);
        Task<ServiceResponse<string>> ChangePassword(int userId, string oldPassword, string newPassword);
    }
}
