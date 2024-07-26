/*
Author: Soulai Vang
Internet Computing

Acknowledgements: The Jumino art on the event form was found at the following link:
https://www.reddit.com/r/StardewValley/comments/155l158/junimo_fanart_they_bring_me_so_much_joy/

The Stardew Valley font file was found at the following link:
https://www.reddit.com/r/StardewValley/comments/4dtgp7/by_popular_request_a_stardew_valley_font_for_your/

The vines pixel art was found at the following link:
https://www.pixilart.com/art/pixel-vine-63f8f96334ca616

Stardew Valley sprites for Junimos and Chicken created by ConcernedApe (Eric Barone)

Stack Overflow Links for helping me determine how to get the number of rows in a dynamically created grid
along with how to check if two elements are overlapping one another:
https://stackoverflow.com/questions/55204205/a-way-to-count-columns-in-a-responsive-grid
https://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements

Notes: The event positioning is a bit finnicky and I did not have a lot of time to get it as clean as possible.
Some notes about the event positioning is that if you add a third overlapping event when you have two overlapping
events above, it will break due to pushing events to fit the new grid layout. Another thing to note is that if you
add in events that overlap non-chronologically, it also breaks the positioning due to how CSS grid works and
when each div is added. Along with this, fixing the relative position to match the absolute position may not work
all the time in very specific scenarios of overlapping events, but it generally works well if you add in overlapping
events chronologically for one single day column. It is also to note that there is no method that updates all elements if
the grid changes dimensions, such as adjusting the position for having more rows for earlier elements. 
If I had more time I would fix these issues, but as is, it still works well enough.
*/

function EventItem(name, location, dayOfWeek, startTime, endTime, duration) {
    this.name = name;
    this.location = location;
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = duration;

    // Functions
    this.createDiv = function() {
        let div = document.createElement("div");
        div.className = "event-item";
        div.innerHTML = "<strong>" + this.name + "</strong><br/>" + this.location + "<br/>" + this.startTime + " - " + this.endTime + "<br/>";
        return div;
    }

    this.createEvent = function(div) {
        getDayContent(this.dayOfWeek).appendChild(div);
    }
}

// Building the event form and graphics on the page
buildEventForm();
buildGraphics();

// Adds the event form to display on the screen on button press
document.getElementById("new_event_button").addEventListener("click", function() {
    document.getElementById("add_event_form").style.display = "initial";
})

// Submits the data inputted and creates a new EventItem object to apply to the planner
if (document.getElementById("submit_event") != null) {
    document.getElementById("submit_event").addEventListener("click", function() {
        let dayElement = document.getElementsByClassName("dayOfWeek")[0];
        let startTimeElement = document.getElementsByClassName("startTime")[0];
        let endTimeElement = document.getElementsByClassName("endTime")[0];

        let nameOfEvent = document.getElementsByClassName("name")[0].value;
        let timeOfEvent = document.getElementsByClassName("location")[0].value;
        let dayOfEvent = dayElement.options[dayElement.selectedIndex].text;
        let startTimeText = startTimeElement.options[startTimeElement.selectedIndex].text;
        let startTimeValue = startTimeElement.value;
        let endTimeText = endTimeElement.options[endTimeElement.selectedIndex].text;
        let endTimeValue = endTimeElement.value;

        if (Number(startTimeValue) >= Number(endTimeValue)) {
            alert("Please choose a time frame that is valid.");
        }
        else {
            let eventItem = new EventItem(nameOfEvent, timeOfEvent, dayOfEvent, startTimeText, endTimeText);
            let eventDiv = eventItem.createDiv();
            if (positionEvent(eventItem, eventDiv, startTimeValue, endTimeValue, dayOfEvent)) {
                document.getElementById("add_event_form").style.display = "none";
                document.getElementById("vines").style.position = "static";
                document.getElementById("form").reset();
            }
            else {
                alert("Unable to add event, maximum columns of three created for overlapping events.");
                eventDiv.remove();
            }
        }
    })
}

if (document.getElementById("cancel_button") != null) {
    document.getElementById("cancel_button").addEventListener("click", function() {
        document.getElementById("add_event_form").style.display = "none";
    })
}

// Creates the graphics in the h1 and footer of the HTML
function buildGraphics() {
    let junimoRow = document.createElement("img");
    junimoRow.src = "assets/junimos_row.png";
    junimoRow.alt = "Junimos standing in a row from Stardew Valley";
    junimoRow.id = "junimoRow";
    document.querySelector("h1").appendChild(junimoRow);
    
    let footer = document.createElement("footer");
    let bottomVines = document.createElement("img");
    bottomVines.src = "assets/vines.png";
    bottomVines.alt = "Pixelated art of vines";
    bottomVines.id = "vines";
    footer.appendChild(bottomVines);
    document.body.appendChild(footer);
}

