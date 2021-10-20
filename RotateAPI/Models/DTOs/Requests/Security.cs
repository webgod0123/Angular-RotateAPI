namespace RotateAPI.Models.DTOs.Requests
{
    public class Security
    {
        public bool Private {get;set;}
        public string OldPassword {get;set;}
        public string NewPassword {get;set;}
    }
}