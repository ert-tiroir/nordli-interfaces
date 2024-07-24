import React from "react";
import { VideoDataEvent } from "../api/media/video/event.ts";
import { AlertContainer } from "./Alert.tsx";

function App(): React.JSX.Element {
  return (
    <div className="bg-gray-100 w-full h-full">
      <AlertContainer />
    </div>
  );
}

export default App;