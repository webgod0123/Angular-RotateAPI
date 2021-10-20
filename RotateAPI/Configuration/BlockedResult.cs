using System.Collections.Generic;
using RotateAPI.Models;

namespace RotateAPI.Configuration
{
    public class BlockedResult
    {
        public string Blocked {get;set;}
        public List<User> BlockedUsers {get;set;}
        public bool Success {get;set;}
        public List<string> Errors {get;set;}
    }
}