import React, { useEffect, useState } from "react";
import { VideoDataEvent } from "../api/media/video/event.ts";
import { AlertContainer } from "./Alert.tsx";
import { HomePage } from "./pages/home/HomePage.tsx";
import { VideoPlayer } from "../components/media/VideoPlayer.tsx";

const homePage = <div className="w-full h-full">
  <HomePage></HomePage>
  <VideoPlayer />
</div>;

function App(): React.JSX.Element {
  const [ page, setPage ] = useState<React.JSX.Element>(<div></div>);
  
  useEffect(() => {
    setPage(homePage);
  }, []);

  return (
    <div className="bg-gray-100 w-full h-full">
      { page }
      
      <AlertContainer />
    </div>
  );
}

export default App;