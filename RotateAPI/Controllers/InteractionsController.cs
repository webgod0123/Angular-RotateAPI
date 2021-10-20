using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RotateAPI.Data;
using RotateAPI.Models;
using RotateAPI.Models.DTOs.Responses;

namespace RotateAPI.Controllers
{
    [Route("api/[controller]")] //api/Topics
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class InteractionsController : Controller
    {
        private readonly PerspectiveContext _context;
        public InteractionsController(PerspectiveContext context)
        {
            _context = context;
        }

        [Route("~/api/v1/add-interaction")]
        [HttpPost]
        public async Task<IActionResult> AddInteract([FromBody][Bind(include:"UserID, PostID, Type")] Interaction obj)
        {
            if(ModelState.IsValid)
            {
                
                Guid iid = new Guid(obj.PostID.ToString());
                obj.PostID = iid;
                var inter = await _context.interactions.SingleOrDefaultAsync(o => o.UserID == obj.UserID && o.PostID == obj.PostID);
                if(inter != null)
                {
                    return BadRequest(new InteractionResponse()
                    {
                        Errors = new List<string>()
                        {
                            "This interaction already exists"
                        },
                        Success = false
                    });
                }
                var task = _context.interactions.AddAsync(obj);
                await task;
                if(task.IsCompletedSuccessfully)
                {
                    await _context.SaveChangesAsync();
                    return Ok(new InteractionResponse()
                    {
                        Interaction = task.Result.Entity,
                        Success = true
                    });
                }
                return BadRequest(new InteractionResponse()
                {
                    Errors = new List<string>()
                    {
                        "Something went wrong",
                        task.Result.ToString()
                    },
                    Success = false
                });
            }
            return BadRequest(new InteractionResponse()
            {
                Errors = new List<string>
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }
        [Route("~/api/v1/get-interactions/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInteractions(string id)
        {
            if(ModelState.IsValid)
            {
                if(!id.Contains(':'))
                {
                    return BadRequest(new InteractionResponse()
                    {
                        Success = false,
                        Errors = new List<string>()
                        {
                            "This request doesnt contain an ':'"
                        }
                    });
                }
                string[] tempArr = id.Split(':');
                long userID;
                Guid postId;
                try
                {
                    postId = Guid.Parse(tempArr[0]);
                    userID = Int64.Parse(tempArr[1]);
                }
                catch(Exception e)
                {
                    Console.WriteLine(e);
                    return BadRequest(new InteractionResponse()
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            e.Message 
                        },
                        Success = false
                    });
                }
                List<Interaction> interactions = await _context.interactions.Where(obj => obj.UserID == userID && obj.PostID == postId).ToListAsync<Interaction>();
                return Ok(new InteractionResponse()
                {
                    Interactions = interactions,
                    Success = true
                });
            }
            return BadRequest(new InteractionResponse()
            {
                Errors = new List<string>
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }
        [Route("~/api/v1/get-interaction-count/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInteractionCount(string id)
        {
            if(ModelState.IsValid)
            {
                if(!id.Contains(':'))
                {
                    return BadRequest(new InteractionResponse()
                    {
                        Success = false,
                        Errors = new List<string>()
                        {
                            "This request doesnt contain an ':'"
                        }
                    });
                }
                string[] tempArr = id.Split(':');
                int type;
                Guid postId;
                try
                {
                    postId = Guid.Parse(tempArr[0]);
                    type = Int32.Parse(tempArr[1]);
                }
                catch(Exception e)
                {
                    Console.WriteLine(e);
                    return BadRequest(new InteractionResponse()
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            e.Message 
                        },
                        Success = false
                    });
                }
                long count = await _context.interactions.Where(obj => obj.Type == type && obj.PostID == postId).CountAsync<Interaction>();
                return Ok(new InteractionResponse()
                {
                    Count = count,
                    Success = true
                });
            }
            return BadRequest(new InteractionResponse()
            {
                Errors = new List<string>
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }

        [Route("~/api/v1/remove-interaction/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveInteraction(string id)
        {
            if(ModelState.IsValid)
            {
                Guid iid = new Guid(id);
                var task = _context.interactions.FindAsync(iid);
                await task;
                if(task.IsCompletedSuccessfully)
                {
                    _context.interactions.Remove(task.Result);
                    await _context.SaveChangesAsync();
                    return Ok(new InteractionResponse()
                    {
                        Success = true
                    });
                }
                return BadRequest(new InteractionResponse()
                {
                    Errors = new List<string>()
                    {
                        "Something went wrong"
                    },
                    Success = false
                });
            }
            return BadRequest(new InteractionResponse()
            {
                Errors = new List<string>
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }
    }
}