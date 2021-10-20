using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class Profile 
    {
        [Key]
        public long UserID {get;set;}
        public string ProfilePic {get;set;}
        public string BannerPic {get;set;}
        public string Pronouns {get;set;}
        public string Bio {get;set;}
        public string Website {get;set;}
        public string Country {get;set;}
    }
}