using Microsoft.AspNetCore.Mvc;

namespace CodePilot.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API עובד!");
        }
    }
}
