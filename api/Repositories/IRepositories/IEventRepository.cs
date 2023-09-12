using Domain.Entities;
using Infrastructure.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.IRepositories
{
    public interface IEventRepository
    {
        IEnumerable<Event> GetEvents();

        IEnumerable<EventCalendarGetDTO> GetEventsForCalendar();

        bool InsertEvent(Event Event);

        EventPropsDTO GetEventProps();

        
        IEnumerable<Event> GetDraftEvents(int UserId);
    }
}
