using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RotateAPI.Data;
using RotateAPI.Models;
using RotateAPI.Models.DTOs.Responses;

namespace RotateAPI.Controllers
{

    /// This class is in charge of the User_Followers table
    /// and functions relating to that table. 

    [Route("api/[controller]")] //api/UserTopics
    [ApiController]
    public class UserFollowerController : Controller
    {
        private readonly PerspectiveContext _context;

        public UserFollowerController(PerspectiveContext context)
        { // gets the DB context through dependency injection
            _context = context;
        }

        // HTTP POST
        // This function creates a relationship between two users.
        // First, it checks to make sure the object is actually
        // sent. Then, it sents the timestamp to the current time and
        // trys to add the object to the db. If successful, it saves the
        // changes and returns the user topic to the front end.
        // 
        // @param obj = object with userids to create relationship btwn
        // 
        // returns json object with either a list of errors or the created relationship

        [Route("~/api/v1/follow-user")]
        [HttpPost]
        public async Task<IActionResult> FollowUser([FromBody][Bind(include:"UserID, FollowerID")] UserFollowers obj)
        {
            if(ModelState.IsValid)
            { // valid payload
                
                if(await _context.user_followers.SingleOrDefaultAsync(o => o.UserID == obj.UserID && o.FollowerID == obj.FollowerID) != null)
                { // the relationship sent already exists
                    return BadRequest(new UserFollowerResponse
                    {
                        Errors = new List<string>()
                        {
                            "This user has followed that user"
                        },
                        Success = false
                    }); 
                }

                obj.Timestamp = DateTime.UtcNow;
                // add object to db
                ValueTask<EntityEntry<UserFollowers>> followSuccess = _context.user_followers.AddAsync(obj);
                await followSuccess;

                if(followSuccess.IsCompletedSuccessfully)
                { // object successfully added
                    await _context.SaveChangesAsync();
                    return Ok (new UserFollowerResponse
                    {
                        UserFollower = obj,
                        Followed = true,
                        Success = true
                   });
                }
                // task couldn't be completed
                return BadRequest(new UserFollowerResponse
                {
                    Errors = new List<string>()
                    {
                        "This task could not be completed",
                        followSuccess.Result.ToString(),
                        followSuccess.ToString()
                    },
                    Success = false
                });
            }
            // payload is invalid
            return BadRequest(new UserFollowerResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function

        // HTTP GET
        // This function gets a list of users that follow a specific user
        // 
        // @param id = user id
        // 
        // returns json object with either list of errors or list of users

        [Route("~/api/v1/get-followers/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetFollowers (long? id)
        {
            if(ModelState.IsValid)
            { // payload is valid

                // creates a list of all relationships with the user id sent
                var task = _context.user_followers.Where(o => o.UserID == id).ToListAsync<UserFollowers>();
                await task;
                if(task.IsCompletedSuccessfully)
                {
                    // creates a list of user id's and adds each user id from the relationship to the list
                    List<UserFollowers> temp_list = task.Result;
                    List<long> users_list = new List<long>();
                    foreach(UserFollowers t in temp_list)
                    {
                        users_list.Add(t.FollowerID);
                    }

                    // return the list
                    return Ok(new UserFollowerResponse
                    {
                        UserList = users_list,
                        Success = true
                    });
                }
                return BadRequest(new UserFollowerResponse()
                {
                    Errors = new List<string>()
                    {
                        "Something went wrong",
                        task.Result.ToString()
                    },
                    Success = false
                });
            }

            // payload is invalid 
            return BadRequest(new UserFollowerResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function

        // HTTP GET
        // This function gets all the users that a user follows. First, 
        // the function makes sure the payload is valid and the id was
        // actually sent. Then, it creates a list of all the relationships
        // with that topic id. If this list has 1 or more relationships,
        // it returns all of the user ids in the relationships.
        // 
        // @param id = follower id
        // 
        // returns json object with a list of errors or a list of user ids

        [Route("~/api/v1/get-followed-users/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetFollowedUsers (long? id)
        {
            if(ModelState.IsValid)
            { // payload is valid
                
                // creates a list of all relationships with the follower id sent
                var task = _context.user_followers.Where(o => o.FollowerID == id).ToListAsync<UserFollowers>();
                await task;
                if(task.IsCompletedSuccessfully)
                {
                    // creates a list of user id's and adds each user id from the relationship to the list
                    List<UserFollowers> temp_list = task.Result;
                    List<long> users_list = new List<long>();
                    foreach(UserFollowers t in temp_list)
                    {
                        users_list.Add(t.UserID);
                    }

                    // return the list
                    return Ok(new UserFollowerResponse
                    {
                        UserList = users_list,
                        Success = true
                    });
                }
                return BadRequest(new UserFollowerResponse()
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
            return BadRequest(new UserFollowerResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
        
        [Route("~/api/v1/get-relationship/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRelationship(string id)
        {
            if(ModelState.IsValid)
            {
                if(id.Contains(':') == false)
                {
                    return BadRequest(new UserFollowerResponse
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
                long followerID;
                try 
                {
                    followerID = Int64.Parse(splitArr[0]);
                    userID = Int64.Parse(splitArr[1]);
                }
                catch (Exception e)
                {
                    return BadRequest(new UserFollowerResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, search was formatted incorrectly",
                            e.ToString()
                        },
                        Success = false
                    });
                }
                var task = _context.user_followers.SingleOrDefaultAsync(obj => obj.UserID == userID && obj.FollowerID == followerID);
                await task;
                if(task.IsCompletedSuccessfully)
                {
                    if(task.Result != null)
                    {
                        return Ok(new UserFollowerResponse()
                        {
                            Success = true,
                            Followed = true,
                            UserFollower = task.Result
                        });
                    }
                    return Ok(new UserFollowerResponse()
                    {
                        Success = true,
                        Followed = false
                    });
                }
                return BadRequest(new UserFollowerResponse()
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
            return BadRequest(new UserFollowerResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }
        [Route("~/api/v1/follower-count/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> FollowerCount (long? id)
        {
            if(ModelState.IsValid)
            {
                var task = _context.user_followers.Where(obj => obj.UserID == id).CountAsync();
                await task;
                Console.WriteLine(task.Result);
                if(task.IsCompletedSuccessfully)
                {
                    Console.WriteLine(task.Result);
                    long followers = task.Result;
                    return Ok(new UserFollowerResponse()
                    {
                        Count = followers,
                        Success = true
                    });
                }
                return BadRequest(new UserFollowerResponse()
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
            return BadRequest(new UserFollowerResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function

        [Route("~/api/v1/followed-count/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> FollowedCount (long? id)
        {
            if(ModelState.IsValid)
            {
                var task = _context.user_followers.Where(obj => obj.FollowerID == id).CountAsync();
                await task;
                if(task.IsCompletedSuccessfully)
                {
                    long followers = task.Result;
                    return Ok(new UserFollowerResponse()
                    {
                        Count = followers,
                        Success = true,
                    });
                }
                return BadRequest(new UserFollowerResponse()
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
            return BadRequest(new UserFollowerResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
        [Route("~/api/v1/unfollow-user/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> UnfollowUser(string id)
        {
            if(ModelState.IsValid)
            {
                Guid iid = new Guid(id);
                var task = _context.user_followers.FindAsync(iid);
                await task;
                if(task.IsCompletedSuccessfully)
                {
                    _context.user_followers.Remove(task.Result);
                    await _context.SaveChangesAsync();
                    return Ok(new UserFollowerResponse()
                    {
                        Success = true,
                        Followed = false
                    });
                }
            }
            return BadRequest(new UserFollowerResponse
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