function ProgressBar({ progressBarRef, audioRef, timeProgress, duration }) {
    const handleProgressChange = () => {
        // console.log(progressBarRef.current.value);
        audioRef.current.currentTime = progressBarRef.current.value;
    };

    //   converting time
    const formatTime = (time) => {
        if (time && !isNaN(time)) {
            const minutes = Math.floor(time / 60);
            const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
            const seconds = Math.floor(time % 60);
            const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${formatMinutes}:${formatSeconds}`;
        }
        return "00:00";
    };
    return (
        <div className="progress">
            {/* time Procession */}
            {/* <span className="time current">{formatTime(timeProgress)}</span> */}
            <input
                type="range"
                ref={progressBarRef}
                defaultValue="0"
                onChange={handleProgressChange}
                className="appearance-none w-full 
                overflow-hidden bg-gray-600 h-1 rounded-lg focus:outline-none range-slider"
            />
            <div className="time">{formatTime(duration)}</div>
        </div>
    );
}

export default ProgressBar;
