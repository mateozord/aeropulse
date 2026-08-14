import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { RouteLoading } from "./components/RouteLoading";
import { Home } from "./pages/Home";
import { Placeholder } from "./pages/Placeholder";
import { useWeatherSignals } from "./features/weather/useWeatherSignals";
import { useTrafficSignals } from "./features/traffic/useTrafficSignals";

// Code-split routes that pull in heavy libraries (Recharts, a second MapLibre
// instance) so a visitor landing on "/" only downloads what Home needs.
const AirportDetail = lazy(() => import("./pages/AirportDetail").then((m) => ({ default: m.AirportDetail })));
const WarRoom = lazy(() => import("./pages/WarRoom").then((m) => ({ default: m.WarRoom })));
const Methodology = lazy(() => import("./pages/Methodology").then((m) => ({ default: m.Methodology })));

function App() {
  const weather = useWeatherSignals();
  const traffic = useTrafficSignals();
  const location = useLocation();
  const isWarRoom = location.pathname === "/war-room";

  return (
    <div className="min-h-screen bg-base">
      {!isWarRoom && <Header live={weather.lastUpdated !== null} />}
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Home weather={weather} traffic={traffic} />} />
          <Route
            path="/map"
            element={<Placeholder title="Map" note="Full map view coming in a later phase." />}
          />
          <Route
            path="/airports"
            element={<Placeholder title="Airports" note="Airport list coming in a later phase." />}
          />
          <Route path="/airports/:iata" element={<AirportDetail weather={weather} traffic={traffic} />} />
          <Route path="/war-room" element={<WarRoom weather={weather} traffic={traffic} />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route
            path="/about"
            element={<Placeholder title="About" note="AeroPulse is an experimental aviation intelligence platform. It does not predict delays, cancellations, or official operations." />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
