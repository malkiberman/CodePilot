using CodePilot.Data.Entites;
using CodePilot.Services.Services;

namespace CodePilot.Services.IServices
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsersAsync();
        Task<bool> DeleteUserAsync(int userId);
        Task<UserReportDto> GetUserReportAsync(int userId);
        Task<IEnumerable<UserActivityDto>> GetActiveUsersReportAsync(DateTime from, DateTime to);
        Task<int> GetTotalUsersCountAsync();
        Task<int> GetNewUsersCountAsync(DateTime from, DateTime to);
    }
}