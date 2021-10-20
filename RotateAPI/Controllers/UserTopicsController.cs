using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RotateAPI.Common;
using RotateAPI.Data;
using RotateAPI.Models;
using RotateAPI.Models.DTOs.Responses;

namespace RotateAPI.Controllers
{

    /// This class is in charge of the User_Topics table
    /// and functions relating to that table. 

    [Route("api/[controller]")] //api/UserTopics
    [ApiController]
    public class UserTopicsController : Controller
    {
        private readonly PerspectiveContext _context;

        public UserTopicsController(PerspectiveContext context)
        { // gets the DB context through dependency injection
            _context = context;
        }

        // HTTP POST
        // This function creates a relationship between a topic and 
        // a user. First, it checks to make sure the object is actually
        // sent. Then, it sents the timestamp to the current time and
        // trys to add the object to the db. If successful, it saves the
        // changes and returns the user topic to the front end.
        // 
        // @param obj = object with userid and topicid to create relationship btwn
        // 
        // returns json object with either a list of errors or the created relationship

        [Route("~/api/v1/follow-topic")]
        [HttpPost]
        public async Task<IActionResult> FollowTopic([FromBody][Bind(include:"UserID, FollowedTopicID")] UserTopics obj)
        {
            if(ModelState.IsValid)
            { // valid payload
                
                if(await _context.user_topics.SingleOrDefaultAsync(o => o.UserID == obj.UserID && o.FollowedTopicID == obj.FollowedTopicID) != null)
                { // the relationship sent already exists
                    return BadRequest(new UserTopicResponse
                    {
                        Errors = new List<string>()
                        {
                            "This user has followed this topic"
                        },
                        Success = false
                    }); 
                }

                // add object to db
                obj.Timestamp = System.DateTime.UtcNow;
                ValueTask<EntityEntry<UserTopics>> followSuccess = _context.user_topics.AddAsync(obj);
                await followSuccess;

                if(followSuccess.IsCompletedSuccessfully)
                { // object successfully added
                    await _context.SaveChangesAsync();
                    return Ok (new UserTopicResponse
                    {
                        Success = true,
                        Followed = true,
                        Relationship = obj
                   });
                }

                // task couldn't be completed
                return BadRequest(new UserTopicResponse
                {
                    Errors = new List<string>()
                    {
                        "This task could not be completed",
                        followSuccess.Result.ToString()
                    },
                    Success = false
                });
            }
            // payload is invalid
            return BadRequest(new UserTopicResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function

        // HTTP GET
        // This function gets all of a user's followed topics. First,
        // it checks to see if the id is valid. Then, it creates a
        // list of all the relationships with the userid in them. 
        // After making sure there is relationships, it takes the 
        // user id's and adds them to another list that is then 
        // sent back to the front end
        // 
        // @param id = user id
        // 
        // returns json object with either list of errors or list of users

        [Route("~/api/v1/get-followed-topic-user-id/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetFollowedTopicsFromUserID (long? id)
        {
            if(ModelState.IsValid)
            { // payload is valid
                if(id == null)
                { // id wasn't sent
                    return BadRequest(new UserTopicResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, no id"
                        },
                        Success = false
                    });
                }
                
                // list of all relationships with the userid sent
                List<UserTopics> temp_list = await _context.user_topics.Where(o => o.UserID == id).ToListAsync<UserTopics>();
                
                // create list of topic ids and add all followed topics to this list
                List<long> topics_list = new List<long>();
                foreach(UserTopics t in temp_list)
                {
                    topics_list.Add(t.FollowedTopicID);
                }

                // return followed topics
                return Ok(new UserTopicResponse
                {
                    TopicList = topics_list,
                    Success = true
                });
            }

            // payload is invalid 
            return BadRequest(new UserTopicResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
         [Route("~/api/v1/get-topic-relationship/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRelationship(string id)
        {
            if(ModelState.IsValid)
            {
                if(id.Contains(':') == false)
                {
                    return BadRequest(new UserTopicResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, search was formatted incorrectly"
                        },
                        Success = false
                    });
                }
                
                string[] splitArr = id.Split(':');
                long userID;
                long topicID;
                try 
                {
                    topicID = Int64.Parse(splitArr[0]);
                    userID = Int64.Parse(splitArr[1]);
                }
                catch (Exception e)
                {
                    return BadRequest(new UserTopicResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, search was formatted incorrectly",
                            e.ToString()
                        },
                        Success = false
                    });
                }
                var task = _context.user_topics.SingleOrDefaultAsync(obj => obj.UserID == userID && obj.FollowedTopicID == topicID);
                await task;
                if(task.IsCompletedSuccessfully)
                {
                    if(task.Result != null)
                    {
                        return Ok(new UserTopicResponse()
                        {
                            Success = true,
                            Followed = true,
                            Relationship = task.Result
                        });
                    }
                    return Ok(new UserTopicResponse()
                    {
                        Success = true,
                        Followed = false
                    });
                }
                return BadRequest(new UserTopicResponse()
                {
                    Errors = new List<string>()
                    {
                        "Something went wrong",
                        task.Result.ToString()
                    },
                    Success = false
                });
            }
            // payload was invalid
            return BadRequest(new UserTopicResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }
        // HTTP GET
        // This function gets all the users that follow a topic. First, 
        // the function makes sure the payload is valid and the id was
        // actually sent. Then, it creates a list of all the relationships
        // with that topic id. If this list has 1 or more relationships,
        // it returns all of the user ids in the relationships.
        // 
        // @param id = topic id
        // 
        // returns json object with a list of errors or a list of user ids

        [Route("~/api/v1/get-followed-topic-id/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetFollowedTopicsFromTopicID (long? id)
        {
            if(ModelState.IsValid)
            { // payload is valid
                if(id == null)
                { // no id was sent
                    return BadRequest(new UserTopicResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, no id"
                        },
                        Success = false
                    });
                }

                // creates a list of all relationships with the topic id sent
                List<UserTopics> temp_list = await _context.user_topics.Where(o => o.FollowedTopicID == id).ToListAsync<UserTopics>();

                // creates a list of user id's and adds each user id from the relationship to the list
                List<long> users_list = new List<long>();
                foreach(UserTopics t in temp_list)
                {
                    users_list.Add(t.UserID);
                }

                // return the list
                return Ok(new UserTopicResponse
                {
                    UserList = users_list,
                    Success = true
                });
            }

            // payload was invalid
            return BadRequest(new UserTopicResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
        
        [Route("~/api/v1/unfollow-topic/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> UnfollowTopic(long id)
        {
            if(ModelState.IsValid)
            {
                var task = _context.user_topics.FindAsync(id);
                await task;
                if(task.IsCompletedSuccessfully)
                {  
                    _context.user_topics.Remove(task.Result);
                    await _context.SaveChangesAsync();
                    return Ok(new UserTopicResponse()
                    {
                        Success = true,
                        Followed = false
                    });
                }
                return BadRequest(new UserTopicResponse()
                {
                    Errors = new List<string>()
                    {
                        "Something went wrong",
                        task.Result.ToString()
                    }
                });
            }
            // payload was invalid
            return BadRequest(new UserTopicResponse
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