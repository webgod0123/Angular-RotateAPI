
//using calls
using Microsoft.AspNetCore.Mvc;
using RotateAPI.Models;
using RotateAPI.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using RotateAPI.Models.DTOs.Responses;
using System.Collections.Generic;
using Microsoft.AspNetCore.JsonPatch;
using RotateAPI.Common;
using RotateAPI.Models.DTOs.Requests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Linq;
using System;

namespace RotateAPI.Controllers
{
    
    /// This is a skeleton controller currently
    /// that will be set up to grab users, update
    /// their information, and other such variations
    /// once a JWT token is given to the user.
    /// 
    /// TODO : Set up controller to use http commands
    /// TODO : Set up cookies for user settings (if user has said its okay to use cookies)

    [Route ("api/[controller]")] //api/Users
    [ApiController]
    public class UsersController : Controller
    {
        private readonly PerspectiveContext _context;

        public UsersController(PerspectiveContext context)
        { // Gets the Database Context through dependency injection
            _context = context;
        }
        

        /// HTTP GET
        /// This function gets a user based on their ID. This id is sent
        /// through the url and sent back as a JSON object, not including
        /// the hash, which is wiped as null before being sent back, just
        /// to be safe.
        /// 
        /// ?Should we also wipe other (potentially) sensitive info, like the user's email
        /// ?and phone number, or just have the recieving angular model only 
        /// ?grab what it needs (userid, username and display name)

