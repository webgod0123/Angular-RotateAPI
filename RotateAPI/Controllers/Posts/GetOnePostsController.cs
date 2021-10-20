using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RotateAPI.Models;
using RotateAPI.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;

namespace RotateAPI.Controllers
{
    public partial class PostsController
    {
        [Route("~/api/v1/get-comments/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetComments(string id)
        {
            if(ModelState.IsValid)
            {
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
                Guid iid = new Guid(id);
                List<Post> post_list = await _context.posts.Where(p => p.ParentPostID == iid && p.Type == "Comment").ToListAsync<Post>();
                if(post_list.Count == 0)
                {
                    return Ok(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "There are no comments on that post"
                        },
                        Success = false
                    });
                }
                return Ok(new PostResponse()
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

        // HTTP GET
        // This function gets a post based on the GUID
        // of said post.
        // 
        // @param id = id of the post
        
        [Route("~/api/v1/get-post/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost (string id)
        {
            if(ModelState.IsValid)
            { // model state is valid
                if(id == null)
                { // there is no ID sent
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Invalid Payload, no ID"
                        },
                        Success = true
                    });
                }
                Guid iid = new Guid(id);
                Post post = await _context.posts.FindAsync(iid); // finding the post in the DB

                if(post == null)
                { // post doesn't exist
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Post wasn't found"
                        },
                        Success = false
                    });
                }

                // return post
                return Ok(new PostResponse
                {
                    Post = post,
                    Success = true
                });
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
        } // end function
    }
}