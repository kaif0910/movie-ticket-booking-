const generateSeats = (rows) => {
    const seats = [];
    for (const row of rows) {
        for (let i = 1; i <= row.seatCount; i++) {
            seats.push({
            seatId: `${row.rowLabel}${i}`,
            type: row.seatType
            });
        }
    }  
    return seats;
};

module.exports = {
    generateSeats
}
