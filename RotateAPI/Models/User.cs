
using System;
using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    /// This is a user model. It defines
    /// a simple user that only has a 
    /// userID and a password. This is
    /// used for sending to the database
    /// and being created by the front-end

    public class User
    {
        [Key]
        public long UserID{get;set;} // UserID bigint primary key
        public string Username {get;set;} // Username nvarchar(70)
        public string DisplayName {get;set;} // DisplayName nvarchar(70)
        public string PhoneNumber {get;set;} // PhoneNumber nchar(11) null
        public string Email {get;set;} // Email nvarchar(255)
        public string Hash {get;set;} // Hash nvarchar(255)
        public int AuthorizationLevel {get;set;}
        public DateTime Timestamp{get;set;} // Timestamp datetime
        public bool Private {get;set;}
        public bool EmailVerified {get;set;}
        public int? Total {get;set;}
    }
    
}