using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class UserSetting
    {
        [Key]
        public long UserID {get;set;}
        public bool UserMentions {get;set;}
        public bool NewFollowers {get;set;}
        public bool NewLikes {get;set;}
        public bool NewComments {get;set;}
        public bool CommentReplies {get;set;}
        public bool PrivateConvoRequests {get;set;}
        public bool NewAwards {get;set;}
        public bool HideBipartisan {get;set;}
        public bool Premium {get;set;}
        public int DMSettings {get;set;}
    }
}