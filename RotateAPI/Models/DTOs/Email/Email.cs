using System.Net.Mail;

namespace RotateAPI.Models.DTOs.Email
{
    public class Email
    {
        public string To {get;set;}
        public string From {get;set;}
        public string Subject {get;set;}
        public string Body {get;set;}
        public string FromPassword {get;set;}
    }
}