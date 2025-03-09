using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Data.Entites
{
    public class CodeAnalysis
    {
        public int Id { get; set; }  // מזהה ייחודי לניתוח קוד
        public string AnalysisResult { get; set; }  // תוצאת הניתוח (למשל, שגיאות או הצעות לשיפור)
        public DateTime AnalyzedAt { get; set; }  // מתי בוצע הניתוח
        public int CodeFileId { get; set; }  // מזהה הקובץ שהניתוח התבצע עליו
        public CodeFile CodeFile { get; set; }  // קשר עם הקובץ

    }
}
