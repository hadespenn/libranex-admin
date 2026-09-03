import { Routes, Route, Navigate } from 'react-router-dom';
import ProLayout from './layouts/ProLayout';
import Overview from './pages/Overview';
import KycQueue from './pages/KycQueue';
import RiskCases from './pages/RiskCases';
import TxReview from './pages/TxReview';
import Transactions from './pages/Transactions';
import Customers from './pages/Customers';
import Tickets from './pages/Tickets';
import Settlement from './pages/Settlement';
import Rules from './pages/Rules';
import Channels from './pages/Channels';
import Reports from './pages/Reports';
import Config from './pages/Config';

export default function App() {
  return (
    <Routes>
      <Route element={<ProLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/kyc" element={<KycQueue />} />
        <Route path="/risk" element={<RiskCases />} />
        <Route path="/tx-review" element={<TxReview />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/settlement" element={<Settlement />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/config" element={<Config />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Route>
    </Routes>
  );
}
