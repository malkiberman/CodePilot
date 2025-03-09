using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Data.Entites
{
    public class AuditLog
    {
        public int Id { get; set; }  // מזהה ייחודי
        public int UserId { get; set; }  // מזהה המשתמש
        public User User { get; set; }  // קשר עם המשתמש
        public string Action { get; set; }  // הפעולה שבוצעה (Upload, Delete, Edit)
        public DateTime ActionDate { get; set; }  // תאריך ביצוע הפעולה
        public string Details { get; set; }  // 
    }
}
