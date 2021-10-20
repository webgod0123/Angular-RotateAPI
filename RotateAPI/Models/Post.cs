using System;
using System.ComponentModel.DataAnnotations;

namespace RotateAPI.Models
{
    public class Post
    {
        [Key]
        public Guid PostID {get;set;} // PostID uniqueidentifier primary key
        public long UserID {get;set;} // UserID bigint foreign key
        public string Type {get;set;} // Type nvarchar(11)
        public long? TopicID {get;set;} // TopicID bigint foreign key null
        public string Tone {get;set;} // Tone nvarchar(50) null
        public string Title {get;set;} // Title nvarchar(255) null
        public Guid? ParentPostID {get;set;} // ParentPostID uniqueidentifier foreign key recursive null
        public Guid? AlphaPostID {get;set;} // AlphaPostID uniqueidentifier foreign key recursive null
        public string Body {get;set;} // Body ntext null
        public DateTime Timestamp {get;set;} // Timestamp datetime
        public bool Reviewed {get;set;}
        public string BannerImage {get;set;}
        public bool? Privated  {get;set;}
        public bool Edited {get;set;}
        public bool Delete {get;set;}
    }
}