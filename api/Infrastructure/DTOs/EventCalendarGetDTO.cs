using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DTOs
{
    public class EventCalendarGetDTO
    {

        public string Title { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }   

        public EventCalendarDataGetDTO Data { get; set; }
    }
}
