using CodePilot.CORE.IRepositories;
using CodePilot.Services.IServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CodePilot.Data.Entites;

namespace CodePilot.Services.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUserRepository userRepository, IConfiguration configuration, IPasswordHasher<User> passwordHasher, ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        public async Task<ServiceResponse<int>> RegisterUser(User user, string password)
        {
            try
            {
                if (await _userRepository.IsUseremailTakenAsync(user.Email))
                {
                    _logger.LogWarning("Registration failed: Username '{Username}' is already taken.", user.Username);
                    return new ServiceResponse<int> { Success = false, Message = "Username is already taken." };
                }

                user.PasswordHash = _passwordHasher.HashPassword(user, password);
                user.CreatedAt = DateTime.UtcNow;
                user.LastLogin = DateTime.UtcNow;

                await _userRepository.CreateUserAsync(user);
                await _userRepository.SaveChangesAsync();

                _logger.LogInformation("User '{Username}' registered successfully.", user.Username);
                return new ServiceResponse<int> { Success = true, Data = user.Id, Message = "User registered successfully." };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during user registration.");
                return new ServiceResponse<int> { Success = false, Message = "An error occurred while registering user." };
            }
        }

        public async Task<ServiceResponse<string>> Login(string email, string password)
        {
            try
            {
                _logger.LogInformation($"Attempting to log in with email: {email}");

                var user = await _userRepository.GetUserByUseremailAsync(email);
                if (user == null)
                {
                    _logger.LogWarning("Login failed: User with email '{Email}' not found.", email);
                    return new ServiceResponse<string> { Success = false, Message = "Invalid email or password." };
                }

                var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
                if (passwordVerificationResult == PasswordVerificationResult.Failed)
                {
                    _logger.LogWarning("Login failed: Incorrect password for user '{Email}'.", email);
                    return new ServiceResponse<string> { Success = false, Message = "Invalid email or password." };
                }

                user.LastLogin = DateTime.UtcNow;
                await _userRepository.SaveChangesAsync();

                var token = GenerateJwtToken(user);
                _logger.LogInformation("User '{Email}' logged in successfully.", email);
                return new ServiceResponse<string> { Success = true, Data = token, Message = "Login successful." };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during user login.");
                return new ServiceResponse<string> { Success = false, Message = "An error occurred while logging in." };
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(5),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<ServiceResponse<string>> ChangePassword(int userId, string oldPassword, string newPassword)
        {
            try
            {
                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("ChangePassword failed: User with ID '{UserId}' not found.", userId);
                    return new ServiceResponse<string> { Success = false, Message = "User not found." };
                }

                var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, oldPassword);
                if (passwordVerificationResult == PasswordVerificationResult.Failed)
                {
                    _logger.LogWarning("ChangePassword failed: Incorrect old password for user '{UserId}'.", userId);
                    return new ServiceResponse<string> { Success = false, Message = "Old password is incorrect." };
                }

                user.PasswordHash = _passwordHasher.HashPassword(user, newPassword);
                await _userRepository.SaveChangesAsync();

                _logger.LogInformation("User '{UserId}' changed password successfully.", userId);
                return new ServiceResponse<string> { Success = true, Message = "Password changed successfully." };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while changing password for user '{UserId}'.", userId);
                return new ServiceResponse<string> { Success = false, Message = "An error occurred while changing password." };
            }
        }
    }
}
