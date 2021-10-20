
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Azure.Storage.Blobs;
using RotateAPI.Common;
using RotateAPI.Data;
using RotateAPI.Models;
using RotateAPI.Models.DTOs.Responses;
using RotateAPI.Models.DTOs.Requests;

namespace RotateAPI.Controllers
{
    /// This class is a controller for all of the posts
    /// that go through the website. It has three main 
    /// functions, CreatePost, GetPost, and GetAllPosts
    /// 
    /// CreatePost uses HTTP Post to create a new post. It
    /// first takes in the post and makes sure its valid,
    /// it then checks to see if it has a valid parent 
    /// (if it has a parent in the first place) and if
    /// it doesn't have a topic id it sets it equal to
    /// the parent's topic. Its then sent to the DB and
    /// the result is returned back to the front end.
    /// 
    /// GetPost uses HTTP Get to get an existing post.
    /// It checks to make sure the post is valid, then 
    /// trys to grab it from the database. If successful,
    /// its sent back.
    /// 
    /// GetAllPosts uses HTTP Get to get a list of all
    /// the post ids.
    /// 
    /// TODO: Make separate Topic Functions for different post types

    [Route("api/[controller]")] //api/Posts
    [ApiController]
    public partial class PostsController : Controller
    {
        private readonly PerspectiveContext _context;
        private readonly BlobServiceClient _client;
        public PostsController (PerspectiveContext context,
                                BlobServiceClient client)
        { // Gets the DB context through dependency injection
            _context = context;
            _client = client;
        }
        
        // HTTP POST
        // This function is an HTTP Post request that sends a new 
        // post to the database. It requires the UserID, Type, TopicID,
        // Tone, Title, ParentPostID, and Body. PostID and Timestamp
        // are generated automatically. It checks to make sure the
        // model state is valid and that the post isn't null. It then
        // does a check to see if the post : has a parent id, if the 
        // parent ID exists, and if the post has a topic ID. After
        // this, it sets the timestamp to now in UTC time and then
        // attempts to add the post to the database. If successful,
        // it saves the changes and returns a JSON object with the
        // post back to the front end
        // 
        // @param post = post to be added
        // 
        // returns json object with list of errors or created post

        [Route("~/api/v1/add-post")]
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> CreatePost([FromBody] [Bind(include:"UserID, Type, TopicID, Tone, Title, ParentPostID, Body")]Post post)
        {
            if (ModelState.IsValid)
            { // model state is valid
                if (post == null)
                { // post wasn't sent, no data in JSON object
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "No post was sent, add a post and try again"
                        },
                        Success = false
                    }); 
                }
                
                if(post.ParentPostID != null)
                { // post has a parent id
                    Post parent_post = await _context.posts.FindAsync(post.ParentPostID);
                    if(parent_post != null)
                    { // parent post found
                        post.TopicID = (post.TopicID == null) ? parent_post.TopicID : post.TopicID; // checks if post has a topic id. if no, make it the parent posts topic
                    }
                    else
                    { // parent post not found
                        return BadRequest(new PostResponse
                        {
                            Errors = new List<string>()
                            {
                                "This post doesn't exist"
                            },
                            Success = false
                        }); 
                    }
                }

                post.Timestamp = DateTime.UtcNow; // set timestamp to now in UTC

                // Creates a add post task and runs it
                ValueTask<EntityEntry<Post>> createdPost = _context.posts.AddAsync(post);
                await createdPost;

