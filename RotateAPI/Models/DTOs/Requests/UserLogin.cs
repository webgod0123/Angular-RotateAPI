using System;

namespace RotateAPI.Models.DTOs.Requests
{
    public class UserLogin : User
    {
        public float Longitude {get;set;}
        public float Latitude {get;set;}
        public DateTime TimestampLogin {get;set;}
        public string Device {get;set;}
    }
}