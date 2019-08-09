using System;
using Newtonsoft.Json;

namespace Plant.Web.Entities.Rs.Calendar {
    public class FullCalendarRs {
        [JsonProperty ("id")]
        public int Id { get; set; }

        [JsonProperty ("title")]
        public string Title { get; set; }
        //public string Description { get; set; }

        [JsonProperty ("start")]
        public string Start { get; set; }

        [JsonProperty ("end")]
        public string End { get; set; }

        [JsonProperty ("allday")]
        public bool AllDay { get; set; }
    }
}