                if(createdPost.IsCompletedSuccessfully)
                { // post is successfully added
                    await _context.SaveChangesAsync(); // save db changes (must be done after add)

                    return Ok(new PostResponse
                    {
                        Post = post,
                        Success = true
                    }); 
                }
                else
                { // post failed to be added
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Post failed to be added to DB, please try again"
                        },
                        Success = false
                    });
                }
            }

            // model state is invalid
            return BadRequest(new PostResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } //end function

        [Route("~/api/v1/get-all-post-ids")]
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetAllPostsIDs()
        {
            if(ModelState.IsValid)
            {
                List<Post> post_list = await _context.posts.Where(p => p.Type != "Comment").ToListAsync<Post>();
                return Ok(new PostResponse 
                {
                    PostList = post_list, 
                    Success = true
                });
            }
            
            return BadRequest(new PostResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end GetAllPostIDs

        /// HTTP PATCH
        /// This function updates a post.

        [Route("~/api/v1/update-post/{id}")]
        [HttpPatch("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdatePost (string id, 
                [FromBody] JsonPatchDocument<Post> post)
        {
            if(ModelState.IsValid)
            {
                if(id == null)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, no id was sent"
                        },
                        Success = false
                    });
                }
                Guid iid = new Guid(id);
                if(post == null)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, no update was sent"
                        },
                        Success = false
                    });
                }
                
                Post foundPost = await Find.FindPostNoTrack(iid, _context);

                if(foundPost == null)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "That post doesn't exist"
                        },
                        Success = false
                    });
                }
                bool hasTest = false;
                foreach (var item in post.Operations)
                {
                    if(item.op == "test")
                    {
                        hasTest = true;
                    }
                }
                if(!hasTest)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "This document doesn't have a test, therefore we cannot accept it."
                        },
                        Success = false
                    });
                }
                try
                {
                    post.ApplyTo(foundPost);
                }
                catch(Exception e)
                {
                    return Unauthorized(new PostResponse()
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            e.ToString()
                        },
                        Success = false
                    });
                }
                var IsValid = TryValidateModel(foundPost);

                if(!IsValid)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            IsValid.ToString(),
                            ModelState.ToString()
                        },
                        Success = false
                    });
                }

                _context.posts.Update(foundPost);
                await _context.SaveChangesAsync();

                Console.WriteLine("Successful");
                return Ok (new PostResponse
                {
                    Post = foundPost,
                    Success = true
                });
            }
            return BadRequest(new PostResponse
            {
                Errors = new List<string>()
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
        [Route("~/api/v1/add-post-pic/{id}")]
        [HttpPut("{id:long}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddPostPic(long id, 
                                            [FromForm] PictureUpload obj)
        {
            if(ModelState.IsValid)
            {

                string containerName = "images";
                BlobContainerClient container = _client.GetBlobContainerClient(containerName);
                await container.CreateIfNotExistsAsync();

                if(obj == null)
                {
                    return BadRequest(new ProfileResponse()
                    {
                        Errors = new List<string>()
                        {
                            "No object was sent"
                        },
                        Success = false
                    });
                }
                string localPath = "/" + id.ToString() + "/post/" + obj.Picture.FileName;
                BlobClient bClient = container.GetBlobClient(localPath);
                Console.WriteLine("Uploading to Blob storage as blob :\n\t {0} \n", bClient.Uri);
                await bClient.UploadAsync(obj.Picture.OpenReadStream(), true);

                return Ok(new PostResponse()
                {
                    pic = bClient.Uri.ToString(),
                    Success = true
                });
            }
            return BadRequest(new PostResponse()
            {
                Errors = new List<string>()
                {
                    "This model state was invalid"
                },
                Success = false
            }); 
        } // end function

        [Route("~/api/v1/delete-post/{id}")]
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeletePost(string id)
        {
            if(ModelState.IsValid)
            {
                Guid iid = new Guid(id);
                var task = Find.FindPostNoTrack(iid, _context);
                await task;
                if(task.IsCompletedSuccessfully)
                {
                    task.Result.Delete = true;
                    _context.posts.Update(task.Result);
                    await _context.SaveChangesAsync();
                    return Ok(new PostResponse()
                    {
                        Success = true
                    });
                }
                return BadRequest(new PostResponse()
                {
                    Errors = new List<string>()
                    {
                        "Something went wrong",
                        task.Result.ToString()
                    },
                    Success = false
                }); 
            }
            return BadRequest(new PostResponse()
            {
                Errors = new List<string>()
                {
                    "This model state was invalid"
                },
                Success = false
            }); 
        }
    } // end class
    
} // end namespace