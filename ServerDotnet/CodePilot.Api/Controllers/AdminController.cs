﻿using CodePilot.CORE.DTOs;
using CodePilot.Services.IServices;
using CodePilot.Services.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodePilot.Api.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : Controller
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
      

        public AdminController(IUserService userService,IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
            

        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (result)
            {
                return NoContent(); // 204 - בקשה בוצעה בהצלחה ואין תוכן נוסף לשלוח
            }
            return NotFound(); // 404 - משתמש לא נמצא
        }

        // פעולות נוספות עבור ניהול משתמשים
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
         
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var response = await _authService.Login(request.Email, request.Password);

            if (!response.Success)
            {
                return Unauthorized(response.Message);
            }

            return Ok(response);
        }
        [Route("active")]
        [HttpGet]
        public async Task<IActionResult> GetActiveUsersReport([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var report = await _userService.GetActiveUsersReportAsync(from, to);
            return Ok(report);
        }

        [HttpGet("total-count")]
        public async Task<IActionResult> GetTotalUsersCount()
        {
            var count = await _userService.GetTotalUsersCountAsync();
            return Ok(count);
        }

        [HttpGet("new-count")]
        public async Task<IActionResult> GetNewUsersCount([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var count = await _userService.GetNewUsersCountAsync(from, to);
            return Ok(count);
        }

    }
}
