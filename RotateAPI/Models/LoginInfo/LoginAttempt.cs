using System;
using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class LoginAttempt
    {
        [Key]
        public Guid LoginID {get;set;}
        public string Username {get;set;}
        public DateTime TimestampLogin {get;set;}
        public float Latitude {get;set;}
        public float Longitude {get;set;}
        public bool Successful {get;set;}
        public string Device {get;set;}
    }
}