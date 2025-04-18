using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobApi.Models
{
    public class Workplace
    {
        public int Id { get; set; }
        public required string Location { get; set; }
        public required string Deadline { get; set; }
        public string? Company { get; set; }
        public string? Link { get; set; }
        public string? InterviewDate { get; set; }
        public required string Email { get; set; }
        public required string ContactPerson { get; set; }
        public required string Status { get; set; }
        public string? StatusTimeStamp { get; set; }
        public required string Position { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
