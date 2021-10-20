using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RotateAPI.Models;

namespace RotateAPI.Configuration 
{
    public class UserResult
    {
        public User User {get;set;}
        public List<User> Users {get;set;}
        public bool Success {get; set;}
        public List<string> Errors { get; set; }
    }
}