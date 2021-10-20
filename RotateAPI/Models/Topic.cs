using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class Topic
    {
        [Key]
        public long TopicID {get;set;} // TopicID bigint primary key
        public string TopicName {get;set;} // TopicName nvarchar(50)
    }
}