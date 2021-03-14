let config = null;
function getEvents(player) {
  new Thread(() => {
    let size = Player.getOpenedInventory().getSize();
    //ChatLib.chat(size)
    ChatLib.command(`events`);
    Thread.sleep(250);
    readConfig();
    config.eventsList = [];
    for (i = 0; i < size; i++){
        let eventItem = Player.getOpenedInventory().getStackInSlot(i);
        let timeNow = Date.now();
        let SEC_TO_MILLISEC = 1000;
        let MIN_TO_SEC = 60
        let HR_TO_MIN = MIN_TO_SEC;
        let DAY_TO_HR = 24;
        eventItem.getLore().forEach((item, i) => {
          if((item.replace(/(§[a-z0-9])+/g,"").substring(0,1)) == "+"){
            try {
              let majorEvent = false;
              //ChatLib.chat(eventItem.getLore().length);
              if (i == (eventItem.getLore().length - 3)){
                majorEvent = true;
              }
              let timeStamp = item.split(": ")[0].replace(/(§[a-z0-9])+/g,"").substring(1);
              let fullTimeStamp = 0;
              let eventName = "";
              let millisecs = 0;
              if (timeStamp.includes("d")){
                let day = Number.parseInt(timeStamp.split("d")[0]);
                let hr = Number.parseInt(timeStamp.split("d")[1].substring(0,3));
                eventName = item.split(": ")[1];
                //ChatLib.chat(`Time: ${timeStamp} Day: ${day} Hr: ${hr} Event: ${eventName}`);
                hr += day * DAY_TO_HR;
                millisecs = hr * HR_TO_MIN * MIN_TO_SEC * SEC_TO_MILLISEC
                //fullTimeStamp = timeNow + (((day * DAY_TO_HR) + hr) * HR_TO_MIN * MIN_TO_SEC * SEC_TO_MILLISEC);
                //ChatLib.chat(fullTimeStamp);
              } else {
                let hr = Number.parseInt(timeStamp.split("h")[0]);
                let min = Number.parseInt(timeStamp.split("h")[1].substring(0,3));
                eventName = item.split(": ")[1];
                //ChatLib.chat(`Time: ${timeStamp} Hr: ${hr} Min: ${min} Event: ${eventName}`);
                min += hr * HR_TO_MIN;
                millisecs = min * MIN_TO_SEC * SEC_TO_MILLISEC
                //fullTimeStamp = timeNow + ((((hr * HR_TO_MIN) + min) * MIN_TO_SEC * SEC_TO_MILLISEC);
                //ChatLib.chat(fullTimeStamp);
              }
              //ChatLib.chat(majorEvent);
              config.eventsList.push({name: eventName, timeStamp: (timeNow + millisecs), major: majorEvent});
              //ChatLib.chat(config.eventsList.length);
            } catch (e) {
              ChatLib.chat(e);
            }
          }
          //ChatLib.chat(item)
        });
        gettingEvents = false;
    }
    saveConfig();
  }).start();
};

function upcomingEvents(){
  let NUM_EVENTS_TO_SHOW = 6;
  for(let i = 0; i < NUM_EVENTS_TO_SHOW; i++){
    let currentEvent = config.eventsList[i];
    let timeNow = Date.now();
    ChatLib.chat(currentEvent.timeStamp - timeNow);
    let timeUntilEvent = convertMiliseconds((currentEvent.timeStamp - timeNow), '');
    let eventString = ""
    if (currentEvent.major){
      eventString = eventString + "&eMajor &f-"
    } else {
      eventString = eventString + "&6Minor &f-"
    }
    let timeString = ""
    if (timeUntilEvent.d > 0){
      timeString = timeString + ` ${timeUntilEvent.d}d `;
    }
    if (timeUntilEvent.h > 0){
      timeString = timeString + ` ${timeUntilEvent.h}h `;
    }
    if (timeUntilEvent.m > 0){
      timeString = timeString + ` ${timeUntilEvent.m}m`;
    }
    ChatLib.chat(`&f[${eventString} ${currentEvent.name} ${timeString}&f]`)
  }
}

register("renderOverlay", myRenderOverlay);
//var myTextObject = new Text(`Testing §11 §22 §33`, 10, 30).setColor(Renderer.RED).setShadow(false).setScale(1.5);

