using System;
using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class Interaction
    {
        [Key]
        public Guid InteractionID {get;set;}
        public long UserID {get;set;}
        public Guid PostID {get;set;}
        public int Type {get;set;}
    }
}