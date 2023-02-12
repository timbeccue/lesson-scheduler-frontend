
const utils = {
    minutesToHHMM(minutesPastMidnight) {
        minutesPastMidnight %= 1440 // reduce to < 24hrs

        let m = minutesPastMidnight % 60
        let hr = (minutesPastMidnight - m) / 60
        if (m < 10) { m = "0" + m }

        let ampm = minutesPastMidnight >= 720 ? "pm" : "am"
        hr %= 12            // convert to 12 hr time
        hr += hr ? 0 : 12   // add 12 if hr is 0

        return `${hr}:${m} ${ampm}`
    },
    getColor() {
        return "hsl(" + 360 * Math.random() + ',' +
                (25 + 70 * Math.random()) + '%,' +
                (85 + 10 * Math.random()) + '%)'
    },
}

export default utils