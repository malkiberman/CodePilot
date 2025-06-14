﻿using CodePilot.CORE.DTOs;
using CodePilot.Services;
using CodePilot.Services.IServices;
using CodePilot.Services.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace CodePilot.Api.Controllers
{
    [Route("api/ai")]
    [ApiController]
    public class AiController : Controller
    {
        private readonly IAiService _aiService;

        public AiController(IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("analyze")]
        public async Task<string> AnalyzeFile([FromBody] string content)
        {
            Console.WriteLine("controller");
            Console.WriteLine("content"+content);
            if (string.IsNullOrWhiteSpace(content))
                return "No content provided.";

            string suggestions = await _aiService.GetCodeImprovementsAsync(content);
            return suggestions; 
        }
    }
}
