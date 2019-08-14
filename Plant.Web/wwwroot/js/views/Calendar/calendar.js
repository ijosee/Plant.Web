document.addEventListener('DOMContentLoaded', function() {

  $("body").tooltip(
    { 
      selector: '[data-toggle=tooltip]', 
      trigger: 'hover click',
      html : true,
      boundary : 'scrollParent'
      //template : '<div class="tooltip" role="tooltip"><div class="arrow"></div><a href="#" onclick="alert()"><i class="fas fa-trash text-gray-300"></i></a><div class="tooltip-inner"></div></div>'
    }
    );

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
      },
      {
        url: 'Calendar/GetLastWatering',
        error: function() {
          alert('there was an error while fetching events!');
        },
        color: 'green',   // a non-ajax option
        textColor: 'white' // a non-ajax option
      },
    ],
      select: function(arg) {
        var title = prompt('Set a title for your event :');
        if (title) {

          calendar.addEvent({
            title: title,
            start: arg.start,
            end: arg.end,
            allDay: false,
          });

          var setEventData = {};
          setEventData.title = title;
          setEventData.start =moment(arg.start).format('MM-DD-YYYY HH:mm:ss');
          setEventData.end = moment(arg.end).format('MM-DD-YYYY HH:mm:ss');
          setEventData.allDay = false;

          setEvent(setEventData);
        }

        calendar.unselect();
      },
      eventRender: function(info) {

        info.el.setAttribute('data-toggle','tooltip');
        info.el.setAttribute('data-original-title',info.event._def.title+ ' [ <span class="span_event_id_'+info.event._def.publicId+'" > <i class="fas fa-trash text-gray-300"></i> </span> ] ');

      },
      eventDragStart: function(info) {

        $('[role="tooltip"]').tooltip('hide');

      },
      eventDragStop: function(info) {

        $('[role="tooltip"]').tooltip('hide');

      },
      eventClick : function(info) {

        if(info.el.style.borderColor === 'red'){
          info.el.style.borderColor = 'transparent';
        }else{
          info.el.style.borderColor = 'red';
        }

        var firstElement = document.getElementsByClassName('span_event_id_'+info.event._def.publicId)[0];
        if(firstElement !== undefined){
            firstElement.onclick = function() { 
              var data = {};
              data.id = info.event._def.publicId;
              deleteEvent(data); 

              info.el.remove();
              firstElement.parentElement.parentElement.remove();

            };
        }
      },
      eventDrop: function(info) {
        $('[role="tooltip"]').tooltip('hide');

        var updateEventData = {};
        updateEventData.id = info.event._def.publicId;
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

function deleteEvent(data){

    if (data.id !== undefined
      ) {

        $.get('Calendar/deleteEvent?id=' + data.id , function () {
        });

    }

}