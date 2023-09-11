using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DTOs
{
    public class CalendarSlotInfo
    {
        public string StartDate {  get; set; }

        public string EndDate { get; set; }

        public List<string> Slots { get; set; }
    }
}
