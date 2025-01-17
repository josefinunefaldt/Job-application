using Microsoft.AspNetCore.Mvc;
using JobApi.Models;
using JobApi.Data;
using Microsoft.EntityFrameworkCore;

namespace JobApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserRequest userRequest)
        {
            if (userRequest == null || string.IsNullOrEmpty(userRequest.Name))
            {
                return BadRequest("Invalid input.");
            }

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Name == userRequest.Name);

            if (existingUser != null)
            {
                return Conflict("A user with this name already exists.");
            }
            var user = new User
            {
                Name = userRequest.Name
            };
            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserByName), new { name = user.Name }, new { userId = user.Id, name = user.Name });
        }


        [HttpGet("{name}")]
        public async Task<ActionResult<User>> GetUserByName(string name)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Name == name);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return user;
        }
    }
}
