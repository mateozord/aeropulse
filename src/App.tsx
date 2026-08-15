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
            element={<Placeholder title="Mapa" note="Visão de mapa completa chegando numa fase futura." />}
          />
          <Route
            path="/airports"
            element={<Placeholder title="Aeroportos" note="Lista de aeroportos chegando numa fase futura." />}
          />
          <Route path="/airports/:iata" element={<AirportDetail weather={weather} traffic={traffic} />} />
          <Route path="/war-room" element={<WarRoom weather={weather} traffic={traffic} />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route
            path="/about"
            element={<Placeholder title="Sobre" note="O AeroPulse é uma plataforma experimental de inteligência em aviação. Ele não prevê atrasos, cancelamentos ou operações oficiais." />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
