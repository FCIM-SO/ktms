using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DTOs
{
    public class EventCalendarDataGetDTO
    {
      public Guid GuidId { get;set; }

        public EventCalendarDataGetDTO()
        {

        }
        public EventCalendarDataGetDTO(Guid id)
        {
            this.GuidId = id;
        }
    }
}
