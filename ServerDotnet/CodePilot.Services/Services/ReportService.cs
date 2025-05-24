using CodePilot.Data;
using CodePilot.Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Services.Services
{
   

        public class ReportService : IReportService
        {
            private readonly CodePilotDbContext _context;

            public ReportService(CodePilotDbContext context)
            {
                _context = context;
            }

            public async Task<List<ActiveUsersReportItem>> GetActiveUsersReportAsync(DateTime from, DateTime to)
            {
                var result = await _context.Users
                    .Where(u => u.LastLogin >= from && u.LastLogin <= to)
                    .GroupBy(u => u.LastLogin.Date)
                    .Select(g => new ActiveUsersReportItem
                    {
                        Date = g.Key,
                        ActiveUsersCount = g.Count()
                    })
                    .OrderBy(r => r.Date).ToList();

                return result;
            }
        }

    
}
