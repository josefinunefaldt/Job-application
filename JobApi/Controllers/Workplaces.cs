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
        public async Task<ActionResult<IEnumerable<WorkplaceResponse>>> GetWorkplaces()
        {
            var workplaces = await _context.Workplaces.ToListAsync();
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
        public async Task<ActionResult<WorkplaceResponse>> CreateWorkplace([FromBody] WorkplaceRequest workplaceRequest)
        {
            var user = await _context.Users.FindAsync(workplaceRequest.UserId);

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
                user = user
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
