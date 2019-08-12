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
      eventSources: [
        {
        url: 'Calendar/GetFullCalendar',
        error: function() {
          alert('there was an error while fetching events!');
        },
        color: 'yellow',   // a non-ajax option
        textColor: 'black' // a non-ajax option
      }],
      select: function(arg) {
        var title = prompt('Set a title for your event :');
        if (title) {

          calendar.addEvent({
            title: title,
            start: arg.start,
            end: arg.end,
            allDay: false
          });

          var setEventData = {};
          //updateEvent.id = arg.id;
          setEventData.title = title;
          setEventData.start =moment(arg.start).format('MM-DD-YYYY HH:mm:ss');
          setEventData.end = moment(arg.end).format('MM-DD-YYYY HH:mm:ss');
          setEventData.allDay = false;

          setEvent(setEvent);
        }

        calendar.unselect();
      },
      eventRender: function(info) {
        // var tooltip = new Tooltip(info.el, {
        //   title: 'jose',
        //   placement: 'top',
        //   trigger: 'hover',
        //   container: 'body'
        // });

      $(info.el).data('id',info.id)

      },
      eventClick : function(info) {
        //alert('Event: ' + info.event.title);
        //alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        //alert('View: ' + info.view.type);

        // change the border color just for fun
        info.el.style.borderColor = 'red';
      },
      eventDrop: function(info) {

        var updateEventData = {};
        updateEventData.id = 3;
        updateEventData.title = info.event._def.title;
        updateEventData.start = moment(info.event._instance.range.start).format('MM-DD-YYYY HH:mm:ss');
        updateEventData.end = moment(info.event._instance.range.end).format('MM-DD-YYYY HH:mm:ss');
        updateEventData.allDay = false;

        if (!confirm("Are you sure about this change?")) {
          info.revert();
        }else{
          updateEvent(updateEventData);
        }

      }
    });

    calendar.render();
  });

function setEvent(data){

    if (data.start !== undefined 
      && data.end !== undefined
      && data.title !== undefined
      ) {

        $.get('Calendar/setEvent?start=' + data.start + '&end=' + data.end + '&title=' + data.title+ '&allDay=' + data.allDay, function () {
        });

    }

}

function updateEvent(data){

    if (data.start !== undefined 
      && data.end !== undefined
      && data.title !== undefined
      && data.id !== undefined
      ) {

        $.get('Calendar/updateEvent?id=' + data.id +'&start=' + data.start + '&end=' + data.end + '&title=' + data.title+ '&allDay=' + data.allDay, function () {
        });

    }

}