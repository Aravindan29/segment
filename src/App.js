import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SegmentScreen from "./Segment/segmentScreen";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SegmentScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
