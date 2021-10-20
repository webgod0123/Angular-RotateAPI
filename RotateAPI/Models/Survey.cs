using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class Survey 
    {
        [Key]
        public long UserID {get;set;}
        public int ClimateChange {get;set;}
        public int BorderControl {get;set;}
        public int MilitaryViolence {get;set;}
        public int Infrastructure {get;set;}
        public int Abortion {get;set;}
        public int Total {get;set;}
    }
}