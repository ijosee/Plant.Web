using System;

namespace Plant.Web.Entities.Rq.Calendar {
    public class SetCalendarLogRq {
        public string Title { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public bool allDay { get; set; }
    }
}