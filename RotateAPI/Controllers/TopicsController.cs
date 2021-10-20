using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RotateAPI.Data;
using RotateAPI.Models;
using RotateAPI.Models.DTOs.Responses;

namespace RotateAPI.Controllers
{
    [Route("api/[controller]")] //api/Topics
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class TopicsController : Controller
    {
        private readonly PerspectiveContext _context;
        public TopicsController (PerspectiveContext context)
        {
            _context = context;
        }
        
        // HTTP POST
        // CreatePost creates a post from a given topic name.
        // First, it checks to make sure a topic is sent. Then,
        // it creates the topic and makes sure it's successfully
        // added before saving the DB and returning the topic.
        // 
        // @param topic = name of topic to be added

        [Route("~/api/v1/add-topic")]
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] [Bind(include:"TopicName")]Topic topic)
        {
            if (ModelState.IsValid)
            { // payload sent is valid
                if (topic == null)
                { // there is no topic sent
                    return BadRequest(new TopicResponse
                    {
                        Errors = new List<string>()
                        {
                            "No topic was sent, add a topic and try again"
                        },
                        Success = false
                    });
                }

                // These two lines takes the topic and adds it to the database
                ValueTask<EntityEntry<Topic>> createdTopic = _context.topics.AddAsync(topic);
                await createdTopic;

                if(createdTopic.IsCompletedSuccessfully)
                { // successfully added
                    await _context.SaveChangesAsync(); // save db changes (must be done after add)

                    return Ok(new TopicResponse
                    {
                        Topic = topic,
                        Success = true
                    });
                }
                else
                { // adding failed
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Topic failed to be added to DB, please try again"
                        },
                        Success = false
                    });
                }
            }

            // payload was invalid
            return BadRequest(new PostResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
        
        // HTTP GET
        // GetTopic takes in an id and looks for
        // a topic in the topics table
        // 
        // @param id = id to check
        [Route("~/api/v1/get-topic/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetTopic(long? id)
        {
            if(ModelState.IsValid)
            { // valid payload
                if(id == null)
                { // no id was sent
                    return BadRequest (new TopicResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, no id"
                        },
                        Success = false
                    });
                }

                Topic topic = await _context.topics.FindAsync(id);
                if(topic == null)
                { // no topic exists
                    return BadRequest (new TopicResponse
                    {
                        Errors = new List<string>()
                        {
                            "Topic wasn't found, it was either deleted or doesn't exist"
                        },
                        Success = false
                    });
                }

                // topic was found
                return Ok (new TopicResponse
                {
                    Topic = topic,
                    Success = true
                });
            }

            // invalid payload
            return BadRequest(new TopicResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false                
            });
        } // end function

        [Route("~/api/v1/get-all-topics")]
        [HttpGet]
        public async Task<IActionResult> GetAllTopics()
        {
            if(ModelState.IsValid)
            {
                List<Topic> temp_list = await _context.topics.ToListAsync<Topic>();
                return Ok(new TopicResponse()
                {
                    Topics = temp_list,
                    Success = true
                });
            }
            // invalid payload
            return BadRequest(new TopicResponse
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