using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Service
{
    public class S3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly ILogger<S3Service> _logger;

        public S3Service(IConfiguration configuration, ILogger<S3Service> logger)
        {
            var awsOptions = configuration.GetSection("AWS");
            var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY");
            var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_KEY");
            var region = awsOptions["Region"];
            _bucketName = awsOptions["BucketName"];
            _logger = logger;

            _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName)
        {
            // בדיקה אם הקובץ הוא מסוג קוד
            if (!IsValidCodeFile(fileName))
            {
                _logger.LogError($"Invalid file type: {fileName}");
                throw new Exception("Invalid file type. Only code files are allowed.");
            }

            try
            {
                var request = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = fileName,
                    InputStream = fileStream,
                    ContentType = "application/octet-stream" // סוג קובץ גנרי
                };

                var response = await _s3Client.PutObjectAsync(request);
                _logger.LogInformation($"File {fileName} uploaded successfully to S3.");
                return $"https://{_bucketName}.s3.{_s3Client.Config.RegionEndpoint.SystemName}.amazonaws.com/{fileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error uploading file {fileName}: {ex.Message}");
                throw new Exception($"Error uploading file {fileName}: {ex.Message}", ex);
            }
        }

        public async Task<Stream> DownloadFileAsync(string fileName)
        {
            try
            {
                var request = new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = fileName
                };

                var response = await _s3Client.GetObjectAsync(request);
                return response.ResponseStream;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error downloading file {fileName}: {ex.Message}");
                throw new Exception($"Error downloading file {fileName}: {ex.Message}", ex);
            }
        }

        // פונקציה לבדיקת סוג הקובץ
        private bool IsValidCodeFile(string fileName)
        {
            var allowedExtensions = new[] { ".cs", ".java", ".py", ".js", ".cpp", ".html", ".css" };
            var fileExtension = Path.GetExtension(fileName);
            return allowedExtensions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase);
        }

        // אפשרות לשימוש ב-TransferUtility להעלאה
        public async Task<string> UploadFileWithTransferUtilityAsync(Stream fileStream, string fileName)
        {
            try
            {
                var fileTransferUtility = new TransferUtility(_s3Client);
                await fileTransferUtility.UploadAsync(fileStream, _bucketName, fileName);
                _logger.LogInformation($"File {fileName} uploaded using TransferUtility.");
                return $"https://{_bucketName}.s3.{_s3Client.Config.RegionEndpoint.SystemName}.amazonaws.com/{fileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error uploading file {fileName} with TransferUtility: {ex.Message}");
                throw new Exception($"Error uploading file {fileName} with TransferUtility: {ex.Message}", ex);
            }
        }
    }
}
