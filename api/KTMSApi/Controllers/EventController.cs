using Domain.Entities;
using Infrastructure.DTOs;
using Infrastructure.IRepositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KTMSApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private IEventRepository _eventRepository;

        public EventController(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        [HttpGet("get")]
        [Authorize]
        public ActionResult Get()
        {
            return Ok(_eventRepository.GetEvents());
        }
        [HttpPost("add")]
        public IActionResult AddEvent(Event Event)
        {
            if (Event == null)
            {
                return BadRequest("No event");

            }
            try
            {
                _eventRepository.InsertEvent(Event);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        

        [HttpGet("add/get/props")]
        [Authorize]
        public ActionResult GetEventProps()
        {
            return Ok(_eventRepository.GetEventProps());
        }
        [HttpPost("add/calendar")]
        [Authorize]
        public IActionResult AddEventFromCalendar([FromBody] EventCalendarDTO eventCalendarDTO)
        {
            try
            {
                if (eventCalendarDTO.SlotInfo.Slots.Count > 1)
                {

                    var x = new List<UserModel>();

                }
                else
                {
                    var DateCombined = DateTime.Parse(eventCalendarDTO.SlotInfo.Slots[0]) +
                        TimeSpan.Parse(eventCalendarDTO.TimePick);
                    Console.WriteLine(DateCombined);
                    eventCalendarDTO.Event.Date = DateCombined;
                    _eventRepository.InsertEvent(eventCalendarDTO.Event);
                    return Ok(new EventCalendarGetDTO()
                    {
                        Title = eventCalendarDTO.Event.Name,
                        Start = eventCalendarDTO.Event.Date,
                        End = eventCalendarDTO.Event.Date.AddMinutes(eventCalendarDTO.Event.Duration)
                    }); 
                }
                return BadRequest("Not in if, something in slots");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getdrafts")]
        [Authorize]
        public ActionResult GetDrafts(int UserId)
        {
            return Ok(_eventRepository.GetDraftEvents(UserId));
        }


        [HttpGet("get/calendar")]
        [Authorize]
        public ActionResult GetEventsCalendar()
        {
            return Ok(_eventRepository.GetEventsForCalendar());
        }
    }
}
