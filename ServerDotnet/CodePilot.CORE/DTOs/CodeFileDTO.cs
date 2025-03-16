using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.CORE.DTOs
{
    public class CodeFileDTO
    {
        public int Id { get; set; }  // מזהה ייחודי לקובץ קוד
        public string FileName { get; set; }  // שם הקובץ
        public string FilePath { get; set; }  // מיקום הקובץ בשרת או ב-S3
        public string FileType { get; set; }  // סוג הקובץ (C#, Java, Python, etc.)
        public DateTime UploadedAt { get; set; }  // תאריך העלאת הקובץ
        public int UserId { get; set; }  // הוסף את UserId

    }
}
