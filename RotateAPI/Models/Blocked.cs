using System;
using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class Blocked
    {
        [Key]
        public Guid BlockedID {get;set;}
        public long UserID {get;set;}
        public long BlockedUserID {get;set;}
    }
}