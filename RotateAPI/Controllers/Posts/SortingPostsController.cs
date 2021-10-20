using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RotateAPI.Models;
using RotateAPI.Models.DTOs.Responses;

namespace RotateAPI.Controllers
{
    
    
    public partial class PostsController : Controller
    {
         // HTTP GET
        // This function gets a list of posts that
        // all stem from the same topic ID. First,
        // makes sure everything is valid and an id
        // is sent. Then, it creates a list of all
        // the posts with the topic id sent. If there
        // are 1 or more, it creates a list with the
        // guid of the posts and returns that.
        // 
        // @param id = id of the topic to search the db for

        [Route("~/api/v1/get-posts-topic-id/{id}")]
        [HttpGet("{id:long}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetPostsFromTopicID(long? id)
        {
            if(ModelState.IsValid)
            { // model state is valid
                
                if(id == null)
                { // there is no id sent
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, no ID"
                        },
                        Success = true
                    });
                }

                // creates a list of all the posts with the topic id asked for
                List<Post> post_list = await _context.posts.Where<Post>(p => 
                    p.TopicID == id
                    && p.Type != "Comment")
                    .ToListAsync<Post>();
               
                if(post_list.Count == 0)
                { // there are no posts under that topic id
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "No posts in this topic"
                        },
                        Success = true
                    });
                }

                // return the list of posts under this topic
                return Ok(new PostResponse
                {
                    PostList = post_list,
                    Success = true
                });
            }

            // model state was invalid
            return BadRequest(new PostResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function

        [Route("~/api/v1/get-posts-user-id/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetPostsFromUserID(long? id)
        {
            if(ModelState.IsValid)
            { // payload is valid
                if(id == null)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, no ID was sent"
                        },
                        Success = false
                    });
                }
                List<Post> post_list = await _context.posts.Where<Post>(p => 
                    p.UserID == id
                    && p.Type != "Comment")
                    .ToListAsync<Post>();

                if(post_list.Count == 0)
                { // there are no posts under that user id
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "This user hasn't posted any posts."
                        },
                        Success = true
                    });
                }

                // return the list of posts under this topic
                return Ok(new PostResponse
                {
                    PostList = post_list,
                    Success = true
                });
            }
            
            //payload is invalid
            return BadRequest(new PostResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function

        [Route("~/api/v1/get-posts-type/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostsFromType(string id)
        {
            if(ModelState.IsValid)
            { // payload is valid
                if(id == null)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, no ID was sent"
                        },
                        Success = false
                    });
                }
                
                List<Post> post_list = await _context.posts.Where<Post>(p => 
                    p.Type == id)
                    .ToListAsync<Post>();

                if(post_list.Count == 0)
                { // there are no posts under that user id
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "This type has no posts."
                        },
                        Success = true
                    });
                }

                // return the list of posts under this topic
                return Ok(new PostResponse
                {
                    PostList = post_list,
                    Success = true
                });
            }
            
            //payload is invalid
            return BadRequest(new PostResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function   

        [Route("~/api/v1/get-posts-user-id-and-type/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostsFromUserIDAndType(string id)
        {
            if(ModelState.IsValid)
            { // payload is valid
                
                if(id.Contains(':') == false)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, search was formatted incorrectly"
                        },
                        Success = false
                    });
                }
                
                string[] splitArr = id.Split(':');
                string type = splitArr[0];
                long userID;
                try 
                {
                    userID = Int64.Parse(splitArr[1]);
                }
                catch (Exception e)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, search was formatted incorrectly",
                            e.ToString()
                        },
                        Success = false
                    });
                }
                
                List<Post> post_list = await _context.posts.Where<Post>(p => 
                    p.UserID == userID && 
                    p.Type == type)
                    .ToListAsync<Post>();

                if(post_list.Count == 0)
                { // there are no posts under that user id
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "This user hasn't posted any posts of that type."
                        },
                        Success = true
                    });
                }

                // return the list of posts under this topic
                return Ok(new PostResponse
                {
                    PostList = post_list,
                    Success = true
                });
            }
            
            //payload is invalid
            return BadRequest(new PostResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }
        [Route("~/api/v1/get-posts-topic-id-and-type/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostsFromTopicIDAndType(string id)
        {
            if(ModelState.IsValid)
            { // payload is valid
                if(id == null)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, no ID was sent"
                        },
                        Success = false
                    });
                }
                if(id.Contains(':') == false)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, search was formatted incorrectly"
                        },
                        Success = false
                    });
                }
                
                string[] splitArr = id.Split(':');
                string type = splitArr[0];
                long topicID;
                try 
                {
                    topicID = Int64.Parse(splitArr[1]);
                }
                catch (Exception e)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, search was formatted incorrectly",
                            e.ToString()
                        },
                        Success = false
                    });
                }
                
                List<Post> post_list = await _context.posts.Where<Post>(p => 
                    p.TopicID == topicID && 
                    p.Type == type)
                    .ToListAsync<Post>();

                if(post_list.Count == 0)
                { // there are no posts under that topic id
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "This topic hasn't posted any posts of that type."
                        },
                        Success = true
                    });
                }

                // return the list of posts under this topic
                return Ok(new PostResponse
                {
                    PostList = post_list,
                    Success = true
                });
            }
            
            //payload is invalid
            return BadRequest(new PostResponse
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