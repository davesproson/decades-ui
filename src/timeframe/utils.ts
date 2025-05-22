/**
 * Get the current time in seconds
 * 
 * @returns The current time in seconds
 */
const nowSecs = () => {
    return Math.floor(new Date().getTime() / 1000)
}

/**
 * Get the start and end times for a given time frame
 * 
 * @param tf - The time frame to get the start and end times for
 * @returns The start and end times for the time frame
 */
const getTimeLims = (tf: string): [number, number] => {

    if (tf.includes(",")) {
        const times = tf.split(",")
        let startTime = parseInt(times[0])
        let endTime
        try {
            endTime = parseInt(times[1])
        } catch {
            endTime = nowSecs()
        }
        return [startTime, endTime]
    }

    const end = nowSecs()

    if (tf === 'all') {
        return [0, end]
    }

    let multiplier = 1
    if (tf.includes('h')) {
        multiplier = 60 * 60
    }
    if (tf.includes('m')) {
        multiplier = 60
    }

    tf = tf.replace(/[a-zA-Z]+/, '')

    const start = end - parseFloat(tf) * multiplier

    return [start, end]
}

export { getTimeLims, nowSecs }