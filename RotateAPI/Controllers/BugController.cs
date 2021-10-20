using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RotateAPI.Common;
using RotateAPI.Models.DTOs.Email;
using RotateAPI.Models.DTOs.Responses;

namespace RotateAPI.Controllers
{
    [ApiController]
    public class BugController : Controller
    {
        private IConfiguration _config {get;}
        public BugController(IConfiguration config)
        {
            _config = config;
        }
        [Route("~/api/v1/send-bug-report")]
        public async Task<IActionResult> SendBugReport (Bug report)
        {
            if(ModelState.IsValid)
            {
                Email email = new Email();
                email.To = "contact@perspectiveapplication.com";
                email.From = email.To;
                email.FromPassword = _config.GetConnectionString("EmailPassword");
                email.Subject = report.Subject;
                email.Body = report.Body + "\n\n\n" + report.Email;
                try
                {
                    SendEmail.Send(email);
                    return Ok(new BugResponse()
                    {
                        Success = true
                    });
                }
                catch (Exception e)
                {
                    return BadRequest(new BugResponse()
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            e.Message,
                        },
                        Success = false
                    });
                }
            }
            return BadRequest(new BugResponse()
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }
    }
}