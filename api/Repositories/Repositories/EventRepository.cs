using Domain.Entities;
using Infrastructure.DTOs;
using Infrastructure.IRepositories;
using MFC.Infrastructure.DataBase;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private KTMSDbContext _context;
        public EventRepository(KTMSDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Event> GetDraftEvents(int UserId)
        {
            var Events = _context.Events
                .Include(et=>et.EventType)
                .Include(es=>es.EventStatus)
                .Where(e => e.EventStatus.Id == 1 && e.Createdby == UserId)
                .ToList();
            return Events;
        }

        public EventPropsDTO GetEventProps()
        {
            var EventProps = new EventPropsDTO()
            {
                EventStatuses = _context.EventStatuses.ToList(),
                EventTypes = _context.EventTypes.ToList(),
            };
            return EventProps;
        }

        public IEnumerable<Event> GetEvents()
        {
            return _context.Events.ToList();
        }

        public IEnumerable<EventCalendarGetDTO> GetEventsForCalendar()
        {
            try
            {
                var Events = _context.Events.Select(e=>new EventCalendarGetDTO()
                {
                  
                        Title = e.Name,
                        Start = e.Date,
                        End = e.Date.AddMinutes(e.Duration),
                        Data = new EventCalendarDataGetDTO(e.GuidId)

                        
                }).ToList();
                return Events;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            return null;
            }


        }

        public bool InsertEvent(Event Event)
        {
            try
            {
                _context.Attach(Event.EventType);
                _context.Attach(Event.EventStatus);
                
                _context.Events.Add(Event);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
