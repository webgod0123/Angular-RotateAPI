using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

using RotateAPI.Common;
using RotateAPI.Models;
using RotateAPI.Data;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using RotateAPI.Models.DTOs.Responses;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using RotateAPI.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using RotateAPI.Models.DTOs.Requests;
using Microsoft.AspNetCore.Http;
using RotateAPI.Models.DTOs.Email;
using Microsoft.Extensions.Configuration;

namespace RotateAPI.Controllers
{
    /// This class creates three functions: Create, Verify,
    /// and GenerateJwtToken. The Create function is used to
    /// register a user. It checks if both the username and
    /// email are unique, then sends the data to the database
    /// and if successful, sends the user a new JWT Token. 
    /// 
    /// Verify is used to check the user through login. First,
    /// it checks to see if the user is valid. If so, the user's
    /// hashed password is grabbed from the db and if its the 
    /// right password, the user is sent a JWT Token which is 
    /// sent to the frontend.
    /// 
    /// GenerateJwtToken is a function that generates a new JWT
    /// Token for a user.
    /// 
    /// TODO : Email verification (is the email a real email)
    /// TODO : Login Cookies (Ask user if its okay to use cookies and if so, save token and login in a cookie)

    [Route ("api/[controller]")] //api/Auth
    [ApiController]
    public class AuthContoller : Controller
    {
        private readonly PerspectiveContext _context;
        private readonly JwtConfig _jwtConfig;
        private IConfiguration _config {get;}
        
        public AuthContoller(PerspectiveContext context,
                    IOptionsMonitor<JwtConfig> optionsMonitor,
                    IConfiguration config)
        {// Gets the Database Context through dependency injection
            _context = context;
            _jwtConfig = optionsMonitor.CurrentValue;
            _config = config;
        }

        // HTTP POST
        // This function takes in a JSON Object with the username,
        // display name, Email, phone number and plaintext password (stored 
        // as Username, Name, Email, Phone Number, and Hash respectively.)
        // These are then checked to see if they are valid. If
        // so, the password is hashsed and they're all stored
        // in the user database. This function makes sure to
        // catch any unexpected errors and sends them back to
        // the front end.
        // 
        // @param user  JSON User Object to add to database
        
        [Route("~/api/v1/register-user")] 
        [HttpPost]
        public async Task<IActionResult> RegisterUser ([FromBody][Bind(include:"Username, PhoneNumber, Email, Hash, Device")]UserLogin user)
        {
            
            try
            {
                if(ModelState.IsValid)
                {// the payload given isn't corrupted or otherwise malicious

                    if(await _context.users.SingleOrDefaultAsync<User>(u => u.Username == user.Username) != null)
                    {// checks if the username exists in the db. if so, returns a bad request
                        return BadRequest(new RegistrationResponse 
                        {
                            Errors = new List<string>() 
                            {
                                "Username already in use"
                            },
                            Success = false
                        });
                    }
                    
                    if(await _context.users.SingleOrDefaultAsync<User>(u => u.Email == user.Email) != null)
                    {// checks if the email exists in the db. if so, returns a bad request
                        return BadRequest(new RegistrationResponse 
                        {
                            Errors = new List<string>() 
                            {
                                "Email already in use"
                            },
                            Success = false
                        });
                    }

                    User new_user = new User()
                    {
                        Username = user.Username,
                        DisplayName = user.Username,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        Hash = Hashing.HashPassword(user.Hash, 12),
                        Timestamp = DateTime.UtcNow,
                        Total = -14
                    };
    
                    // adding user to DB asyncronously 
                    ValueTask<EntityEntry<User>> createUser = _context.users.AddAsync(new_user);
                    await createUser;

                    if (createUser.IsCompletedSuccessfully)
                    {// if user being added was successful
                        await _context.SaveChangesAsync(); // save db changes (must be done after add)
                        
                        var device_to_add = new UserTrustedDevice()
                        {
                            UserID = createUser.Result.Entity.UserID,
                            Device = user.Device
                        };
                        // add code to send verification email and make sure this is a trusted device
                        await _context.user_trusted_devices.AddAsync(device_to_add);
                        await _context.SaveChangesAsync(); // save db changes (must be done after add)

                        // create and return JWT toke
                        return Ok(new RegistrationResponse()
                        {
                            Success = true,
                            Token = null
                        });
                    }
                    else
                    {// user being added failed, return bad request
                        return BadRequest(new RegistrationResponse 
                        {
                            Errors = new List<string>() 
                            {
                                "User failed to be added, try again",
                                createUser.Result.ToString()
                            },
                            Success = false
                        });
                    }
                }
            }
            catch (DataException)
            {// model state was not valid, return bad request
                Console.WriteLine("This Function");
                ModelState.AddModelError("","Unable to save changes. Try again.");
            }
            return BadRequest(new RegistrationResponse 
            {
                Errors = new List<string>() 
                {
                    "Invalid Payload"
                },
                Success = false
            });
        } //end function

