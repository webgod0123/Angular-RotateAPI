using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RotateAPI.Models;

namespace RotateAPI.Configuration
{
    public class PostResult
    {
        public Post Post {get;set;}
        public List<Post> PostList {get;set;}
        public string pic { get;set; }
        public bool Success {get; set;}
        public List<string> Errors { get; set; }
    }
}