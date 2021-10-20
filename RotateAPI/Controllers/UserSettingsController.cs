using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RotateAPI.Data;
using RotateAPI.Models;
using RotateAPI.Models.DTOs.Responses;
using System;
using Microsoft.AspNetCore.JsonPatch;
using RotateAPI.Common;

namespace RotateAPI.Controllers
{
    [ApiController]
    public class UserSettingsController : Controller
    {
        readonly PerspectiveContext _context;
        public UserSettingsController(PerspectiveContext context)
        {
            _context = context;
        }

        [Route("~/api/v1/new-settings")]
        [HttpPost]
        public async Task<IActionResult> AddSettings([FromBody][Bind(include:"UserID")] UserSetting set)
        {
            if(ModelState.IsValid)
            {
                
                try
                {
                    var task = _context.user_settings.AddAsync(set);
                    await task;
                    if(task.IsCompletedSuccessfully)
                    {
                        await _context.SaveChangesAsync();
                        return Ok(new UserSettingResponse()
                        {
                            Settings = task.Result.Entity,
                            Success = true
                        });
                    }
                }
                catch(Exception e)
                {
                     return BadRequest(new UserSettingResponse()
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
            return BadRequest(new UserSettingResponse()
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function


        [Route("~/api/v1/get-settings/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetSettings(long id)
        {
            if(ModelState.IsValid)
            {
                try
                {
                    var task = _context.user_settings.FindAsync(id);
                    await task;
                    if(task.IsCompletedSuccessfully)
                    {
                        return Ok(new UserSettingResponse()
                        {
                            Settings = task.Result,
                            Success = true
                        });
                    }
                }
                catch (Exception e)
                {
                    return BadRequest(new UserSettingResponse()
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
            return BadRequest(new UserSettingResponse()
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
        

        [Route("~/api/v1/update-settings/{id}")]
        [HttpPatch("{id:long}")]
        public async Task<IActionResult> UpdateSettings(long id, JsonPatchDocument update)
        {
            if(ModelState.IsValid)
            {
                try
                {
                    var task1 = Find.FindSettingNoTrack(id, _context);
                    await task1;
                    if(task1.Result != null && task1.IsCompletedSuccessfully)
                    {
                        UserSetting updated_settings = task1.Result;
                        update.ApplyTo(updated_settings);

                        _context.user_settings.Update(updated_settings);
                        await _context.SaveChangesAsync();
                        return Ok(new UserSettingResponse()
                        {
                            Settings = updated_settings,
                            Success = true
                        });
                    }
                }
                catch(Exception e)
                {
                    return BadRequest(new UserSettingResponse()
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
            return BadRequest(new UserSettingResponse()
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }
    } // end class

} // end namespace