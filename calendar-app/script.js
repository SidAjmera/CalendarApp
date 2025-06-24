document.addEventListener('DOMContentLoaded', function() {
     // Theme management
     let isDarkMode = true; // Default to dark mode
     let currentProfile = null;
     let currentSubprofile = null;
     let showingAllSubprofiles = false;

     function toggleTheme() {
         isDarkMode = !isDarkMode;
         const body = document.body;
         const themeBtn = document.getElementById('themeToggleBtn');
         
         if (isDarkMode) {
             body.classList.remove('light-mode');
             themeBtn.textContent = '🌙 Dark';
             themeBtn.style.background = '#333';
             
             // Update button colors to dark theme
             const buttons = [
                 'showAllSubprofilesBtn', 'logoutBtn', 'createProfileBtn', 
                 'createSubprofileBtn', 'exportIcalBtn', 'importIcalBtn', 'printCalendarBtn'
             ];
             buttons.forEach(id => {
                 const btn = document.getElementById(id);
                 if (btn) btn.style.background = '#333';
             });
             
             // Update select elements
             const selects = ['profileSelect', 'subprofileSelect'];
             selects.forEach(id => {
                 const select = document.getElementById(id);
                 if (select) {
                     select.style.background = '#1a1a1a';
                     select.style.color = '#fff';
                     select.style.border = '1px solid #333';
                 }
             });
         } else {
             body.classList.add('light-mode');
             themeBtn.textContent = '☀️ Light';
             themeBtn.style.background = '#1976d2';
             
             // Update button colors to light theme
             const buttons = [
                 'showAllSubprofilesBtn', 'logoutBtn', 'createProfileBtn', 
                 'createSubprofileBtn', 'exportIcalBtn', 'importIcalBtn', 'printCalendarBtn'
             ];
             buttons.forEach(id => {
                 const btn = document.getElementById(id);
                 if (btn) btn.style.background = '#1976d2';
             });
             
             // Update select elements
             const selects = ['profileSelect', 'subprofileSelect'];
             selects.forEach(id => {
                 const select = document.getElementById(id);
                 if (select) {
                     select.style.background = '#fff';
                     select.style.color = '#333';
                     select.style.border = '1px solid #ddd';
                 }
             });
         }
         
         // Save theme preference
         localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
     }

     function loadThemePreference() {
         const savedTheme = localStorage.getItem('theme');
         if (savedTheme === 'light') {
             isDarkMode = false;
             document.body.classList.add('light-mode');
             document.getElementById('themeToggleBtn').textContent = '☀️ Light';
             document.getElementById('themeToggleBtn').style.background = '#1976d2';
             
             // Update button colors to light theme
             const buttons = [
                 'showAllSubprofilesBtn', 'logoutBtn', 'createProfileBtn', 
                 'createSubprofileBtn', 'exportIcalBtn', 'importIcalBtn', 'printCalendarBtn'
             ];
             buttons.forEach(id => {
                 const btn = document.getElementById(id);
                 if (btn) btn.style.background = '#1976d2';
             });
             
             // Update select elements
             const selects = ['profileSelect', 'subprofileSelect'];
             selects.forEach(id => {
                 const select = document.getElementById(id);
                 if (select) {
                     select.style.background = '#fff';
                     select.style.color = '#333';
                     select.style.border = '1px solid #ddd';
                 }
             });
         }
     }

     // Initialize theme
     loadThemePreference();
     
     // Theme toggle event listener
     document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

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
         height: '100%',
         expandRows: true, // this is key to make the cells fill the height
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
         dateClick: function(info) {
            openEventModal(info.dateStr);
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

     // Modal logic
     const eventModal = document.getElementById('eventModal');
     const closeModalBtn = document.getElementById('closeModal');
     const eventForm = document.getElementById('eventForm');
     const eventDateInput = document.getElementById('eventDate');
     const eventTitleInput = document.getElementById('eventTitle');
     const eventTimeInput = document.getElementById('eventTime');
     const eventLocationInput = document.getElementById('eventLocation');
     const eventDescriptionInput = document.getElementById('eventDescription');
     const eventColorInput = document.getElementById('eventColor');
     const eventAllDayInput = document.getElementById('eventAllDay');
     const eventSaveBtn = document.getElementById('eventSaveBtn');
     const eventDeleteBtn = document.getElementById('eventDeleteBtn');

     let editingEvent = null; // Will hold the event being edited, if any

     function openEventModal(dateStr, event = null) {
        eventModal.style.display = 'block';
        if (event) {
            // Editing existing event
            eventTitleInput.value = event.title || '';
            eventDateInput.value = event.start ? event.start.split('T')[0] : dateStr;
            eventAllDayInput.checked = event.allDay;
            eventTimeInput.disabled = event.allDay;
            eventTimeInput.value = event.start && event.start.includes('T') ? event.start.split('T')[1] : '';
            eventLocationInput.value = event.location || '';
            eventDescriptionInput.value = event.description || '';
            eventColorInput.value = event.backgroundColor || '#1976d2';
            eventDeleteBtn.style.display = 'inline-block';
            editingEvent = event;
        } else {
            // Creating new event
            eventTitleInput.value = '';
            eventDateInput.value = dateStr;
            eventAllDayInput.checked = true;
            eventTimeInput.disabled = true;
            eventTimeInput.value = '';
            eventLocationInput.value = '';
            eventDescriptionInput.value = '';
            eventColorInput.value = '#1976d2';
            eventDeleteBtn.style.display = 'none';
            editingEvent = null;
        }
     }

     closeModalBtn.onclick = function() {
        eventModal.style.display = 'none';
     };
     window.onclick = function(event) {
        if (event.target == eventModal) {
            eventModal.style.display = 'none';
        }
     };

     // Enable/disable time input based on allDay checkbox
     eventAllDayInput.addEventListener('change', function() {
        eventTimeInput.disabled = eventAllDayInput.checked;
     });

     // Save (create or update) event to localStorage
     eventForm.onsubmit = function(e) {
        e.preventDefault();
        if (showingAllSubprofiles) {
          alert('Cannot create events in "Show All Subprofiles" mode. Please select a specific subprofile first.');
          return;
        }
        const title = eventTitleInput.value;
        const date = eventDateInput.value;
        const time = eventTimeInput.value;
        const location = eventLocationInput.value;
        const description = eventDescriptionInput.value;
        const color = eventColorInput.value;
        const allDay = eventAllDayInput.checked;
        let start = date;
        if (!allDay && time) start += 'T' + time;
        let events = currentProfile && currentSubprofile ? 
          (() => {
            const profiles = getProfiles();
            const prof = profiles.find(p => p.name === currentProfile);
            return prof && prof.events && prof.events[currentSubprofile] ? prof.events[currentSubprofile] : [];
          })() : 
          JSON.parse(localStorage.getItem('calendarEvents') || '[]');
        if (editingEvent && editingEvent.id) {
            // Update existing event in localStorage
            const idx = events.findIndex(ev => ev.id === editingEvent.id);
            if (idx !== -1) {
                events[idx] = {
                    ...events[idx],
                    title,
                    start,
                    allDay,
                    location,
                    description,
                    backgroundColor: color,
                    borderColor: color,
                    textColor: '#fff',
                    id: editingEvent.id
                };
            }
            if (currentProfile && currentSubprofile) {
                saveEventsForCurrent(events);
            } else {
                localStorage.setItem('calendarEvents', JSON.stringify(events));
            }
            // Update in calendar using Event API
            const calEvent = calendar.getEventById(editingEvent.id);
            if (calEvent) {
                calEvent.setProp('title', title);
                calEvent.setStart(start);
                calEvent.setAllDay(allDay);
                calEvent.setExtendedProp('location', location);
                calEvent.setExtendedProp('description', description);
                calEvent.setProp('backgroundColor', color);
                calEvent.setProp('borderColor', color);
                calEvent.setProp('textColor', '#fff');
            }
        } else {
            // Create new event
            let eventObj = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                title,
                start,
                allDay,
                location,
                description,
                backgroundColor: color,
                borderColor: color,
                textColor: '#fff'
            };
            events.push(eventObj);
            if (currentProfile && currentSubprofile) {
                saveEventsForCurrent(events);
            } else {
                localStorage.setItem('calendarEvents', JSON.stringify(events));
            }
            calendar.addEvent(eventObj);
        }
        eventModal.style.display = 'none';
     };

     // Delete event
     eventDeleteBtn.onclick = function(e) {
        e.preventDefault(); // Prevent form submission if inside form
        if (editingEvent && editingEvent.id) {
            let events = currentProfile && currentSubprofile ? 
              (() => {
                const profiles = getProfiles();
                const prof = profiles.find(p => p.name === currentProfile);
                return prof && prof.events && prof.events[currentSubprofile] ? prof.events[currentSubprofile] : [];
              })() : 
              JSON.parse(localStorage.getItem('calendarEvents') || '[]');
            events = events.filter(ev => ev.id !== editingEvent.id);
            if (currentProfile && currentSubprofile) {
                saveEventsForCurrent(events);
            } else {
                localStorage.setItem('calendarEvents', JSON.stringify(events));
            }
            const calEvent = calendar.getEventById(editingEvent.id);
            if (calEvent) calEvent.remove();
            eventModal.style.display = 'none';
            editingEvent = null;
        }
     };

     // Load events from localStorage
     function loadEventsFromLocalStorage() {
        if (currentProfile && currentSubprofile) {
            loadEventsForCurrent();
        } else {
            let events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
            events.forEach(event => {
                calendar.addEvent(event);
            });
        }
     }

     // Event click handler for editing
     calendar.on('eventClick', function(info) {
        // info.event contains the FullCalendar Event API object
        // Convert to plain object for modal
        const eventObj = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.startStr,
            allDay: info.event.allDay,
            location: info.event.extendedProps.location,
            description: info.event.extendedProps.description,
            backgroundColor: info.event.backgroundColor,
            borderColor: info.event.borderColor,
            textColor: info.event.textColor
        };
        openEventModal(eventObj.start.split('T')[0], eventObj);
     });

     calendar.render();

     // --- iCal Import Logic ---
     function parseICal(icsData) {
        // Simple iCal parser for VEVENTs
        const events = [];
        const vevents = icsData.split('BEGIN:VEVENT').slice(1);
        vevents.forEach(raw => {
            const event = {};
            const lines = raw.split(/\r?\n/);
            lines.forEach(line => {
                if (line.startsWith('SUMMARY:')) event.title = line.replace('SUMMARY:', '').trim();
                if (line.startsWith('DESCRIPTION:')) event.description = line.replace('DESCRIPTION:', '').trim();
                if (line.startsWith('LOCATION:')) event.location = line.replace('LOCATION:', '').trim();
                if (line.startsWith('UID:')) event.id = line.replace('UID:', '').trim();
                if (line.startsWith('DTSTART;VALUE=DATE:')) {
                    event.start = line.replace('DTSTART;VALUE=DATE:', '').trim();
                    event.allDay = true;
                }
                if (line.startsWith('DTSTART:')) {
                    let dt = line.replace('DTSTART:', '').trim();
                    // Format: YYYYMMDDTHHmmssZ or YYYYMMDDTHHmmss
                    let year = dt.slice(0,4), month = dt.slice(4,6), day = dt.slice(6,8);
                    let hour = dt.slice(9,11), min = dt.slice(11,13);
                    event.start = `${year}-${month}-${day}T${hour}:${min}`;
                    event.allDay = false;
                }
            });
            // Fallbacks
            if (!event.id) event.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            if (event.start) {
                // Use default color
                event.backgroundColor = '#1976d2';
                event.borderColor = '#1976d2';
                event.textColor = '#fff';
                events.push(event);
            }
        });
        return events;
     }

     // Import iCal File
     const importIcalBtn = document.getElementById('importIcalBtn');
     const importIcalFile = document.getElementById('importIcalFile');
     importIcalBtn.onclick = function() {
        importIcalFile.click();
     };
     importIcalFile.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            const icsData = evt.target.result;
            const newEvents = parseICal(icsData);
            let events = currentProfile && currentSubprofile ? 
              (() => {
                const profiles = getProfiles();
                const prof = profiles.find(p => p.name === currentProfile);
                return prof && prof.events && prof.events[currentSubprofile] ? prof.events[currentSubprofile] : [];
              })() : 
              JSON.parse(localStorage.getItem('calendarEvents') || '[]');
            newEvents.forEach(ev => {
                events.push(ev);
                calendar.addEvent(ev);
            });
            if (currentProfile && currentSubprofile) {
                saveEventsForCurrent(events);
            } else {
                localStorage.setItem('calendarEvents', JSON.stringify(events));
            }
            alert(`${newEvents.length} events imported.`);
        };
        reader.readAsText(file);
        // Reset file input
        importIcalFile.value = '';
     };

     // Export to iCal button logic
     const exportIcalBtn = document.getElementById('exportIcalBtn');
     exportIcalBtn.onclick = function() {
        let events = currentProfile && currentSubprofile ? 
          (() => {
            const profiles = getProfiles();
            const prof = profiles.find(p => p.name === currentProfile);
            return prof && prof.events && prof.events[currentSubprofile] ? prof.events[currentSubprofile] : [];
          })() : 
          JSON.parse(localStorage.getItem('calendarEvents') || '[]');
        if (!events.length) {
            alert('No events to export.');
            return;
        }
        let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Your Calendar App//EN\r\n';
        events.forEach(ev => {
            ics += 'BEGIN:VEVENT\r\n';
            ics += 'UID:' + (ev.id || (Date.now() + Math.random())) + '@yourcalendarapp\r\n';
            ics += 'SUMMARY:' + (ev.title ? ev.title.replace(/\n/g, ' ') : '') + '\r\n';
            if (ev.description) ics += 'DESCRIPTION:' + ev.description.replace(/\n/g, ' ') + '\r\n';
            if (ev.location) ics += 'LOCATION:' + ev.location.replace(/\n/g, ' ') + '\r\n';
            if (ev.allDay) {
                ics += 'DTSTART;VALUE=DATE:' + ev.start.replace(/-/g, '').split('T')[0] + '\r\n';
            } else {
                // Format as UTC for compatibility
                let dt = new Date(ev.start);
                let y = dt.getUTCFullYear();
                let m = String(dt.getUTCMonth()+1).padStart(2, '0');
                let d = String(dt.getUTCDate()).padStart(2, '0');
                let h = String(dt.getUTCHours()).padStart(2, '0');
                let min = String(dt.getUTCMinutes()).padStart(2, '0');
                let s = String(dt.getUTCSeconds()).padStart(2, '0');
                ics += 'DTSTART:' + y + m + d + 'T' + h + min + s + 'Z\r\n';
            }
            ics += 'END:VEVENT\r\n';
        });
        ics += 'END:VCALENDAR\r\n';
        // Download as .ics file
        let blob = new Blob([ics], {type: 'text/calendar'});
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'calendar-export.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
     };

     // --- Profile & Subprofile Management ---
     const profileSelect = document.getElementById('profileSelect');
     const subprofileSelect = document.getElementById('subprofileSelect');
     const createProfileBtn = document.getElementById('createProfileBtn');
     const createSubprofileBtn = document.getElementById('createSubprofileBtn');
     const deleteProfileBtn = document.getElementById('deleteProfileBtn');
     const deleteSubprofileBtn = document.getElementById('deleteSubprofileBtn');
     const logoutBtn = document.getElementById('logoutBtn');
     const showAllSubprofilesBtn = document.getElementById('showAllSubprofilesBtn');

     function getProfiles() {
       return JSON.parse(localStorage.getItem('calendarProfiles') || '[]');
     }
     function saveProfiles(profiles) {
       localStorage.setItem('calendarProfiles', JSON.stringify(profiles));
     }
     function updateProfileDropdown() {
       const profiles = getProfiles();
       profileSelect.innerHTML = '<option value="">Select Profile</option>' + profiles.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
       subprofileSelect.innerHTML = '<option value="">Select Calendar</option>';
       subprofileSelect.disabled = true;
       logoutBtn.style.display = 'none';
       showAllSubprofilesBtn.style.display = 'none';
     }
     function updateCalendarDropdown(profile) {
       subprofileSelect.innerHTML = '<option value="">Select Calendar</option>' + 
           (profile.subprofiles||[]).map(s => `<option value="${s}">${s}</option>`).join('');
       subprofileSelect.disabled = false;
       
       // Update Show All Calendars button visibility
       const hasMultipleCalendars = profile.subprofiles && profile.subprofiles.length > 1;
       showAllSubprofilesBtn.style.display = hasMultipleCalendars ? '' : 'none';
       
       // Reset showing all state when switching profiles
       showingAllSubprofiles = false;
     }
     function clearCalendarEvents() {
       calendar.getEvents().forEach(ev => ev.remove());
     }
     function loadEventsForCurrent() {
       clearCalendarEvents();
       if (!currentProfile || !currentSubprofile) return;
       const profiles = getProfiles();
       const prof = profiles.find(p => p.name === currentProfile);
       if (!prof) return;
       const events = (prof.events && prof.events[currentSubprofile]) || [];
       events.forEach(event => calendar.addEvent(event));
     }
     function loadAllCalendarEvents() {
       clearCalendarEvents();
       if (!currentProfile) return;
       const profiles = getProfiles();
       const prof = profiles.find(p => p.name === currentProfile);
       if (!prof || !prof.subprofiles || prof.subprofiles.length === 0) return;
       
       // Define colors for different calendars
       const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f', '#1976d2', '#388e3c', '#f57c00'];
       
       prof.subprofiles.forEach((subprofile, index) => {
         const events = (prof.events && prof.events[subprofile]) || [];
         const color = colors[index % colors.length];
         events.forEach(event => {
           calendar.addEvent({
             ...event,
             title: `[${subprofile}] ${event.title}`,
             backgroundColor: color,
             borderColor: color,
             textColor: '#fff'
           });
         });
       });
     }
     function saveEventsForCurrent(events) {
       const profiles = getProfiles();
       const prof = profiles.find(p => p.name === currentProfile);
       if (!prof) return;
       if (!prof.events) prof.events = {};
       prof.events[currentSubprofile] = events;
       saveProfiles(profiles);
     }
     // --- Password Modal Logic ---
     function showPasswordModal(title, label, callback) {
       const modal = document.getElementById('passwordModal');
       const closeBtn = document.getElementById('closePasswordModal');
       const form = document.getElementById('passwordForm');
       const input = document.getElementById('passwordInput');
       const okBtn = document.getElementById('passwordOkBtn');
       const cancelBtn = document.getElementById('passwordCancelBtn');
       document.getElementById('passwordModalTitle').textContent = title || 'Enter Password';
       document.getElementById('passwordModalLabel').textContent = label || 'Password:';
       input.value = '';
       modal.style.display = 'block';
       input.focus();
       function cleanup() {
         modal.style.display = 'none';
         form.onsubmit = null;
         cancelBtn.onclick = null;
         closeBtn.onclick = null;
       }
       form.onsubmit = function(e) {
         e.preventDefault();
         cleanup();
         callback(input.value);
       };
       cancelBtn.onclick = closeBtn.onclick = function() {
         cleanup();
         callback(null);
       };
     }
     profileSelect.onchange = function() {
       const name = profileSelect.value;
       if (!name) return;
       const profiles = getProfiles();
       const prof = profiles.find(p => p.name === name);
       if (!prof) return;
       showPasswordModal('Enter Password', `Password for ${name}:`, function(pwd) {
         if (pwd !== prof.password) {
           alert('Incorrect password.');
           updateProfileDropdown();
           return;
         }
         currentProfile = name;
         updateCalendarDropdown(prof);
         logoutBtn.style.display = '';
       });
     };
     subprofileSelect.onchange = function() {
       const sub = subprofileSelect.value;
       if (!sub) return;
       currentSubprofile = sub;
       showingAllSubprofiles = false;
       loadEventsForCurrent();
       
       // Update UI to show inactive state for show all button
       showAllSubprofilesBtn.classList.remove('active');
     };
     showAllSubprofilesBtn.onclick = function() {
       showingAllSubprofiles = true;
       currentSubprofile = null;
       subprofileSelect.value = '';
       loadAllCalendarEvents();
       
       // Update UI to show active state
       showAllSubprofilesBtn.classList.add('active');
     };
     logoutBtn.onclick = function() {
       currentProfile = null;
       currentSubprofile = null;
       showingAllSubprofiles = false;
       updateProfileDropdown();
       clearCalendarEvents();
     };
     createProfileBtn.onclick = function() {
       const name = prompt('Enter new profile name:');
       if (!name) return;
       showPasswordModal('Set Password', `Set a password for ${name}:`, function(pwd) {
         if (!pwd) return;
         showPasswordModal('Confirm Password', `Confirm password for ${name}:`, function(confirmPwd) {
           if (!confirmPwd) return;
           if (pwd !== confirmPwd) {
             alert('Passwords do not match. Please try again.');
             return;
           }
           let profiles = getProfiles();
           if (profiles.some(p => p.name === name)) {
             alert('Profile already exists.');
             return;
           }
           profiles.push({ name, password: pwd, subprofiles: [], events: {} });
           saveProfiles(profiles);
           updateProfileDropdown();
           alert('Profile created!');
         });
       });
     };
     createSubprofileBtn.onclick = function() {
       const profiles = getProfiles();
       if (!profiles.length) {
         alert('No profiles exist. Create a profile first.');
         return;
       }
       // Create a modal for profile selection
       const modal = document.getElementById('passwordModal');
       const closeBtn = document.getElementById('closePasswordModal');
       const form = document.getElementById('passwordForm');
       const input = document.getElementById('passwordInput');
       const okBtn = document.getElementById('passwordOkBtn');
       const cancelBtn = document.getElementById('passwordCancelBtn');
       const title = document.getElementById('passwordModalTitle');
       const label = document.getElementById('passwordModalLabel');
       
       // Replace password input with profile dropdown
       title.textContent = 'Select Profile';
       label.textContent = 'Choose a profile:';
       input.style.display = 'none';
       
       // Create dropdown
       const dropdown = document.createElement('select');
       dropdown.style.width = '100%';
       dropdown.style.marginBottom = '12px';
       dropdown.style.padding = '8px';
       dropdown.style.borderRadius = '4px';
       dropdown.style.border = '1px solid #ccc';
       dropdown.innerHTML = '<option value="">Select a profile...</option>' + 
         profiles.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
       
       // Replace input with dropdown in form
       form.insertBefore(dropdown, input);
       
       modal.style.display = 'block';
       dropdown.focus();
       
       function cleanup() {
         modal.style.display = 'none';
         form.onsubmit = null;
         cancelBtn.onclick = null;
         closeBtn.onclick = null;
         // Remove dropdown and restore input
         if (dropdown.parentNode) dropdown.parentNode.removeChild(dropdown);
         input.style.display = '';
         title.textContent = 'Enter Password';
         label.textContent = 'Password:';
       }
       
       form.onsubmit = function(e) {
         e.preventDefault();
         const profName = dropdown.value;
         if (!profName) {
           alert('Please select a profile.');
           return;
         }
         cleanup();
         const prof = profiles.find(p => p.name === profName);
         showPasswordModal('Enter Password', `Password for ${profName}:`, function(pwd) {
           if (pwd !== prof.password) {
             alert('Incorrect password.');
             return;
           }
           const subName = prompt('Enter new calendar name:');
           if (!subName) return;
           if (prof.subprofiles.includes(subName)) {
             alert('Calendar already exists.');
             return;
           }
           prof.subprofiles.push(subName);
           prof.events[subName] = [];
           saveProfiles(profiles);
           if (currentProfile === profName) updateCalendarDropdown(prof);
           alert('Calendar created!');
         });
       };
       
       cancelBtn.onclick = closeBtn.onclick = function() {
         cleanup();
       };
     };
     // Delete Profile
     deleteProfileBtn.onclick = function() {
       const profiles = getProfiles();
       if (!profiles.length) {
         alert('No profiles exist to delete.');
         return;
       }
       // Create a modal for profile selection
       const modal = document.getElementById('passwordModal');
       const closeBtn = document.getElementById('closePasswordModal');
       const form = document.getElementById('passwordForm');
       const input = document.getElementById('passwordInput');
       const okBtn = document.getElementById('passwordOkBtn');
       const cancelBtn = document.getElementById('passwordCancelBtn');
       const title = document.getElementById('passwordModalTitle');
       const label = document.getElementById('passwordModalLabel');
       
       // Replace password input with profile dropdown
       title.textContent = 'Delete Profile';
       label.textContent = 'Choose a profile to delete:';
       input.style.display = 'none';
       
       // Create dropdown
       const dropdown = document.createElement('select');
       dropdown.style.width = '100%';
       dropdown.style.marginBottom = '12px';
       dropdown.style.padding = '8px';
       dropdown.style.borderRadius = '4px';
       dropdown.style.border = '1px solid #ccc';
       dropdown.innerHTML = '<option value="">Select a profile...</option>' + 
         profiles.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
       
       // Replace input with dropdown in form
       form.insertBefore(dropdown, input);
       
       modal.style.display = 'block';
       dropdown.focus();
       
       function cleanup() {
         modal.style.display = 'none';
         form.onsubmit = null;
         cancelBtn.onclick = null;
         closeBtn.onclick = null;
         // Remove dropdown and restore input
         if (dropdown.parentNode) dropdown.parentNode.removeChild(dropdown);
         input.style.display = '';
         title.textContent = 'Enter Password';
         label.textContent = 'Password:';
       }
       
       form.onsubmit = function(e) {
         e.preventDefault();
         const profName = dropdown.value;
         if (!profName) {
           alert('Please select a profile.');
           return;
         }
         cleanup();
         const prof = profiles.find(p => p.name === profName);
         showPasswordModal('Confirm Deletion', `Enter password for ${profName} to confirm deletion:`, function(pwd) {
           if (pwd !== prof.password) {
             alert('Incorrect password.');
             return;
           }
           if (confirm(`Are you sure you want to delete the profile "${profName}" and ALL its calendars and events? This action cannot be undone.`)) {
             // Remove the profile
             const updatedProfiles = profiles.filter(p => p.name !== profName);
             saveProfiles(updatedProfiles);
             
             // If the deleted profile was the current one, log out
             if (currentProfile === profName) {
               currentProfile = null;
               currentSubprofile = null;
               showingAllSubprofiles = false;
               updateProfileDropdown();
               clearCalendarEvents();
             } else {
               updateProfileDropdown();
             }
             alert(`Profile "${profName}" has been deleted.`);
           }
         });
       };
       
       cancelBtn.onclick = closeBtn.onclick = function() {
         cleanup();
       };
     };
     
     // Delete Calendar
     deleteSubprofileBtn.onclick = function() {
       if (!currentProfile) {
         alert('Please select a profile first.');
         return;
       }
       const profiles = getProfiles();
       const prof = profiles.find(p => p.name === currentProfile);
       if (!prof || !prof.subprofiles || prof.subprofiles.length === 0) {
         alert('No calendars exist to delete.');
         return;
       }
       // Create a modal for calendar selection
       const modal = document.getElementById('passwordModal');
       const closeBtn = document.getElementById('closePasswordModal');
       const form = document.getElementById('passwordForm');
       const input = document.getElementById('passwordInput');
       const okBtn = document.getElementById('passwordOkBtn');
       const cancelBtn = document.getElementById('passwordCancelBtn');
       const title = document.getElementById('passwordModalTitle');
       const label = document.getElementById('passwordModalLabel');
       
       // Replace password input with calendar dropdown
       title.textContent = 'Delete Calendar';
       label.textContent = 'Choose a calendar to delete:';
       input.style.display = 'none';
       
       // Create dropdown
       const dropdown = document.createElement('select');
       dropdown.style.width = '100%';
       dropdown.style.marginBottom = '12px';
       dropdown.style.padding = '8px';
       dropdown.style.borderRadius = '4px';
       dropdown.style.border = '1px solid #ccc';
       dropdown.innerHTML = '<option value="">Select a calendar...</option>' + 
         prof.subprofiles.map(s => `<option value="${s}">${s}</option>`).join('');
       
       // Replace input with dropdown in form
       form.insertBefore(dropdown, input);
       
       modal.style.display = 'block';
       dropdown.focus();
       
       function cleanup() {
         modal.style.display = 'none';
         form.onsubmit = null;
         cancelBtn.onclick = null;
         closeBtn.onclick = null;
         // Remove dropdown and restore input
         if (dropdown.parentNode) dropdown.parentNode.removeChild(dropdown);
         input.style.display = '';
         title.textContent = 'Enter Password';
         label.textContent = 'Password:';
       }
       
       form.onsubmit = function(e) {
         e.preventDefault();
         const subName = dropdown.value;
         if (!subName) {
           alert('Please select a calendar.');
           return;
         }
         cleanup();
         showPasswordModal('Confirm Deletion', `Enter password for ${currentProfile} to confirm deletion:`, function(pwd) {
           if (pwd !== prof.password) {
             alert('Incorrect password.');
             return;
           }
           if (confirm(`Are you sure you want to delete the calendar "${subName}" and ALL its events? This action cannot be undone.`)) {
             // Remove the calendar
             prof.subprofiles = prof.subprofiles.filter(s => s !== subName);
             if (prof.events && prof.events[subName]) {
               delete prof.events[subName];
             }
             saveProfiles(profiles);
             
             // If the deleted calendar was the current one, clear the calendar
             if (currentSubprofile === subName) {
               currentSubprofile = null;
               showingAllSubprofiles = false;
               clearCalendarEvents();
             }
             updateCalendarDropdown(prof);
             alert(`Calendar "${subName}" has been deleted.`);
           }
         });
       };
       
       cancelBtn.onclick = closeBtn.onclick = function() {
         cleanup();
       };
     };
     
     // On load
     updateProfileDropdown();
     
     // Print Calendar functionality
     const printCalendarBtn = document.getElementById('printCalendarBtn');
     printCalendarBtn.onclick = function() {
        // Update calendar data attributes for print header
        const calendarEl = document.getElementById('calendar');
        const currentView = calendar.view.type;
        const currentDate = calendar.view.currentStart;
        const dateStr = currentDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Set data attributes for CSS to use in print header
        calendarEl.setAttribute('data-current-view', currentView.charAt(0).toUpperCase() + currentView.slice(1));
        calendarEl.setAttribute('data-current-date', dateStr);
        
        // Add profile/calendar info if available
        if (currentProfile) {
            let calendarInfo = `Profile: ${currentProfile}`;
            if (currentSubprofile) {
                calendarInfo += ` | Calendar: ${currentSubprofile}`;
            } else if (showingAllSubprofiles) {
                calendarInfo += ` | All Calendars`;
            }
            calendarEl.setAttribute('data-calendar-info', calendarInfo);
        }
        
        // Small delay to ensure DOM updates, then print
        setTimeout(function() {
            window.print();
        }, 100);
     };

     // Event listeners
     loadProfiles();
     updateProfileSelect();
     updateSubprofileSelect();
     
     // Initialize calendar and load events
     calendar.render();
     loadEventsFromLocalStorage();

     // Update calendar options for better viewport usage
     calendar.setOption('height', '100%');
     calendar.setOption('expandRows', true);
});