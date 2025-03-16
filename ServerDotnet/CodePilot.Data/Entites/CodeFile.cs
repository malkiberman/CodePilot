using CodePilot.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Data.Entites
{
    public class CodeFile
    {
        public int Id { get; set; }  // מזהה ייחודי לקובץ קוד
        public string FileName { get; set; }  // שם הקובץ
        public string FilePath { get; set; }  // מיקום הקובץ בשרת או ב-S3
        public string FileType { get; set; }  // סוג הקובץ (C#, Java, Python, etc.)
        public DateTime UploadedAt { get; set; }  // תאריך העלאת הקובץ
        public int UserId { get; set; }  // מזהה המשתמש שצירף את הקובץ
        public User User { get; set; }  // קשר עם המשתמש
        public ICollection<CodeAnalysis> CodeAnalyses { get; set; }
        public ICollection<FileVersion> FileVersions { get; set; }
    }
}
