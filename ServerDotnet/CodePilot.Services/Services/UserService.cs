using CodePilot.Data;
using CodePilot.Data.Entites;
using CodePilot.Services.IServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static CodePilot.Services.Services.UserService;

namespace CodePilot.Services.Services
{
    
        // בתוך ה-UserService שלך (לדוגמה)
        public class UserService : IUserService // מומלץ להשתמש באינטרפייס
        {
            private readonly CodePilotDbContext _context; // הקשר למסד הנתונים שלך

            public UserService(CodePilotDbContext context)
            {
                _context = context;
            }

            public async Task<List<User>> GetAllUsersAsync()
            {
                return await _context.Users.ToListAsync();
            }

            public async Task<bool> DeleteUserAsync(int userId)
            {
                var userToDelete = await _context.Users.FindAsync(userId);
                if (userToDelete == null)
                {
                    return false; // משתמש לא נמצא
                }

                _context.Users.Remove(userToDelete);
                await _context.SaveChangesAsync();
                return true;
            }

        public async Task<UserReportDto> GetUserReportAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.CodeFiles)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return null;

            return new UserReportDto
            {
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                TotalCodeFiles = user.CodeFiles.Count,
                LastLogin = user.LastLogin,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<IEnumerable<UserActivityDto>> GetActiveUsersReportAsync(DateTime from, DateTime to)
        {
            return await _context.Users
                .Where(u => u.LastLogin >= from && u.LastLogin <= to)
                .Select(u => new UserActivityDto
                {
                    UserId = u.Id,
                    Username = u.Username,
                    LastLogin = u.LastLogin
                }).ToListAsync();
        }

        public async Task<int> GetTotalUsersCountAsync()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<int> GetNewUsersCountAsync(DateTime from, DateTime to)
        {
            return await _context.Users
                .Where(u => u.CreatedAt >= from && u.CreatedAt <= to)
                .CountAsync();
        }
    }

    // DTOים לדוחות
    public class UserReportDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public int TotalCodeFiles { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastLogin { get; set; }
    }

    public class UserActivityDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public DateTime LastLogin { get; set; }
    }
}
        

