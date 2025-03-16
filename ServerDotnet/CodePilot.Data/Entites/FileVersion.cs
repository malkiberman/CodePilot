using CodePilot.Data.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Data.Entities
{
    public class FileVersion
    {
        public int Id { get; set; }  // מזהה ייחודי לגרסה
        public int CodeFileId { get; set; }  // מזהה הקובץ המקורי (קישור ל-CodeFile)
        public CodeFile CodeFile { get; set; }  // קשר עם הקובץ המקורי
        public int VersionId { get; set; }  // מזהה גרסה (מספר גרסה)
        public string FilePath { get; set; }  // המיקום של הגרסה (למשל, ב-S3 או בשרת)
        public DateTime CreatedAt { get; set; }  // תאריך יצירת הגרסה
    }
}
