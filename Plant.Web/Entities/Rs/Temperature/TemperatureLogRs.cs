using System;

namespace Plant.Web.Entities.Rs.Temperature {

    public class TemperatureLogRs {
        public int Id { get; set; }
        public float Value { get; set; }
        public DateTime Timestamp { get; set; }
    }
}