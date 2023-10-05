import React, { useState, useEffect } from "react";

function AudioPlayer({ audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = document.getElementById("audio");

    // Load the audio source when the component mounts
    audioElement.src = audioUrl;

    // Handle audio play/pause when isPlaying state changes
    if (isPlaying) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }, [isPlaying, audioUrl]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio id="audio" controls>
        Your browser does not support the audio element.
      </audio>
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}

export default AudioPlayer;
