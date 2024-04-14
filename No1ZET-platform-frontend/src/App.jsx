import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { WalletContextProvider } from "./components/WalletContextProvider";
import ThemeProvider from "./components/ThemeProvider";
import "@solana/wallet-adapter-react-ui/styles.css";
import BaseLayout from "./pages/layout/BaseLayout";
import Mainboard from "./pages/Dashboard/dashboard";
import VestingPage from "./pages/vesting/vesting";
import StakingPage from "./pages/staking/staking";
import Poolcreation from "./pages/creatpool/creatpool";
import SendPage from "./pages/send/send";
import SettingPage from "./pages/setting/setting";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ThemeProvider>
        <WalletContextProvider>
          <Routes>
            <Route element={<BaseLayout />}>
              <Route path="/" element={<Mainboard />} />
              <Route path="/dashboard" element={<Mainboard />} />
              <Route path="/vesting" element={<VestingPage />} />
              <Route path="/staking" element={<StakingPage />} />
              <Route path="/poolcreation" element={<Poolcreation />} />
              <Route path="/send" element={<SendPage />} />
              <Route path="/setting" element={<SettingPage />} />
            </Route>
          </Routes>
          <ToastContainer />
        </WalletContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
