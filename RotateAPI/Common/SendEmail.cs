using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using RotateAPI.Models.DTOs.Email;

namespace RotateAPI.Common
{
    public static class SendEmail
    {
        public static bool Send(Email email)
        {
            MailMessage message = new MailMessage(email.From, email.To);
            message.Subject = email.Subject;
            message.Body = email.Body;
            message.BodyEncoding = System.Text.Encoding.UTF8;
            message.IsBodyHtml = true;
            SmtpClient client = new SmtpClient("smtp.gmail.com", 587); // Gmail
   
            NetworkCredential credential = new NetworkCredential(email.From, email.FromPassword);
            client.Credentials = credential;
            client.UseDefaultCredentials = false;
                client.EnableSsl = true;
            
            try
            {
                client.Send(message);
                return true;
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
            
        }
        public static string GenerateEmailCode(string email)
        {
            return Hashing.HashPassword(email + DateTime.UtcNow, 12);
        } 
    }
}