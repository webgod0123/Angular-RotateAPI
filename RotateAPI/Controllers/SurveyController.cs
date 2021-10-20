using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RotateAPI.Data;
using RotateAPI.Models;
using RotateAPI.Models.DTOs.Responses;

namespace RotateAPI.Controllers
{
    [ApiController]
    public class SurveyController : Controller
    {
        private readonly PerspectiveContext _context;
        public SurveyController(PerspectiveContext context)
        {
            _context = context;
        }

        [Route("~/api/v1/new-survey")]
        [HttpPost]
        public async Task<IActionResult> NewSurvey ([FromBody] [Bind(include:"UserID, Abortion, ClimateChange, MilitaryViolence, BorderControl, Infrastructure, Total")]Survey survey)
        {
            if(ModelState.IsValid)
            {
                var task = _context.survey.AddAsync(survey);
                
                try
                {
                    await task;
                    if(task.IsCompletedSuccessfully)
                    {
                        await _context.SaveChangesAsync();
                        return Ok(new SurveyResponse()
                        {
                            Success = true,
                            Survey = survey
                        });
                    }
                }
                catch (Exception e)
                {
                    return BadRequest(new SurveyResponse()
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            e.Message
                        },
                        Success = false
                    });
                }
            }
            return BadRequest(new SurveyResponse()
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }
        [Route("~/api/v1/get-survey/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetSurvey(long id)
        {
            if(ModelState.IsValid)
            {
                var task = _context.survey.FindAsync(id);
                try
                {
                     await task;
                     if(task.IsCompletedSuccessfully)
                     {
                         return Ok(new SurveyResponse()
                         {
                             Survey = task.Result,
                             Success = true
                         });
                     }
                }
                catch (Exception e)
                {
                    return BadRequest(new SurveyResponse()
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            e.Message
                        },
                        Success = false
                    });
                }
            }
            return BadRequest(new SurveyResponse()
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