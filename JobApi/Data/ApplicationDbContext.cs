using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobApi.Models;
using Microsoft.EntityFrameworkCore;

namespace JobApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Workplace> Workplaces { get; set; }
    }
}