using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Data.Entites
{
    public class User
    {
      
            public int Id { get; set; }  // מזהה ייחודי למשתמש
            public string Username { get; set; }  // שם משתמש
            public string Email { get; set; }  // אימייל
            public string PasswordHash { get; set; }  // סיסמה מוצפנת
            public string Role { get; set; }  // תפקיד (Admin, User)
            public DateTime CreatedAt { get; set; }  // תאריך יצירת המשתמש
            public DateTime LastLogin { get; set; }  // תאריך התחברות אחרון
        public ICollection<CodeFile> CodeFiles { get; set; }  // הוספת הקשר עם קבצי הקוד


    }
}
