using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.CORE.DTOs
{
    
        public class RegisterRequest
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Role { get; set; } // אופציונלי
        }

        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class ChangePasswordRequest
        {
            public int UserId { get; set; }
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
        }
    }

