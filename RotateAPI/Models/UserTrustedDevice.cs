using System;
using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class UserTrustedDevice
    {
        [Key]
        public long DeviceID {get;set;}
        public long UserID  {get;set;}
        public string Device {get;set;}
    }
}