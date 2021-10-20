using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using RotateAPI.Models;

namespace RotateAPI.Configuration
{
    public class ProfileResult
    {
        public Profile profile;
        public bool Success {get; set;}
        public List<string> Errors { get; set; }
    }
}