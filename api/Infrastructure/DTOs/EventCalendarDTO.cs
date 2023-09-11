using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DTOs
{
    public class EventCalendarDTO
    {
        public Event Event { get; set; }    
        public string TimePick { get; set; }
        public CalendarSlotInfo SlotInfo { get; set; }
    }
}
