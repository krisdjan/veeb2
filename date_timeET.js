const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];

const timeNowET = function() {
    let timeatm = new Date();
    return timeatm.getHours() + ":" + timeatm.getMinutes() + ":" + timeatm.getSeconds();
}

const dateNowET = function() {
    let dateNow = new Date();
    return dateNow.getDate() + ". " + monthNamesET[dateNow.getMonth()] + " " + dateNow.getFullYear();
}

const timeOfDayET = function() {
    let dayPart = "suvaline aeg";
    const hourNow = new Date().getHours();

    if (hourNow > 6 && hourNow <= 11) {
        dayPart = "hommik";
    }  else if (hourNow >= 12 && hourNow <= 14) {
        dayPart = "keskpäev";
    } else if (hourNow >= 14 && hourNow <= 18) {
        dayPart = "pärast lõuna";
    } else {
        dayPart = "õhtu";
    }

    return dayPart;
}

module.exports = {dateNowET: dateNowET, timeNowET: timeNowET, monthsET: monthNamesET, timeOfDayET: timeOfDayET};