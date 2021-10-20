using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RotateAPI.Data;
using Microsoft.EntityFrameworkCore;
using RotateAPI.Configuration;
using Microsoft.EntityFrameworkCore.SqlServer;
using RotateAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Azure;
using Azure.Identity;

namespace RotateAPI
{
    /// Class need to start up the api. In order to test with front end,
    /// you have to right click the "webpages" folder and click "run in
    /// integrated terminal." You must then run the command "ng serve".
    /// Finally, you just need to click the Run tab in the upper left 
    /// corner and click "Run without debugging". This should let you 
    /// test the front with the back.
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment {get;}


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<JwtConfig>(Configuration.GetSection("JwtConfig")); //reads config from appsettings.json
            
            // Creates a new PerspectiveContext that connects to the database.
            // The connection string is in the appsettings.json file. Once we have
            //  a released app, this clause will switch to SQLite so any changes 
            // will be made to a local database rather than the Server Database, which is 
            // just better for A. rapid development and B. making sure it all works 
            // fine. This part also helps set up the dependency injection needed to 
            // connect to the Controllers. The reason we use dependency injection
            // is because it makes it easier to remove parts of the system 
            // later on if necessary without destroying the whole system.
            // 
            //?Also, we may want to look into getting two different servers once
            //?release day comes, I'll ask Matt about this but I think it'd be better
            //?to have a development server for testing new features and a production
            //?server that has all of the actual data on it.

            services.AddDbContext<PerspectiveContext>(options =>
            {
                string conString = Configuration.GetConnectionString("ProductionContext");
                // string liteConString = Configuration.GetConnectionString("UserContextLite");
                // if(Environment.IsDevelopment())
                // {                //     options.UseSqlite(liteConString);
                // }
                // else 
                // {
                     options.UseSqlServer(conString);
                // }
                
            });
            services.AddAuthentication(opt => 
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwt =>
            {
                byte[] key = Encoding.ASCII.GetBytes(Configuration["JwtConfig:Secret"]);
                jwt.SaveToken = true;

                jwt.TokenValidationParameters = new TokenValidationParameters 
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    RequireExpirationTime = false // turn on for production
                };
            });
            services.AddCors();
            services.AddControllers()
                    .AddNewtonsoftJson();
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "RotateAPI", Version = "v1" });
            });

            services.AddAzureClients(builder =>
            {
                
                builder.AddBlobServiceClient(Configuration.GetConnectionString("ProductionBlobStorage"));

                builder.UseCredential(new DefaultAzureCredential());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors(options =>
                options.WithOrigins("http://localhost:4200", 
                            "https://dev-front-end.azurewebsites.net",
                            "https://perspective-app.azurewebsites.net",
                            "https://perspective.social",
                            "https://www.perspective.social")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "RotateAPI v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            
        }
    }
}
