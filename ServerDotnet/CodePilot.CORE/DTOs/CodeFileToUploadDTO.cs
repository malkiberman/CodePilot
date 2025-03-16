using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.CORE.DTOs
{
    public class CodeFileToUploadDTO
    {
        public string FileName { get; set; }
        public string FileType { get; set; }
        public IFormFile File { get; set; }  // הקובץ עצמו (עם תמיכה בקבצים שהמשתמש
        public int UserId { get; set; }  // הוסף את UserId

    }
}
