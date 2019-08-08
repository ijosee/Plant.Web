using System;

namespace Plant.Web.Entities.Rq.WatterPump {
    public class WatterPumpLogRq {
        public int Value { get; set; }
        public int Flow { get; set; }
        public int OpenedTimeInSeconds { get; set; }
        public DateTime Timestamp { get; set; }
    }
}