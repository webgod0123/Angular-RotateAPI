using System;
using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class UserFollowers 
    {
        [Key]
        public Guid RelationshipID {get;set;}
        public long UserID {get;set;}
        public long FollowerID {get;set;}
        public DateTime Timestamp {get;set;}
    }
}