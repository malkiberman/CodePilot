using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using codepilot.core.Repositories.Interfaces;
using CodePilot.Core.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CodePilot.Services
{
    public class S3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly ILogger<S3Service> _logger;
        private IFileVersionRepository _fileVersionRepository;

        public S3Service(IConfiguration configuration, ILogger<S3Service> logger, IFileVersionRepository fileVersionRepository)
        {
            var awsOptions = configuration.GetSection("AWS");
            var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY");
            var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_KEY");
            var region = awsOptions["Region"];
            _bucketName = awsOptions["BucketName"];
            _logger = logger;
            _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
            _fileVersionRepository = fileVersionRepository;
        }

        // העלאת קובץ (בהתאם לסוג קובץ קוד)
        public async Task<string> UploadCodeFileAsync(Stream fileStream, string fileName, string userId)
        {
            var key = $"{userId}/{fileName}"; // יצירת מזהה ייחודי לקובץ

            // בדיקה אם הקובץ הוא קובץ קוד
            if (!IsValidCodeFile(fileName))
            {
                _logger.LogError($"Invalid file type: {fileName}");
                throw new Exception("Invalid file type. Only code files are allowed.");
            }

            try
            {
                // העלאת הקובץ ל-S3
                var request = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    InputStream = fileStream,
                    ContentType = "application/octet-stream"
                };

                var response = await _s3Client.PutObjectAsync(request);
                _logger.LogInformation($"File {fileName} uploaded successfully for user {userId}. Version: {response.VersionId}");

                // החזרת כתובת URL של הקובץ המועלה
                return $"https://{_bucketName}.s3.{_s3Client.Config.RegionEndpoint.SystemName}.amazonaws.com/{key}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error uploading file {fileName} for user {userId}: {ex.Message}");
                throw new Exception($"Error uploading file {fileName}: {ex.Message}", ex);
            }
        }

  
     

        // הורדת כל הקבצים של יוזר מסוים
        public async Task<List<string>> DownloadAllFilesAsync(string userId)
        {
            var keyPrefix = $"{userId}/";
            var fileUrls = new List<string>();

            try
            {
                var listObjectsRequest = new ListObjectsV2Request
                {
                    BucketName = _bucketName,
                    Prefix = keyPrefix
                };

                var objectsResponse = await _s3Client.ListObjectsV2Async(listObjectsRequest);

                foreach (var s3Object in objectsResponse.S3Objects)
                {
                    var fileUrl = $"https://{_bucketName}.s3.{_s3Client.Config.RegionEndpoint.SystemName}.amazonaws.com/{s3Object.Key}";
                    fileUrls.Add(fileUrl);
                }

                return fileUrls;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error downloading all files for user {userId}: {ex.Message}");
                throw new Exception($"Error downloading all files for user {userId}: {ex.Message}", ex);
            }
        }

        // קבלת URL חתום להורדת קובץ
        public async Task<string> GetPresignedUrlAsync(string fileName, string userId)
        {
            var key = $"{userId}/{fileName}"; // המפתח ב-S3 כולל את מזהה המשתמש

            try
            {
                // יצירת בקשה ל-URL חתום
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    Expires = DateTime.UtcNow.AddMinutes(15), // זמן פקיעה ל-15 דקות
                    Verb = HttpVerb.GET // רק קריאה, לא שינוי
                };

                // יצירת ה-URL החתום
                var url = _s3Client.GetPreSignedURL(request);
                return url;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating presigned URL for file {fileName} and user {userId}: {ex.Message}");
                throw new Exception($"Error generating presigned URL: {ex.Message}", ex);
            }
        }


        public async Task<string> DownloadFileVersionAsync(int fileId, int versionId)
        {
            var key = $"{fileId}/{versionId}/fileContent"; // key בנוי ממזהה קובץ וגרסה
            try
            {
                var request = new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key
                };

                var response = await _s3Client.GetObjectAsync(request);
                using (var reader = new StreamReader(response.ResponseStream))
                {
                    var content = await reader.ReadToEndAsync();
                    return content;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error downloading file version {versionId} for file {fileId}: {ex.Message}");
                throw new Exception($"Error downloading file version {versionId}: {ex.Message}", ex);
            }
        }
        public async Task<bool> DeleteFileWithVersionsAsync(string userId, string fileName)
        {
            var key = $"{userId}/{fileName}";  // מפתח הקובץ ב-S3

            try
            {
                // שלב 1: קבלת כל הגרסאות של הקובץ
                var listVersionsRequest = new ListVersionsRequest
                {
                    BucketName = _bucketName,
                    Prefix = key
                };

                var listVersionsResponse = await _s3Client.ListVersionsAsync(listVersionsRequest);

                if (listVersionsResponse.Versions!=null&& listVersionsResponse.Versions.Count== 0)
                {
                    _logger.LogWarning($"No versions found for file {fileName} (User: {userId}).");
                    return false;
                }

                // שלב 2: מחיקת כל הגרסאות
                foreach (var version in listVersionsResponse.Versions)
                {
                    var deleteRequest = new DeleteObjectRequest
                    {
                        BucketName = _bucketName,
                        Key = key,
                        VersionId = version.VersionId  // מחיקת גרסה ספציפית
                    };

                    await _s3Client.DeleteObjectAsync(deleteRequest);
                    _logger.LogInformation($"Deleted version {version.VersionId} of file {fileName} (User: {userId}).");
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting file {fileName} and its versions for user {userId}: {ex.Message}");
                return false;
            }
        }
        public async Task<bool> RenameFileAsync(string userId, string oldFileName, string newFileName)
        {
            var oldKey = $"{userId}/{oldFileName}";  // מפתח הקובץ הישן
            var newKey = $"{userId}/{newFileName}";  // מפתח הקובץ החדש

            try
            {
                // שלב 1: להעתיק את הקובץ לשם החדש
                var copyRequest = new CopyObjectRequest
                {
                    SourceBucket = _bucketName,
                    SourceKey = oldKey,
                    DestinationBucket = _bucketName,
                    DestinationKey = newKey
                };

                var copyResponse = await _s3Client.CopyObjectAsync(copyRequest);
                if (copyResponse.HttpStatusCode != System.Net.HttpStatusCode.OK)
                {
                    _logger.LogError($"Error renaming file: failed to copy {oldFileName} to {newFileName}");
                    return false;
                }

                // שלב 2: למחוק את הקובץ הישן
                var isDeleted = await DeleteFileWithVersionsAsync(userId, oldFileName);
                return isDeleted;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error renaming file {oldFileName} to {newFileName} for user {userId}: {ex.Message}");
                return false;
            }
        }

        // פונקציה לבדיקת סוג קובץ קוד
        private bool IsValidCodeFile(string fileName)
        {
            var allowedExtensions = new[] { ".cs", ".java", ".py", ".js", ".cpp", ".html", ".css" };
            var fileExtension = Path.GetExtension(fileName);
            return allowedExtensions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase);
        }

    }
}
