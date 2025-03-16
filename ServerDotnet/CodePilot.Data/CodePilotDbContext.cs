using CodePilot.Data.Entites;
using CodePilot.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodePilot.Data
{
    public class CodePilotDbContext : DbContext
    {

        public DbSet<User> Users { get; set; }
        public DbSet<CodeFile> CodeFiles { get; set; }
        public DbSet<CodeAnalysis> CodeAnalyses { get; set; }
        public DbSet<UserFileAccess> UserFileAccesses { get; set; }
        public DbSet<FileVersion> FileVersions { get; set; }        
        public DbSet<AuditLog> AuditLogs { get; set; }
        
        public CodePilotDbContext(DbContextOptions<CodePilotDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // ניתן להגדיר כאן ישויות מיוחדות, יחסים וכו'
        }

    }
}