        [Route ("~/api/v1/get-user/{id}")]
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetUser(long? id)
        {
            if(ModelState.IsValid)
            { // checks if payload is valid
                if(id == null)
                { // the url has entered an invalid or no id
                    return BadRequest(new UserResponse 
                    {
                        Errors = new List<string>() 
                        {
                            "Invalid Payload, no ID"
                        },
                        Success = false
                    });
                }

                User user = await _context.users.FindAsync(id); // find user in DB

                if(user == null)
                { // user not found
                    return BadRequest(new UserResponse
                    {
                        Errors = new List<string>() 
                        {
                            "User not found"
                        },
                        Success = false
                    });
                }

                user.Hash = null;

                return Ok (new UserResponse
                { // return user as JSON object
                    User = user,
                    Success = true
                });
            }
            return BadRequest(new UserResponse
            { // entered payload is invalid
                Errors = new List<string>() 
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function

        [Route ("~/api/v1/get-user-username/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserUsername(string id)
        {
            if(ModelState.IsValid)
            { // checks if payload is valid
                if(id == null)
                { // the url has entered an invalid or no id
                    return BadRequest(new UserResponse 
                    {
                        Errors = new List<string>() 
                        {
                            "Invalid Payload, no ID"
                        },
                        Success = false
                    });
                }

                User user = await _context.users.SingleOrDefaultAsync<User>(u => u.Username == id); // find user in DB

                if(user == null)
                { // user not found
                    return BadRequest(new UserResponse
                    {
                        Errors = new List<string>() 
                        {
                            "User not found"
                        },
                        Success = false
                    });
                }

                user.Hash = null;

                return Ok (new UserResponse
                { // return user as JSON object
                    User = user,
                    Success = true
                });
            }
            return BadRequest(new UserResponse
            { // entered payload is invalid
                Errors = new List<string>() 
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
        /// HTTP PATCH
        /// This function updates the user

        [Route("~/api/v1/update-user/{id}")]
        [HttpPatch("{id:long}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateUser(long id, 
                [FromBody] JsonPatchDocument user)
        {
            if(ModelState.IsValid)
            {
                User foundUser = await Find.FindUserNoTrack(id, _context);
                if(foundUser == null)
                {

                    return BadRequest(new UserResponse
                    {
                        Errors = new List<string>() 
                        {
                            "This user doesn't exist"
                        },
                        Success = false
                    });
                }
                foreach(var t in user.Operations)
                {
                    if(t.op == "test")
                    {
                        break;
                    }
                    return Unauthorized(new UserResponse()
                    {
                        Errors = new List<string>()
                        {
                            "This patch document doesn't contain a test and therefore breaks"
                        },
                        Success = false
                    });
                }

                string prevUserName = foundUser.Username;
                string prevEmail = foundUser.Email;
                try
                {
                    user.ApplyTo(foundUser);
                }
                catch(Exception e)
                {
                    return BadRequest(new UserResponse()
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            e.Message
                        },
                        Success = false
                    });
                }
                var IsValid = TryValidateModel(foundUser);
                if(!IsValid)
                {
                    return BadRequest(new UserResponse
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            IsValid.ToString(),
                            ModelState.ToString()
                        },
                        Success = false
                    });
                }

                if(await _context.users.AsNoTracking().SingleOrDefaultAsync(u => u.Username == foundUser.Username) != null
                    && prevUserName != foundUser.Username)
                {
                    return BadRequest(new UserResponse
                    {
                        Errors = new List<string>()
                        {
                            "This username already exists in the database"
                        },
                        Success = false
                    });
                }
                if(await _context.users.AsNoTracking().SingleOrDefaultAsync(u => u.Email == foundUser.Email) != null
                    && prevEmail != foundUser.Email)
                {
                    return BadRequest(new UserResponse
                    {
                        Errors = new List<string>()
                        {
                            "This email already exists in the database"
                        },
                        Success = false
                    });
                }
                _context.users.Update(foundUser);
                var task = _context.SaveChangesAsync();
                await task;

                if(task.IsCompletedSuccessfully)
                {
                    return Ok (new UserResponse
                    {
                        User = foundUser,
                        Success = true
                    });
                }
                else
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "Something went wrong",
                            task.Result.ToString(),
                            ModelState.ToString()
                        },
                        Success = false
                    });
                }
                
                
            }
            return BadRequest(new UserResponse
            { // entered payload is invalid
                Errors = new List<string>() 
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
        
        /// HTTP PATCH
        /// This is a function to update a user's password

        [Route("~/api/v1/update-user-password/{id}")]
        [HttpPatch("{id:long}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateUserPassword(long id, [FromBody] Security dto)
        {
            if(ModelState.IsValid)
            {
                User user = await Find.FindUserNoTrack(id, _context);
                if(user == null)
                {
                    return BadRequest(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "This user doesn't exist"
                        },
                        Success = false
                    });
                }
                user.Private = dto.Private;
                if(!Hashing.ValidatePassword(dto.OldPassword, user.Hash))
                {
                    return Unauthorized(new PostResponse
                    {
                        Errors = new List<string>()
                        {
                            "The old password entered was wrong"
                        },
                        Success = false
                    });
                }

                if(dto.NewPassword != null)
                {
                    user.Hash = Hashing.HashPassword(dto.NewPassword, 12);
                }
                _context.Update(user);

                await _context.SaveChangesAsync();
                return Ok (new UserResponse
                {
                    User = user,
                    Success = true
                });
            }
            return BadRequest(new UserResponse
            { // entered payload is invalid
                Errors = new List<string>() 
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function

        [Route("~/api/v1/block-user")]
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> BlockUser([FromBody][Bind(include:"UserID, BlockedID")] Blocked obj)
        {
            if(ModelState.IsValid)
            {
                ValueTask<EntityEntry<Blocked>> task = _context.blocked.AddAsync(obj);
                await task;

                if(task.IsCompletedSuccessfully)
                {
                    return Ok(new BlockedResponse()
                    {
                        Blocked = "This user was successfully blocked",
                        Success = true
                    });
                }
                return BadRequest(new BlockedResponse()
                {
                    Errors = new List<string>()
                    {
                        "Something went wrong",
                        task.Result.ToString()
                    }
                });
            }
            return BadRequest(new BlockedResponse
            { // entered payload is invalid
                Errors = new List<string>() 
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function

        [Route("~/api/v1/get-all-blocked-users/{id}")]
        [HttpGet("{id:long}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetAllBlockedUsers (long id)
        {
            if(ModelState.IsValid)
            {
                List<Blocked> blocked_users = await _context.blocked.Where(obj => obj.UserID == id).ToListAsync<Blocked>();
                List<Blocked> blocked_users2 = await _context.blocked.Where(obj => obj.BlockedUserID == id).ToListAsync<Blocked>();
                List<User> return_list = new List<User>();

                foreach(Blocked obj in blocked_users)
                {
                    User user = await _context.users.FindAsync(obj);
                    user.Hash = null;
                    user.Email = null;
                    user.PhoneNumber = null;
                    return_list.Add(user);
                }
                foreach(Blocked obj in blocked_users2)
                {
                    User user = await _context.users.FindAsync(obj);
                    user.Hash = null;
                    user.Email = null;
                    user.PhoneNumber = null;
                    return_list.Add(user);
                }
                return Ok(new BlockedResponse()
                {
                    BlockedUsers = return_list,
                    Success = true
                });
            }
            return BadRequest(new BlockedResponse
            { // entered payload is invalid
                Errors = new List<string>() 
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
        [Route("~/api/v1/get-personal-blocked-users/{id}")]
        [HttpGet("{id:long}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetPersonalBlockedUsers (long id)
        {
            if(ModelState.IsValid)
            {
                List<Blocked> blocked_users = await _context.blocked.Where(obj => obj.UserID == id).ToListAsync<Blocked>();
                List<User> return_list = new List<User>();

                foreach(Blocked obj in blocked_users)
                {
                    User user = await _context.users.FindAsync(obj);
                    user.Hash = null;
                    user.Email = null;
                    user.PhoneNumber = null;
                    return_list.Add(user);
                }
                return Ok(new BlockedResponse()
                {
                    BlockedUsers = return_list,
                    Success = true
                });
            }
            return BadRequest(new BlockedResponse
            { // entered payload is invalid
                Errors = new List<string>() 
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } // end function
        [Route("~/api/v1/get-all-users")]
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetAllUsers()
        {
            if(ModelState.IsValid)
            {
                List<User> users = await _context.users.ToListAsync();
                foreach(User u in users)
                {
                    u.Hash = null;
                    u.PhoneNumber = null;
                    u.Email = null;
                }
                return Ok(new UserResponse()
                {
                    Users = users,
                    Success = true    
                });
            } 
            return BadRequest(new UserResponse
            { // entered payload is invalid
                Errors = new List<string>() 
                {
                    "Invalid Payload"
                },
                Success = false
            });
        }
    } // end class
    
} // end namespace