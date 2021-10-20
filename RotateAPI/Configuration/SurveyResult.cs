using System.Collections.Generic;
using RotateAPI.Models;

namespace RotateAPI.Configuration
{
    public class SurveyResult
    {
        public Survey Survey;
        public List<string> Errors {get;set;}
        public bool Success {get;set;}
    }
}