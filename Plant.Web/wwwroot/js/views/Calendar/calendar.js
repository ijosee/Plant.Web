document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: [ 'bootstrap','dayGrid', 'timeGrid', 'list', 'interaction' ],
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      navLinks: true, // can click day/week names to navigate views
      selectable: true,
      selectMirror: true,
      displayEventTime : true,
      select: function(arg) {
        var title = prompt('Event Title:');
        if (title) {
          calendar.addEvent({
            title: title,
            start: arg.start,
            end: arg.end,
            allDay: false
          })
        }
        calendar.unselect()
      },
      eventRender: function(info) {
        // var tooltip = new Tooltip(info.el, {
        //   title: 'jose',
        //   placement: 'top',
        //   trigger: 'hover',
        //   container: 'body'
        // });
      },
      eventSources: [{
        url: 'Calendar/GetFullCalendar',
        error: function() {
          alert('there was an error while fetching events!');
        },
        color: 'yellow',   // a non-ajax option
        textColor: 'black' // a non-ajax option
      }]
    });

    calendar.render();

  });