using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RotateAPI.Data;
using RotateAPI.Models;

namespace RotateAPI.Common
{
    public static class Find 
    {
        public static async Task<User> FindUserNoTrack(long id, PerspectiveContext _con)
        {
            return await _con.users.AsNoTracking().SingleOrDefaultAsync(u => u.UserID == id);
        }
        public static async Task<Post> FindPostNoTrack(Guid id, PerspectiveContext _con)
        {
            return await _con.posts.AsNoTracking().SingleOrDefaultAsync(p => p.PostID == id);
        }
        public static async Task<Topic> FindTopicNoTrack(long id, PerspectiveContext _con)
        {
            return await _con.topics.AsNoTracking().SingleOrDefaultAsync(t => t.TopicID == id);
        }
        public static async Task<Profile> FindProfileNoTrack(long id, PerspectiveContext _con)
        {
            return await _con.profiles.AsNoTracking().SingleOrDefaultAsync(p => p.UserID == id);
        }
        public static async Task<UserSetting> FindSettingNoTrack(long id, PerspectiveContext _con)
        {
            return await _con.user_settings.AsNoTracking().SingleOrDefaultAsync(s => s.UserID == id);
        }
    }
}