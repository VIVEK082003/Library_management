using LibraryManagementAPI.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Lms.Services.Repository
{
    public class UserService : IUserService
    {
        private readonly LmsContext dbContext;
        private readonly string secretKey;

        public UserService(LmsContext dbContext, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            secretKey = configuration["Jwt:Key"];
        }

        public LoginResponseDTO Authenticate(string email, string password)
        {
            var user = UserAuthenticate(email, password);
            if (user == null)
            {
                return null;
            }

            var tokenString = GenerateJwtToken(user);

            return new LoginResponseDTO
            {
                Token = tokenString,
                User = user
            };
        }

        private UserDTO UserAuthenticate(string email, string password)
        {
            var user = dbContext.Users.FirstOrDefault(x => x.Email == email && x.Password == password);
            if (user == null) return null;

            return new UserDTO
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                IsAdmin = user.IsAdmin
            };
        }
        public UserDTO UpdateUser(int userId, UserDTO updatedUser)
        {
            var user = dbContext.Users.FirstOrDefault(u => u.UserId == userId);

            if (user == null)
            {
                return null; // Or throw an exception or handle accordingly
            }

            // Update user properties
            user.UserName = updatedUser.UserName;
            user.Email = updatedUser.Email;
            user.Password = updatedUser.Password;
            user.IsAdmin = updatedUser.IsAdmin;

            dbContext.SaveChanges();

            return new UserDTO
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                IsAdmin = user.IsAdmin
            };
        }
        public string GenerateJwtToken(UserDTO user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UserId.ToString()),
                    new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")
                }),
                Expires = DateTime.UtcNow.AddSeconds(7), // Use a more reasonable expiration time in production
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public IEnumerable<UserDTO> GetAllUsers()
        {
            return dbContext.Users.Select(user => new UserDTO
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                Password = user.Password,
                IsAdmin = user.IsAdmin
            }).ToList();
        }

        public UserDTO AddUser(UserDTO newUser)
        {
            var user = new User
            {
                UserName = newUser.UserName,
                Email = newUser.Email,
                Password = newUser.Password,
                IsAdmin = newUser.IsAdmin
            };

            dbContext.Users.Add(user);
            dbContext.SaveChanges();

            return new UserDTO
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                IsAdmin = user.IsAdmin
            };
        }

        // New method to delete a user
        public bool DeleteUser(int userId)
        {
            var user = dbContext.Users.FirstOrDefault(x => x.UserId == userId);
            if (user == null)
            {
                return false;
            }

            dbContext.Users.Remove(user);
            dbContext.SaveChanges();
            return true;
        }
    }
}
