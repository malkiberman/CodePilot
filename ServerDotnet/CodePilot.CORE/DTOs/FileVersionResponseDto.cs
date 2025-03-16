namespace CodePilot.CORE.DTOs
{
    public class FileVersionResponseDto
    {
        public int VersionId { get; set; }
        public int FileId { get; set; }
        public int VersionNumber { get; set; }
        public string S3Path { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}