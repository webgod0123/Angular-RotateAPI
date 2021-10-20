using System.Collections.Generic;
using RotateAPI.Models;

namespace RotateAPI.Configuration
{
    public class UserTopicResult
    {
        public UserTopics Relationship {get;set;}
        public List<long> TopicList {get;set;}
        public List<long> UserList {get;set;}
        public bool Followed {get;set;}
        public bool Success {get; set;}
        public List<string> Errors { get; set; }
    }
}