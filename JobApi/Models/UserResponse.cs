using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobApi.Models
{
    public class UserResponse
    {
        public int Id { get; set; }
        public required string Name { get; set; }
    }
}