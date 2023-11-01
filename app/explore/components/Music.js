function Music({ currentTrack, audioRef, setDuration, progressBarRef }) {
    const onLoadedMetadata = () => {
        const seconds = audioRef.current.duration;
        setDuration(seconds);
        progressBarRef.current.max = seconds;
    };
    return (
        <div className="p-2">
            <audio
                src={currentTrack?.track}
                ref={audioRef}
                onLoadedMetadata={onLoadedMetadata}
                autoPlay={true}
            />
            <div className="audio-info">
                {/* <div className="audio-image">
                    {currentTrack.thumbnail ? (
                        <img src={currentTrack.thumbnail} alt="audio cover" className='w-1/2' />
                    ) : (
                        <div className="icon-wrapper">
                            <span className="audio-icon">not found</span>
                        </div>
                    )}
                </div> */}
                <div className="text">
                    <p className="title">{currentTrack?.title}</p>
                    <p className="text-[13.336px] text-[#909090]">
                        {currentTrack?.author}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Music;
