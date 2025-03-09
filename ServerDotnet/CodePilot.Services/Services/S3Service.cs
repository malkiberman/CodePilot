using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

public class S3Service
{
    private readonly IAmazonS3 _s3Client;
    private const string BucketName = "malki-testpnoren";
    private readonly IConfiguration _configuration;

    public S3Service(IConfiguration configuration)
    {
        _configuration = configuration;

        // קבלת נתוני החיבור מתוך appsettings.json
        var accessKey = _configuration["AWS:AccessKey"];
        var secretKey = _configuration["AWS:SecretKey"];
        var region = _configuration["AWS:Region"];

        var awsCredentials = new Amazon.Runtime.BasicAWSCredentials(accessKey, secretKey);
        _s3Client = new AmazonS3Client(awsCredentials, RegionEndpoint.GetBySystemName(region));
    }

    public async Task UploadFileAsync(string filePath)
    {
        try
        {
            var fileTransferUtility = new TransferUtility(_s3Client);

            // העלאת קובץ ל-S3
            await fileTransferUtility.UploadAsync(filePath, BucketName);
            Console.WriteLine("File uploaded to S3 successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error uploading file: " + ex.Message);
        }
    }
}
