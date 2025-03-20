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

            // פונקציות נוספות עבור הוספה, עדכון וכו'
        }
    }