// Builds the entire event form
function buildEventForm() {
    let eventForm = document.getElementById("add_event_form");
    let form = document.createElement("form")
    form.id = ("form");

    // Fun little graphics
    let juminoForm = document.createElement("img");
    juminoForm.src = "assets/jumino_form.png";
    juminoForm.alt = "Jumino holding up a star from Stardew Valley";
    juminoForm.id = ("juminoForm");
    form.appendChild(juminoForm);

    let chickenForm = document.createElement("img");
    chickenForm.src = "assets/chicken.png";
    chickenForm.alt = "Pixel art of a chicken from Stardew Valley";
    chickenForm.id = ("chickenForm");

    // Creating all input fields
    let name = buildTextInput("name", "Name of Event");
    let location = buildTextInput("location", "Location");
    let dayOfWeek = buildWeekdaySelect("dayOfWeek");
    let startTime = buildTimeSelect("startTime");
    let endTime = buildTimeSelect("endTime");

    form.appendChild(buildLabel("Name of Event"));
    form.appendChild(name);
    form.appendChild(buildLabel("Location"));
    form.appendChild(location);
    form.appendChild(buildLabel("Day of the Week"));
    form.appendChild(dayOfWeek);
    form.appendChild(buildLabel("Event Start Time"));
    form.appendChild(startTime);
    form.appendChild(buildLabel("Event End Time"));
    form.appendChild(endTime);

    let submitButton = buildButton("submit_event", "Submit Event Form");
    let cancelButton = buildButton("cancel_button", "Cancel");

    eventForm.appendChild(form);
    eventForm.appendChild(submitButton);
    eventForm.appendChild(cancelButton);
    form.appendChild(chickenForm);
}

// Creating and adding an HTML button
function buildButton(id, displayText) {
    let button = document.createElement("button");
    button.id = id;
    button.innerHTML = displayText;
    return button;
}

// Builds a text input HTML element with a specified class name
function buildTextInput(className, placeholder) {
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder;
    input.className = className;
    return input;
}

// Method to make label elements for the event form
function buildLabel(labelName) {
    let label = document.createElement("label");
    label.innerHTML = labelName;
    return label;
}

// Builds the day of the week select and options HTML of the event form
function buildWeekdaySelect(className) {
    let dayOfWeek = document.createElement("select");
    dayOfWeek.className = className;

    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (let i = 0; i < weekdays.length; i++) {
        let option = document.createElement("option");
        let currDay = weekdays[i];
        let textNode = document.createTextNode(currDay);
        let value = currDay.toLowerCase;
        option.setAttribute("value", value);
        option.appendChild(textNode);
        dayOfWeek.appendChild(option);
    }

    return dayOfWeek;
}

// Builds the start time and end time select and options HTML of the event form
function buildTimeSelect(className) {
    let timeArray = populateTimeArray();
    let timeSelect = document.createElement("select");
    timeSelect.className = className;

    for (let i = 0; i < timeArray.length; i++) {
        let option = document.createElement("option");
        let currTime = timeArray[i];
        let textNode = document.createTextNode(currTime);
        option.setAttribute("value", (i * 0.25));
        option.appendChild(textNode);
        timeSelect.appendChild(option);
    }

    return timeSelect;
}

// Helper method to populate an array of all times in a day in increments of 15 minutes
function populateTimeArray() {
    let timeArray = [];
    for (let i = 0; i < 96; i++) {
        let currTimeValue = (i * 0.25);
        let hours = Math.floor(currTimeValue);
        let minutes = 60 * (currTimeValue - hours);
        let currTime = convertMilitaryToStandard(hours, minutes);
        timeArray.push(currTime);
    }
    return timeArray;
}

// Helper method that converts from military time to standard time
function convertMilitaryToStandard(hours, minutes) {
    let dayNight;

    if (hours > 12) {
        hours = hours - 12;
        dayNight = " PM";
    }
    else if (hours == 12) {
        dayNight = " PM";
    }
    else if (hours == 0) {
        hours = 12;
        dayNight = " AM";
    }
    else {
        dayNight = " AM";
    }

    if (minutes == 0) {
        minutes = "00";
    }

    return currTime = hours + ":" + minutes + dayNight;
}

let gridColumn = 2;

