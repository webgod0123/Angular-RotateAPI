using System.Collections.Generic;
using RotateAPI.Models;

namespace RotateAPI.Configuration
{
    public class InteractionResult
    {
        public Interaction Interaction {get;set;}
        public List<Interaction> Interactions {get;set;}
        public long Count {get;set;}
        public List<string> Errors {get;set;}
        public bool Success {get;set;}
    }
}