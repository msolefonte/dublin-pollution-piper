export function normalizeTimestamp(timestamp: string): string {
    if (timestamp[timestamp.length- 1] == "Z") {
        timestamp += "+00:00"
    }
    return timestamp
}


export function normalizeTimestampDBFormat(timestamp: string): string {
    if (timestamp[16] === "T" || timestamp[16] === "Z") {
        return timestamp.substring(0.16).replace("T", " ")
    } else {
        return timestamp.substring(0.19).replace("T", " ")
    }
}

export function normalizeTimestampHTTPFormat(timestamp: string): string {
    return timestamp.replace("+", "%2B")
}
