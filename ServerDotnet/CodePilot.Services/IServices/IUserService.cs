using CodePilot.Data.Entites;

namespace CodePilot.Services.IServices
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsersAsync();
        Task<bool> DeleteUserAsync(int userId);
    }
}