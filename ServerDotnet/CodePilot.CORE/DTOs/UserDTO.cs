using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.CORE.DTOs
{
    class UserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastLogin { get; set; }

    }
}
