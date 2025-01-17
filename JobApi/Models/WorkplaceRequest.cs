using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobApi.Models
{
    public class WorkplaceRequest
    {
        public int Id { get; set; }
        public required string Location { get; set; }
        public required string Deadline { get; set; }
        public required string Email { get; set; }
        public required string ContactPerson { get; set; }
        public required string Notification { get; set; }
        public required string Position { get; set; }
        public required int UserId { get; set; }
    }
}