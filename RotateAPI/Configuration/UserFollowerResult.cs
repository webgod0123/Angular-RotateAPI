using System.Collections.Generic;
using RotateAPI.Models;

namespace RotateAPI.Configuration
{
    public class UserFollowerResult 
    {
        public UserFollowers UserFollower {get;set;}
        public List<long> UserList {get;set;}
        public long Count {get;set;}
        public bool Followed {get;set;}
        public bool Success {get; set;}
        public List<string> Errors { get; set; }
    }
}