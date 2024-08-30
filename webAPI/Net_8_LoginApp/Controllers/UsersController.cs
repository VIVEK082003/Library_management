using LibraryManagementAPI.Models;
using Lms.Services.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LibraryManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly ILogger<UsersController> logger;
      //  private readonly IGenreService genreService;


        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            this.userService = userService;
            this.logger = logger;
           // this.genreService = genreService;
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login([FromBody] LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var isAuthenticated = userService.Authenticate(loginDTO.Email, loginDTO.Password);
                if (isAuthenticated == null)
                {
                    return BadRequest("Invalid credentials");
                }
                else
                {
                    return Ok(isAuthenticated);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred during login");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet]
        [Route("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = userService.GetAllUsers();
                if (users == null || !users.Any())
                {
                    return NotFound("No users found");
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while fetching users");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Route("AddUser")]
        public IActionResult AddUser([FromBody] UserDTO newUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = userService.AddUser(newUser);
                return CreatedAtAction(nameof(AddUser), new { id = user.UserId }, user);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while adding user");
                return StatusCode(500, "Internal server error");
            }
        }

        // New endpoint to delete a user
        [HttpDelete]
        [Route("DeleteUser/{userId}")]
        public IActionResult DeleteUser(int userId)
        {
            try
            {
                var isDeleted = userService.DeleteUser(userId);
                if (!isDeleted)
                {
                    return NotFound($"User with ID {userId} not found");
                }

                return Ok($"User with ID {userId} has been deleted");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while deleting user");
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPut]
        [Route ("EditUser/{userId}")]
        public IActionResult UpdateUser(int userId, [FromBody] UserDTO updatedUser)
        {
            var result = userService.UpdateUser(userId, updatedUser);

            if (result == null)
            {
                return NotFound(); // Or handle accordingly
            }

            return Ok(result);
        }
    }
}


   