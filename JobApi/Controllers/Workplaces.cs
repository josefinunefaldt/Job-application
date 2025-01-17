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
    public class WorkplacesController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkplaceResponse>>> GetWorkplaces([FromQuery] string name)
        {
            // Find the user based on the name provided
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Name == name);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Retrieve workplaces associated with the found user
            var workplaces = await _context.Workplaces
                .Where(workplace => workplace.UserId == user.Id) // Filter by the user's ID
                .ToListAsync();

            // Map the workplaces to WorkplaceResponse
            var response = workplaces.Select(workplace => new WorkplaceResponse
            {
                Location = workplace.Location,
                Deadline = workplace.Deadline,
                Email = workplace.Email,
                ContactPerson = workplace.ContactPerson,
                Notification = workplace.Notification,
                Position = workplace.Position,
                Id = workplace.Id
            }).ToList();

            return Ok(response);
        }


        [HttpPost]
        public async Task<ActionResult<WorkplaceResponse>> CreateWorkplace([FromBody] WorkplaceRequest workplaceRequest, [FromQuery] string name)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Name == name);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var workplace = new Workplace
            {
                Location = workplaceRequest.Location,
                Deadline = workplaceRequest.Deadline,
                Email = workplaceRequest.Email,
                ContactPerson = workplaceRequest.ContactPerson,
                Notification = workplaceRequest.Notification,
                Position = workplaceRequest.Position,
                UserId = user.Id
            };

            await _context.Workplaces.AddAsync(workplace);
            await _context.SaveChangesAsync();

            var response = new WorkplaceResponse
            {
                Location = workplace.Location,
                Deadline = workplace.Deadline,
                Email = workplace.Email,
                ContactPerson = workplace.ContactPerson,
                Notification = workplace.Notification,
                Position = workplace.Position,
                Id = workplace.Id
            };

            return CreatedAtAction(nameof(GetWorkPlace), new { id = workplace.Id }, response);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<WorkplaceResponse>> GetWorkPlace(int id)
        {
            var workplace = await _context.Workplaces.FindAsync(id);

            if (workplace == null)
            {
                return NotFound();
            }

            var response = new WorkplaceResponse
            {
                Location = workplace.Location,
                Deadline = workplace.Deadline,
                Email = workplace.Email,
                ContactPerson = workplace.ContactPerson,
                Notification = workplace.Notification,
                Position = workplace.Position,
                Id = workplace.Id
            };

            return Ok(response);
        }
    }
}