let xPos = 100;
let yPos = 100;
let gettingEvents = false;
var myTextObject = new Text(`Testing §11 §22 §33`, 10, 30).setColor(Renderer.RED).setShadow(false).setScale(1);
function myRenderOverlay() {
  try {
    if (config == null) return;
    //ChatLib.chat(config.eventsList.length);
        let NUM_EVENTS_TO_SHOW = 6;
    if (config.eventsList.length <= NUM_EVENTS_TO_SHOW){
      if (gettingEvents == false){
          getEvents();
          gettingEvents = true;
      }
    }
    let x = config.x;
    let y = config.y;
    let timeNow = Date.now();
    config.eventsList.forEach((item, i) => {
      if(item.timeStamp < timeNow){
        config.eventsList.splice(i, 1);
      }
    });
    for(let i = 0; i < NUM_EVENTS_TO_SHOW; i++){
      if (i < (config.eventsList.length - 1)){
        let currentEvent = config.eventsList[i];
        let timeUntilEvent = convertMiliseconds((currentEvent.timeStamp - timeNow), '');
        let eventString = ""
        if (currentEvent.major){
          eventString = eventString + "§eMajor §f-"
        } else {
          eventString = eventString + "§6Minor §f-"
        }
        let timeString = ""
        if (timeUntilEvent.d > 0){
          timeString = timeString + `§f ${timeUntilEvent.d}§e d `;
        }
        if (timeUntilEvent.h > 0){
          timeString = timeString + `§f ${timeUntilEvent.h}§e h `;
        }
        if (timeUntilEvent.m > 0){
          timeString = timeString + `§f ${timeUntilEvent.m}§e m`;
        } else {
          timeString = timeString + `§f Now`;
        }
        myTextObject.setX(x).setY(y).setString(`§f[${eventString} ${currentEvent.name} ${timeString}§f]`)
        drawBold(myTextObject);
        y += 10;
      } else {
        myTextObject.setX(x).setY(y).setString(`§c[OUT OF EVENTS]`)
        drawBold(myTextObject);
        y += 10;
      }
    }
  } catch (e) {
    ChatLib.chat(e)
  }
};

function convertMiliseconds(miliseconds, format) {
  var days;
  var hours;
  var minutes;
  var seconds;
  var total_hours;
  var total_minutes;
  var total_seconds;

  total_seconds = parseInt(Math.floor(miliseconds / 1000));
  total_minutes = parseInt(Math.floor(total_seconds / 60));
  total_hours = parseInt(Math.floor(total_minutes / 60));
  days = parseInt(Math.floor(total_hours / 24));

  seconds = parseInt(total_seconds % 60);
  minutes = parseInt(total_minutes % 60);
  hours = parseInt(total_hours % 24);

  switch(format) {
	case 's':
		return total_seconds;
	case 'm':
		return total_minutes;
	case 'h':
		return total_hours;
	case 'd':
		return days;
	default:
		return { d: days, h: hours, m: minutes, s: seconds };
  }
};

register('command', () => {
  upcomingEvents();
}).setName(`upcomingevents`);

register('command', (command) => {
  if (command == "get"){
    getEvents();
  } else if (command == "show"){
    upcomingEvents();
  } else {
    eventsGui.open();
  }
}).setName(`betterevents`);

function drawBold(text) {
  let borderSize = text.getScale();
  if (ChatLib.removeFormatting(Scoreboard.getTitle()) !== "THE HYPIXEL PIT") return;
  let x = text.getX();
  let y = text.getY();
  let darkText = new Text(text.getString().replace(/(§[a-z0-9])+/g,""), x, y).setColor(Renderer.BLACK).setScale(text.getScale());
  darkText.setColor(Renderer.BLACK);
  darkText.setX(x+borderSize).setY(y).draw();
  darkText.setX(x-borderSize).setY(y).draw();
  darkText.setX(x).setY(y+borderSize).draw();
  darkText.setX(x).setY(y-borderSize).draw();
  darkText.setX(x).setY(y);
  text.draw();
}

//Defining a bunch of global variables
var globalMouseX = 0;
var globalMouseY = 0;
var offsetX = 0;
var offsetY = 0;

//Creating GUI to allow user to move cursor
var eventsGui = new Gui()

eventsGui.registerMouseDragged(eventsDragFunction);
function eventsDragFunction(mouseX, mouseY) {
    readConfig();
    //Saves mouse coordinates into persistent data to store location of UI
    config.x = mouseX
    config.y = mouseY

    //Saves mouse coordinates into global variable
    globalMouseX = mouseX;
    globalMouseY = mouseY;



    //Complicated algorithm to save screen position even when screen size changes
    if (mouseX < Renderer.screen.getWidth() / 2 ) {
        offsetX = mouseX;
    }
    else {
        offsetX = Renderer.screen.getWidth() - mouseX
    }

    if (mouseY < Renderer.screen.getHeight() / 2) {
        offsetY = mouseY
    }
    else {
        offsetY = Renderer.screen.getHeight() - mouseY
    }
    saveConfig();
}

const readConfig = () => {
        try {
            config = JSON.parse(FileLib.read('./config/ChatTriggers/modules/BetterEventInfo/config.json'));
            if (!config) {
              config = {
                  x: 100,
                  y: 100,
                  eventsList: []
                };
            }
        } catch (e) {
            config = {
              x: 100,
              y: 100,
              eventsList: []
            };
        }
};

readConfig();

const saveConfig = () => {
    FileLib.write('./config/ChatTriggers/modules/BetterEventInfo/config.json', JSON.stringify(config, null, 2));
}
