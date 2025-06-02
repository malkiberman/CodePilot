using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using CodePilot.Data;  // הוספת הפנייה זו

public class CodePilotDbContextFactory : IDesignTimeDbContextFactory<CodePilotDbContext>
{
    public CodePilotDbContext CreateDbContext(string[] args)
    {
        Console.WriteLine("USING SUPABASE!!!"); // בדיקה
        var optionsBuilder = new DbContextOptionsBuilder<CodePilotDbContext>();

        optionsBuilder.UseNpgsql("Host=aws-0-eu-central-1.pooler.supabase.com;Port=5432;Username=postgres.scvlyllztjxqnbmzzxgk;Password=VQS_nZ-!iX!$5&#;Database=postgres;SSL Mode=Require;Trust Server Certificate=true;Timeout=30;");

        return new CodePilotDbContext(optionsBuilder.Options);
    }
}
