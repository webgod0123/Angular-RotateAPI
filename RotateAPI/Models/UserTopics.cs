using System;
using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class UserTopics
    {
        [Key]
        public long UserTopicID {get;set;} // UserTopicID bigint primary key
        public long UserID {get;set;} // UserID bigint foreign key
        public long FollowedTopicID {get;set;} // FollowedTopicID bigint foreign key
        public DateTime Timestamp {get;set;} //Timestamp datetime 
    }
}