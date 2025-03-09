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
    public class UserRepository : IUserRepository
    {
        private readonly CodePilotDbContext _context;
        private readonly ILogger<UserRepository> _logger;  // הוספת ILogger

        public UserRepository(CodePilotDbContext context, ILogger<UserRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            _logger.LogInformation($"Attempting to get user by ID: {id}");
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                _logger.LogWarning($"User with ID {id} not found.");
            }
            else
            {
                _logger.LogInformation($"Successfully retrieved user with ID {id}");
            }
            return user;
        }

        public async Task<User> GetUserByUseremailAsync(string email)
        {
            _logger.LogInformation($"Attempting to get user by email: {email}");
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                _logger.LogWarning($"User with email {email} not found.");
            }
            else
            {
                _logger.LogInformation($"Successfully retrieved user with email {email}");
            }
            return user;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            _logger.LogInformation("Attempting to get all users.");
            var users = await _context.Users.ToListAsync();
            _logger.LogInformation($"Successfully retrieved {users.Count()} users.");
            return users;
        }

        public async Task CreateUserAsync(User user)
        {
            _logger.LogInformation($"Attempting to create user with username: {user.Username}");
            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Successfully created user with username: {user.Username}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating user with username {user.Username}: {ex.Message}");
                throw;
            }
        }

        public async Task UpdateUserAsync(User user)
        {
            _logger.LogInformation($"Attempting to update user with ID: {user.Id}");
            try
            {
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Successfully updated user with ID: {user.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating user with ID {user.Id}: {ex.Message}");
                throw;
            }
        }

        public async Task DeleteUserAsync(int id)
        {
            _logger.LogInformation($"Attempting to delete user with ID: {id}");
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                _logger.LogWarning($"User with ID {id} not found for deletion.");
            }
            else
            {
                try
                {
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Successfully deleted user with ID: {id}");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error deleting user with ID {id}: {ex.Message}");
                    throw;
                }
            }
        }

        public async Task<bool> IsUseremailTakenAsync(string email)
        {
            _logger.LogInformation($"Checking if email is taken: {email}");
            var isTaken = await _context.Users.AnyAsync(u => u.Email == email);
            if (isTaken)
            {
                _logger.LogWarning($"Email {email} is already taken.");
            }
            else
            {
                _logger.LogInformation($"Email {email} is available.");
            }
            return isTaken;
        }

        public async Task SaveChangesAsync()
        {
            _logger.LogInformation("Attempting to save changes to the database.");
            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Successfully saved changes to the database.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error saving changes to the database: {ex.Message}");
                throw;
            }
        }

    }

}
