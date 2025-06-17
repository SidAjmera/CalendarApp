document.addEventListener('DOMContentLoaded', function() {
     const calendarEl = document.getElementById('calendar');
     
     const calendar = new FullCalendar.Calendar(calendarEl, {
         initialView: 'dayGridMonth',
         headerToolbar: {
             left: 'prev,next today',
             center: 'title',
             right: 'dayGridMonth,timeGridWeek,timeGridDay'
         },
         // Enable month navigation
         navLinks: true,
         // Show today's date
         nowIndicator: true,
         // Make the calendar responsive
         height: 'auto',
         // Add some basic styling
         themeSystem: 'standard',
         // Customize button text
         buttonText: {
             today: 'Today',
             month: 'Month',
             week: 'Week',
             day: 'Day'
         },
         // Enable all-day slot in week and day views
         allDaySlot: true,
         // Show week numbers
         weekNumbers: true,
         // Set business hours (9 AM to 5 PM)
         businessHours: {
             daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
             startTime: '09:00',
             endTime: '17:00',
         },
     });
 
     function addEvent(title, start, end, allDay = false, calendarColor, description) {
        calendar.addEvent({
            title: title,
            start: start, 
            end: end,
            allDay: allDay,
            calendarColor: calendarColor,
            description: description
        })
     }

     calendar.render();
 });