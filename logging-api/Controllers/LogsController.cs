using LoggingAPI.Data;
using LoggingAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace LoggingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> LogAction([FromBody] LogEntry log)
        {
            if (log == null)
                return BadRequest();

            log.CreatedAt = DateTime.UtcNow;
            _context.Logs.Add(log);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, id = log.Id });
        }

        [HttpGet]
        public IActionResult GetLogs()
        {
            var logs = _context.Logs.OrderByDescending(l => l.CreatedAt).Take(100).ToList();
            return Ok(logs);
        }
    }
}