        // HTTP POST
        // This function currently takes a JSON Object of the UserID 
        // and the password, and then finds the user in the database
        // If found, it then grabs the hash and checks it against the
        // plaintext password (in this case named Hash) using the 
        // BCrypt functionality.
        // 
        // @param Json user object w/username & password

        [Route("~/api/v1/login-user")]
        [HttpPost]
        public async Task<IActionResult> LoginUser ([FromBody][Bind(include:"Username, Hash, Longitude, Latitude, Device")]UserLogin us)
        {
            if(ModelState.IsValid)
            { // payload is valid and working
                if(us == null)
                { // no user sent
                    return BadRequest(new RegistrationResponse 
                    {
                        Errors = new List<string>() 
                        {
                            "Invalid login request"
                        },
                        Success = false
                    });
                }
                
                // creates a new login attempt
                LoginAttempt attempt_to_add = new LoginAttempt()
                {
                    Username = us.Username,
                    Longitude = us.Longitude,
                    Latitude = us.Latitude,
                    TimestampLogin = DateTime.UtcNow,
                    Device = us.Device
                };

                // finds user with the sent username in the DB
                User user = await _context.users.SingleOrDefaultAsync<User>(u => u.Username.Equals(us.Username));

                if(user == null)
                { // user not found

                    attempt_to_add.Successful = false;
                    await AddAttemptedLogin(attempt_to_add);

                    return BadRequest(new RegistrationResponse 
                    {
                        Errors = new List<string>() 
                        {
                            "This user doesn't exist. Please register first"
                        },
                        Success = false
                    });
                }
                var device = _context.user_trusted_devices.SingleOrDefault(obj => (obj.UserID == user.UserID && obj.Device.Equals(us.Device)));
                if(device == null && us.Device != null)
                {
                    var device_to_add = new UserTrustedDevice()
                    {
                        UserID = user.UserID,
                        Device = us.Device
                    };
                    // add code to send verification email and make sure this is a trusted device
                    await _context.user_trusted_devices.AddAsync(device_to_add);
                    await _context.SaveChangesAsync();
                }
                if(!Hashing.ValidatePassword(us.Hash, user.Hash))
                { // password is wrong

                    attempt_to_add.Successful = false;
                    await AddAttemptedLogin(attempt_to_add);

                    return BadRequest(new RegistrationResponse 
                    {
                        Errors = new List<string>() 
                        {
                            "Password is wrong! Please try again"
                        },
                        Success = false
                    });
                }
                
                attempt_to_add.Successful = true;
                await AddAttemptedLogin(attempt_to_add);
                if(!user.EmailVerified)
                {
                    return Ok (new RegistrationResponse()
                    {
                        Success = true,
                        Token = null
                    });
                }
                // creates and returns new jwt token
                string jwtToken = GenerateJwtToken(user);
                
                return Ok(new RegistrationResponse()
                {
                    Success = true,
                    Token = jwtToken
                });
            }
            
            // sent payload was corrupted or otherwise not valid
            return BadRequest(new RegistrationResponse 
            {
                Errors = new List<string>() 
                {
                    "Invalid payload"
                },
                Success = false
            });
        } // end function

