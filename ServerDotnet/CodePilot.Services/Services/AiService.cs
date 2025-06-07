using CodePilot.Services.IServices;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CodePilot.Services.Services
{
    public class AiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _model;
        private readonly string _endpoint;

        public AiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["OpenAI_ApiKey"];
            _model = configuration["OpenAI_Model"] ?? "gpt-4";
            _endpoint = configuration["OpenAI_Endpoint"] ?? "https://api.openai.com/v1/chat/completions";
        }
        public async Task<string> GetCodeImprovementsAsync(string codeContent)
        {
            var prompt = "You are a senior code reviewer. " +
                         "Analyze the following code and return exactly 4 numbered suggestions for improvement, clearly and concisely in plain text. " +
                         "Only return the 4 suggestions as one string, no explanations or extra formatting:\n\n" +
                         codeContent;

            var requestBody = new
            {
                model = _model,
                messages = new[]
                {
                    new { role = "user", content = prompt }
                },
                max_tokens = 500
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsync(_endpoint, content);
            response.EnsureSuccessStatusCode();
            var responseText = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseText);
            var messageContent = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return messageContent?.Trim() ?? "No suggestions returned.";
        }
    }
}
