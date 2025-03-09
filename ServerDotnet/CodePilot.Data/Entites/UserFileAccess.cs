using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Data.Entites
{
    public class UserFileAccess
    {
        public int Id { get; set; }  // מזהה ייחודי
        public int UserId { get; set; }  // מזהה המשתמש
        public User User { get; set; }  // קשר עם משתמש
        public int FileId { get; set; }  // מזהה הקובץ
        public CodeFile File { get; set; }  // קשר עם קובץ קוד
        public string AccessLevel { get; set; }  // רמת הגישה (Read, Write, Delete)
    }
}
