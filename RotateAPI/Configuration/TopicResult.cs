using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RotateAPI.Models;

namespace RotateAPI.Configuration
{
    public class TopicResult
    {
        public Topic Topic {get;set;}
        public List<Topic> Topics {get;set;}
        public bool Success {get; set;}
        public List<string> Errors { get; set; }
    }
}