        // This function generates a new JWT Token based on the given user.
        // 
        // @param user to create a JWT Token for

        private string GenerateJwtToken(User user)
        {
            JwtSecurityTokenHandler jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtConfig.Secret);
            
            // scripter is a class that contains claims. claims are information that are defined in JWT to read certain variables that are in it 
            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new [] 
                {
                    new Claim("Id", user.UserID.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // an id that lets us utilize refresh token functionality from JWT
                }),

                Expires = DateTime.UtcNow.AddHours(6), 
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = jwtTokenHandler.WriteToken(token);
            
            return jwtToken;
        } // end function
        public async Task<bool> AddAttemptedLogin(LoginAttempt log)
        {
            var check = _context.login_attempts.AddAsync(log);
            await check;

            if(check.IsCompletedSuccessfully)
            {
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        } // end function
        [Route("~/api/v1/send-email")]
        [HttpPost]
        public async Task<IActionResult> SendEmailAPI(EmailRequest request)
        {
            if(ModelState.IsValid)
            {
                string code =  SendEmail.GenerateEmailCode(request.Email);

                code = code.Replace('/', '3');

                Email email = new Email();
                email.To = request.Email;
                email.From = "contact@perspectiveapplication.com";
                email.Subject = "Verification Email";
                email.Body = request.URL + code;
                email.FromPassword = _config.GetConnectionString("EmailPassword");
                if(SendEmail.Send(email))
                {
                    EmailVerify obj = new EmailVerify();
                    obj.Email = request.Email;
                    obj.Verification = code;
                    obj.Timestamp = DateTime.UtcNow.AddDays(1);
                    await _context.email_table.AddAsync(obj);
                    await _context.SaveChangesAsync();
                    Console.WriteLine("It Sent");
                    return Ok(new RegistrationResponse()
                    {
                        Success = true
                    });
                }
                Console.WriteLine("It didnt Sent");
                return BadRequest(new RegistrationResponse()
                {
                    Errors = new List<string>()
                    {
                        "This email didn't send"
                    },
                    Success = true
                });
            }
            return BadRequest(new RegistrationResponse 
            {
                Errors = new List<string>() 
                {
                    "Invalid payload"
                },
                Success = false
            });
        }
        [Route("~/api/v1/verify-email/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> VerifyEmail(string id)
        {
            if(ModelState.IsValid)
            {
                Console.Write("Made it");
                var task =_context.email_table.SingleOrDefaultAsync(obj => obj.Verification == id);
                await task;
                if(task.IsCompletedSuccessfully)
                {
                    Console.Write("Made it 2");
                    if(task.Result.Equals(null))
                    {
                        return BadRequest(new RegistrationResponse()
                        {
                            Success = false,
                            Errors = new List<string>()
                            {
                                "Something went wrong",
                                task.Result.ToString()
                            }
                        });
                    }
                    if(task.Result.Timestamp > DateTime.UtcNow)
                    {
                        Console.Write("Made it 3");
                        User user = await _context.users.AsNoTracking().SingleOrDefaultAsync(u => u.Email == task.Result.Email);
                        user.EmailVerified = true;

                        _context.users.Update(user);
                        _context.email_table.Remove(task.Result);
                        await _context.SaveChangesAsync();

                        string token = GenerateJwtToken(user);
                        return Ok(new RegistrationResponse()
                        {
                            Token = token,
                            Success = true
                        });
        
                    }
                }
                return BadRequest(new RegistrationResponse()
                {
                    Errors = new List<string>()
                    {
                        "This email didn't send"
                    },
                    Success = true
                });
            }
            return BadRequest(new RegistrationResponse 
            {
                Errors = new List<string>() 
                {
                    "Invalid payload"
                },
                Success = false
            });
        }
    } // end class

} // end namespaceW