using System;

namespace Plant.Web.Entities.Rq.Calendar {
    public class UpdateCalendarLogRq {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}