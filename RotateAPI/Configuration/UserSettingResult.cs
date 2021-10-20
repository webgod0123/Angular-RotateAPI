using System.Collections.Generic;
using RotateAPI.Models;

namespace RotateAPI.Configuration
{
    public class UserSettingResult 
    {
        public UserSetting Settings;
        public List<string> Errors;
        public bool Success;
    }
}