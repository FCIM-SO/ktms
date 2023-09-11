using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DTOs
{
    public class EventPropsDTO
    {
        public List<EventType> EventTypes { get; set; }
        public List<EventStatus> EventStatuses { get; set; }
    }
}
