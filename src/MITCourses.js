import {hourFormat} from "./Consts";
import moment from "moment";


const days = {
    M: 0,
    T: 1,
    W: 2,
    R: 3,
    F: 4,
}

const timeRegex = '([MTWRF]+) ?( EVE \\()?([0-9]+\\.?:?[0-9]*)-?([0-9]+\\.?[0-9]*)?';

function parseHourString(hourString) {
    const hour = moment(hourString, 'hh.mm');
    if (hour.hour() < 8) {
        hour.add(12, 'hours');
    }
    return hour;
}

export function parseCourseTime(timeStr) {
    const times = timeStr.split(",");
    return times.map(time => {
            const match = time.match(timeRegex);
            const courseDays = match[1].split("");
            const startTime = parseHourString(match[3]).format(hourFormat);
            const endTime = (match[4] === undefined ?
                parseHourString(match[3]).add(1, "hour") :
                parseHourString(match[4]))
                .format(hourFormat);

            return courseDays.map((day) => (
                {
                    day: days[day],
                    startHour: startTime,
                    endHour: endTime
                }
            ));
        }
    ).flat();
}