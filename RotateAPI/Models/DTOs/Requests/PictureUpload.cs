using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace RotateAPI.Models.DTOs.Requests
{
    public class PictureUpload
    {
        
        [Required]
        public IFormFile Picture {get;set;}
    }
}