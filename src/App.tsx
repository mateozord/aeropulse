import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { RouteLoading } from "./components/RouteLoading";
import { Home } from "./pages/Home";
import { useWeatherSignals } from "./features/weather/useWeatherSignals";
import { useTrafficSignals } from "./features/traffic/useTrafficSignals";
import { isFresh } from "./utils/freshness";
import { WEATHER_STALE_MINUTES } from "./utils/constants";

// Code-split routes that pull in heavy libraries (Recharts, a second MapLibre
// instance) so a visitor landing on "/" only downloads what Home needs.
const MapPage = lazy(() => import("./pages/MapPage").then((m) => ({ default: m.MapPage })));
const AirportsPage = lazy(() => import("./pages/AirportsPage").then((m) => ({ default: m.AirportsPage })));
const AirportDetail = lazy(() => import("./pages/AirportDetail").then((m) => ({ default: m.AirportDetail })));
const WarRoom = lazy(() => import("./pages/WarRoom").then((m) => ({ default: m.WarRoom })));
const Methodology = lazy(() => import("./pages/Methodology").then((m) => ({ default: m.Methodology })));
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

function App() {
  const weather = useWeatherSignals();
  const traffic = useTrafficSignals();
  const location = useLocation();
  const isWarRoom = location.pathname === "/war-room";

  const liveState = weather.lastUpdated === null
    ? "mock"
    : isFresh(weather.lastUpdated, WEATHER_STALE_MINUTES)
      ? "fresh"
      : "stale";

  return (
    <div className="min-h-screen bg-base">
      {!isWarRoom && <Header liveState={liveState} />}
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Home weather={weather} traffic={traffic} />} />
          <Route path="/map" element={<MapPage weather={weather} traffic={traffic} />} />
          <Route path="/airports" element={<AirportsPage weather={weather} traffic={traffic} />} />
          <Route path="/airports/:iata" element={<AirportDetail weather={weather} traffic={traffic} />} />
          <Route path="/war-room" element={<WarRoom weather={weather} traffic={traffic} />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
