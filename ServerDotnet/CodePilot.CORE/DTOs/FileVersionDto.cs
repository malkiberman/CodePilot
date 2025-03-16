namespace CodePilot.CORE.DTOs
{
    public class FileVersionDto
    {
        public int VersionId { get; set; }      // מזהה הגרסה
        public int FileId { get; set; }         // מזהה הקובץ הראשי
        public int VersionNumber { get; set; }  // מספר הגרסה
        public string S3Path { get; set; }      // הנתיב ב-S3
        public DateTime CreatedAt { get; set; } // תאריך יצירה
    }
}