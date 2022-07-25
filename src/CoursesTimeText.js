
const daysMap = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function getTimeText(courseTimes) {
    let timesMap = {};
    for (const time of courseTimes) {
        if (!(time.startHour in timesMap)) {
            timesMap[time.startHour] = {days: [], endHour: time.endHour};
        }
        timesMap[time.startHour].days.push(daysMap[time.day]);
    }
    return Object.keys(timesMap).map((startHour) =>{
        return timesMap[startHour].days.join(', ').concat(` ${startHour}-${timesMap[startHour].endHour}`)
    }).join('; ');
}