// Method to determine EventItem positioning and height and checks for overlapping events
function positionEvent(eventItem, eventDiv, startTimeValue, endTimeValue, dayCol) {
    let eventDuration = (endTimeValue - startTimeValue) - 0.25;
    const timeValue = 23.5;
    const columnPad = 20;
    const columnHeight = 500;

    eventItem.createEvent(eventDiv);
    const heightStep = (document.getElementsByClassName("day-col")[0].offsetHeight - columnPad - eventDiv.offsetHeight) / timeValue;
    let height = eventDiv.offsetHeight + (eventDuration * heightStep);
    let eventStart = heightStep * startTimeValue;

    eventDiv.style.height = height + "px";
    eventDiv.style.top = eventStart + "px";

    // Testing to see if there is any overlap
    let overlappedEvents = testOverlap(dayCol, eventDiv);
    if(overlappedEvents.length > 0) {
        if (overlappedEvents.length < 3) {
            let column = getDayContent(dayCol);

            column.style.display = "grid";
            if ((overlappedEvents.length != 1 || gridColumn != 3)) {
                column.style.gridTemplateColumns = "repeat(" + gridColumn + ", 1fr)";
            }
            else if (overlappedEvents.length > 1) {
                column.style.gridTemplateColumns = "repeat(" + gridColumn + ", 1fr)";
            }

            if (gridColumn < 3) {
                gridColumn++;
            }

            eventDiv.style.position = "relative";
            fixRelativePosition(column, eventDiv, overlappedEvents, eventStart, heightStep);

            overlappedEvents.forEach(element => {
                element.style.position = "relative";
            });

            return true;
        }
        else {
            return false;
        }
    }
    return true;
}

/* This helper methods fixes the issue of an eventDiv turning from an absolute position to
a relative position, which shifts it incorrectly. So this methods aims to achieve the same
'top' attribute for the eventDiv when it was still an absolute position */
function fixRelativePosition(column, eventDiv, overlappedEvents, eventStart, heightStep) {
    const columnHeight = 500;
    const gridComputedStyle = window.getComputedStyle(column);
    let eventStartTime = eventStart;

    // Get number of grid rows
    const gridRowCount = gridComputedStyle.getPropertyValue("grid-template-rows").split(" ").length;
    const gridRowHeight = columnHeight / gridRowCount;

    // To fix the relative position of shifting div elements and all overlapping div elements in the current day column
    if (gridRowCount > 1) {
        let relativePositionFix = ((gridRowHeight * (gridRowCount - 1)) * -1) + eventStartTime;
        eventDiv.style.top = relativePositionFix + "px";

        overlappedEvents.forEach(element => {
            if (element.style.position != "relative") {
                let overlapEventStart = parseEventStart(element);
                eventStartTime = heightStep * overlapEventStart;
                relativePositionFix = ((gridRowHeight * (gridRowCount - 1)) * -1) + eventStartTime;
                element.style.top = relativePositionFix + "px";
            }
        });
    }
}

// Helper method to parse an event div to get its event start value
function parseEventStart(div) {
    let timeFrame = div.textContent;
    let eventTime = timeFrame.split(" - ");
    let start = eventTime[0];
    let options = document.getElementsByClassName("startTime")[0].children;
    let startValue;

    for (let i = 0; i < options.length; i++) {
        if (options[i].innerHTML == start) {
            startValue = options[i].value;
        }
    }

    return startValue;
}

// Helper method to specifically get the content div of a weekday
function getDayContent(dayToGet) {
    let daysOfWeek = document.querySelectorAll(".title");
    let content;
    for (let i = 0; i < daysOfWeek.length; i++) {
        if (daysOfWeek[i].textContent == dayToGet) {
            content = daysOfWeek[i].parentNode.childNodes[3];
        }
    }
    return content;
}

// Helper method to determine if any elements in a day column overlap based on the most recently added element and returns an array of any overlapped events
function testOverlap(dayOfWeek, recentEvent) {
    let eventItemsArr;
    let arrLen;
    let overlappedEvents = [];
    let overlap;

    eventItemsArr = getDayContent(dayOfWeek).childNodes;
    arrLen = eventItemsArr.length;

    for (let i = 0; i < arrLen; i++) {
        let currEvent = eventItemsArr[i];
        if (currEvent != recentEvent) {
            overlap = determineOverlap(recentEvent, currEvent);
            if (overlap) {
                overlappedEvents.push(currEvent);
            }
        }
    }
    return overlappedEvents;
}

// Helper method to determine if two divs are overlapping one another
function determineOverlap(divOne, divTwo) {
    rectOne = divOne.getBoundingClientRect();
    rectTwo = divTwo.getBoundingClientRect();

    let overlap = !(rectOne.right < rectTwo.left || 
        rectOne.left > rectTwo.right || 
        rectOne.bottom < rectTwo.top || 
        rectOne.top > rectTwo.bottom)

    return overlap;
}