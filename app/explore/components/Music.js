function Music({ currentTrack, audioRef, setDuration, progressBarRef }) {
    const onLoadedMetadata = () => {
        const seconds = audioRef.current.duration;
        setDuration(seconds);
        progressBarRef.current.max = seconds;
    };
    return (
        <div>
            <audio
                src={currentTrack.src}
                ref={audioRef}
                onLoadedMetadata={onLoadedMetadata}
            />
            <div className="audio-info">
                <div className="audio-image">
                    {/* {currentTrack.thumbnail ? (
                        <img src={currentTrack.thumbnail} alt="audio cover" className='w-1/2' />
                    ) : (
                        <div className="icon-wrapper">
                            <span className="audio-icon">not found</span>
                        </div>
                    )} */}
                </div>
                <div className="text">
                    <p className="title">{currentTrack.title}</p>
                    <p>{currentTrack.author}</p>
                </div>
            </div>
        </div>
    );
}

export default Music;