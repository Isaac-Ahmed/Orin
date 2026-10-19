export function currentDate(){
    const now = new Date();
    return now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
}

export function currentTime(){
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return hours + ":" + minutes + ":" + seconds;
}

export function currentYear(){
    const now = new Date();
    return now.getFullYear();
}

export function currentMonth(){
    const now = new Date();
    return now.getMonth() + 1;
}

export function currentDay(){
    const now = new Date();
    return now.getDate();
}

export function currentHour(){
    const now = new Date();
    return now.getHours();
}

export function currentMinute(){
    const now = new Date();
    return now.getMinutes();
}

export function currentSecond(){
    const now = new Date();
    return now.getSeconds();
}

export function getWeekDay(){
    const now = new Date();
    switch(now.getDay()){
        case 0: return "Sunday";
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
        default: return "Unknown";
    }
}