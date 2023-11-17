import React from "react";
import { usePlaylist } from "../../context/playlistProviderContext";

interface MusicProps {
    currentTrack:
        | {
              track: string | undefined;
              author: string | undefined;
              title: string | undefined;
          }
        | undefined;
    setCurrentTrack: React.Dispatch<
        React.SetStateAction<
            | {
                  track: string | undefined;
                  author: string | undefined;
                  title: string | undefined;
                  coverArt: string | undefined;
              }
            | undefined
        >
    >;
    audioRef: React.RefObject<HTMLAudioElement>;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    progressBarRef: React.RefObject<HTMLInputElement>;
    togglePlayPause: () => void;
}

const Music: React.FC<MusicProps> = ({
    currentTrack,
    setCurrentTrack,
    audioRef,
    setDuration,
    progressBarRef,
    togglePlayPause
}) => {
    const onLoadedMetadata = () => {
        const seconds = audioRef.current?.duration || 0;
        setDuration(seconds);
        progressBarRef.current!.max = String(seconds);
    };

    const { PlayList, removeFromPlaylist } = usePlaylist();
    return (
        <div className="p-2">
            <audio
                src={currentTrack?.track}
                ref={audioRef}
                onLoadedMetadata={onLoadedMetadata}
                autoPlay={true}
                onEnded={() => {
                    if (PlayList?.length === 0) {
                        setCurrentTrack(undefined);
                        togglePlayPause();
                    } else {
                        removeFromPlaylist();
                    }
                }}
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
};

export default Music;
