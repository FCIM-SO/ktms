using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Event:BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Default";
        public int Duration { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public EventStatus? EventStatus { get; set; }
        public EventType? EventType { get; set; }
        public Guid GuidId { get;set; } = Guid.NewGuid();
        public int Createdby { get; set; }
    }
}
