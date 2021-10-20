using BCrypt.Net;

namespace RotateAPI.Common
{
    public class Hashing
    {
        public static string GenerateSalt(int cost)
        {
            return BCrypt.Net.BCrypt.GenerateSalt(cost);
        }
        public static string HashPassword(string pass, int cost)
        {
            return BCrypt.Net.BCrypt.HashPassword(pass, Hashing.GenerateSalt(cost));
        }
        public static bool ValidatePassword(string pass, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(pass, hash);
        }
    }
}