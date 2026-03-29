import { Route, Routes } from 'react-router-dom';

import { DrawPage } from '../pages/DrawPage';

interface AppRoutesProps {
  searchRequestToken?: number;
}

export function AppRoutes({ searchRequestToken = 0 }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<DrawPage searchRequestToken={searchRequestToken} />} />
    </Routes>
  );
}
