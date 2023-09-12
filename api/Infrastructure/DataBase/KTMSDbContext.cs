using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics.Tracing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MFC.Infrastructure.DataBase
{
    public class KTMSDbContext : DbContext
    {
        public KTMSDbContext(DbContextOptions<KTMSDbContext> options) : base(options)
        {

        }
        public KTMSDbContext()
     : base()
        {

        }

        public virtual  DbSet<Event> Events { get; set; }
        public virtual DbSet<UserModel> Users { get; set; }
        public virtual DbSet<TokenModel> Tokens { get; set; }
        public virtual DbSet<EventStatus> EventStatuses{ get; set; }
        public virtual DbSet<EventType> EventTypes { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Person> Persons { get; set; }




    }
}
