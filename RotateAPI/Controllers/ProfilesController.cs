using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using RotateAPI.Data;
using Microsoft.AspNetCore.WebUtilities;
using System.IO;
using RotateAPI.Models;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using RotateAPI.Models.DTOs.Responses;
using Microsoft.AspNetCore.Http;
using RotateAPI.Models.DTOs.Requests;
using RotateAPI.Common;
using Microsoft.AspNetCore.JsonPatch;

namespace RotateAPI.Controllers
{
    [Route ("api/[controller]")] //api/Auth
    [ApiController]
    public class ProfilesController : Controller
    {
        private readonly PerspectiveContext _context;
        private readonly BlobServiceClient _client;
        public ProfilesController(PerspectiveContext context, 
                                  BlobServiceClient client)
        {
            _context = context;
            _client = client;
        }
        
        [Route("~/api/v1/add-pfp/{id}")]
        [HttpPut("{id:long}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddProfilePicture(long id, 
                                            [FromForm] PictureUpload obj)
        {
            if(ModelState.IsValid)
            {

                string containerName = "images";
                BlobContainerClient container = _client.GetBlobContainerClient(containerName);
                await container.CreateIfNotExistsAsync();

                if(obj == null)
                {
                    return BadRequest(new ProfileResponse()
                    {
                        Errors = new List<string>()
                        {
                            "No object was sent"
                        },
                        Success = false
                    });
                }
                string localPath = "/" + id.ToString() + "/pfp/" + obj.Picture.FileName;
                BlobClient bClient = container.GetBlobClient(localPath);
                Console.WriteLine("Uploading to Blob storage as blob :\n\t {0} \n", bClient.Uri);
                await bClient.UploadAsync(obj.Picture.OpenReadStream(), true);

                Profile current = await Find.FindProfileNoTrack(id, _context);
                Profile updated = new Profile()
                {
                    UserID = id,
                    ProfilePic = bClient.Uri.ToString(),
                    BannerPic = current.BannerPic,
                    Bio = current.Bio,
                    Website = current.Website,
                    Country = current.Country,
                    Pronouns = current.Pronouns
                };
                
                _context.profiles.Update(updated);
                await _context.SaveChangesAsync();
                return Ok(new ProfileResponse()
                {
                    profile = updated,
                    Success = true
                });
            }
            return BadRequest(new ProfileResponse()
            {
                Errors = new List<string>()
                {
                    "This model state was invalid"
                },
                Success = false
            });
        }
        [Route("~/api/v1/add-banner/{id}")]
        [HttpPut("{id:long}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddBanner(long id, 
                                            [FromForm] PictureUpload obj)
        {
            if(ModelState.IsValid)
            {
                string containerName = "images";
                BlobContainerClient container = _client.GetBlobContainerClient(containerName);
                await container.CreateIfNotExistsAsync();

                if(obj == null)
                {
                    return BadRequest(new ProfileResponse()
                    {
                        Errors = new List<string>()
                        {
                            "No object was sent"
                        },
                        Success = false
                    });
                }
                string localPath = "/" + id.ToString() + "/banner/" + obj.Picture.FileName;
                BlobClient bClient = container.GetBlobClient(localPath);
                Console.WriteLine("Uploading to Blob storage as blob :\n\t {0} \n", bClient.Uri);
                await bClient.UploadAsync(obj.Picture.OpenReadStream(), true);

                Profile current = await Find.FindProfileNoTrack(id, _context);
                Profile updated = new Profile()
                {
                    UserID = id,
                    ProfilePic = current.ProfilePic,
                    BannerPic = bClient.Uri.ToString(),
                    Bio = current.Bio,
                    Website = current.Website,
                    Country = current.Country,
                    Pronouns = current.Pronouns
                };
                
                _context.profiles.Update(updated);
                await _context.SaveChangesAsync();
                return Ok(new ProfileResponse()
                {
                    profile = updated,
                    Success = true
                });
            }
            return BadRequest(new ProfileResponse()
            {
                Errors = new List<string>()
                {
                    "This model state was invalid"
                },
                Success = false
            });
        }
        [Route("~/api/v1/new-profile")]
        [HttpPost]
        public async Task<IActionResult> NewProfile(Profile prof)
        {
            if(ModelState.IsValid)
            {
                if(await _context.profiles.FindAsync(prof.UserID) != null)
                {
                    return Ok(new ProfileResponse()
                    {
                        Errors = new List<string>()
                        {
                            "This user already has a profile!"
                        },
                        Success = true
                    });
                }
                
                await _context.profiles.AddAsync(prof);
                await _context.SaveChangesAsync();

                return Ok(new ProfileResponse()
                {
                    profile = prof,
                    Success = true
                });

            }
            return BadRequest(new ProfileResponse()
            {
                Errors = new List<string>()
                {
                    "This payload is invalid."
                },
                Success = false
            });
        }
        [Route("~/api/v1/get-profile/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetPfp(long? id)
        {
            if(ModelState.IsValid)
            {
                
                Profile prof = await _context.profiles.FindAsync(id);
             
                if(prof == null)
                {
                    return BadRequest(new ProfileResponse()
                    {
                        Errors = new List<string>()
                        {
                            "This user doesn't have a valid profile"
                        },
                        Success = false
                    });
                }
                return Ok(new ProfileResponse()
                {
                    profile = prof,
                    Success = true
                });
            }
            return BadRequest(new ProfileResponse()
            {
                Errors = new List<string>()
                {
                    "This payload is invalid."
                },
                Success = false
            });
        } // end function

        [Route("~/api/v1/update-profile/{id}")]
        [HttpPatch("{id:long}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateProfile(long id, 
                        [FromBody] JsonPatchDocument profile)
        {
            if(ModelState.IsValid)
            {
                Profile found_prof = await Find.FindProfileNoTrack(id, _context);
                if(found_prof == null)
                {
                    return BadRequest(new ProfileResponse()
                    {
                        Errors = new List<string>()
                        {
                            "This profile doesn't exist."
                        },
                        Success = false
                    });
                }
                foreach(var t in profile.Operations)
                {
                    if(t.op == "test")
                    {
                        break;
                    }
                    return Unauthorized(new ProfileResponse()
                    {
                        Errors = new List<string>()
                        {
                            "This patch document doesn't contain a test and therefore breaks"
                        },
                        Success = false
                    });
                }

                try
                {
                    profile.ApplyTo(found_prof);
                }
                catch (Exception e)
                {
                    return BadRequest(new ProfileResponse()
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            e.Message
                        },
                        Success = false
                    });
                }

                _context.profiles.Update(found_prof);
                await _context.SaveChangesAsync();
                
                return Ok(new ProfileResponse()
                {
                    profile = found_prof,
                    Success = true
                });
            }
            return BadRequest(new ProfileResponse()
            {
                Errors = new List<string>()
                {
                    "This payload is invalid."
                },
                Success = false
            });
        }
    } // end class

} // end namespace