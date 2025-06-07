using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Services.IServices
{
   public interface IAiService
    {

        Task<string> GetCodeImprovementsAsync(string codeContent);

    }
}
