using Microsoft.EntityFrameworkCore;
using RotateAPI.Models;

namespace RotateAPI.Data
{
    /// This class is whats known as a Database Context.
    /// What that means is that this class is the direct 
    /// connection to the SQL Database done through code.
    /// 
    ///*Every time a table is added to the database, a 
    ///*model version must be made like the user set 
    ///*as this is creating the direct instance of the
    ///*table from SQL. 
    public class PerspectiveContext : DbContext
    {
        public PerspectiveContext(DbContextOptions<PerspectiveContext> opt)
            : base(opt)
        {
        }

        public DbSet<LoginAttempt> login_attempts {get;set;} // creates an instance of the login attempts table
        public DbSet<UserTrustedDevice> user_trusted_devices {get;set;}
        public DbSet<EmailVerify> email_table {get;set;}
        public DbSet<Survey> survey {get;set;}
        public DbSet<User> users {get;set;} // creates an instance of the user table.
        public DbSet<UserSetting> user_settings {get;set;}
        public DbSet<Post> posts {get;set;} // creates an instance of the posts table.
        public DbSet<Topic> topics {get;set;} // creates an instance of the topics table.
        public DbSet<UserTopics> user_topics {get;set;} // creates an instance of the user topics table.
        public DbSet<UserFollowers> user_followers {get;set;} // creates an instance of the user followers table.
        public DbSet<Profile> profiles {get;set;} // creates an instance of the profiles table
        public DbSet<Blocked> blocked {get;set;}
        public DbSet<Interaction> interactions {get;set;}
    } // end class

} // end namespace