using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobApi.Data;
using JobApi.Models;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<ActionResult<User>> CreateUser([FromBody] string name)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Name == name);
            if (existingUser != null)
            {
                return Conflict("A user with this name already exists.");
            }

            var user = new User
            {
                Name = name
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserByName), new { name = user.Name }, user);
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<User>> GetUserByName(string name)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Name == name);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}