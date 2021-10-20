using System;
using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class EmailVerify
    {
        [Key]
        public long EmailID {get;set;}
        public string Email {get;set;}
        public string Verification {get;set;}
        public DateTime Timestamp {get;set;}
    }
}