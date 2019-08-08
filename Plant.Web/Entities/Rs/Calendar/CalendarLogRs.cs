using System;
namespace Plant.Web.Entities.Rs.Calendar {
    public class CalendarLogRs {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public DateTime Timestamp { get; set; }
    }
}