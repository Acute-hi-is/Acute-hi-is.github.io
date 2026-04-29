import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/shared/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { PublicationsPage } from './pages/PublicationsPage';
import { TeamPage } from './pages/TeamPage';
import { PostsPage } from './pages/PostsPage';
import { ResearchPage } from './pages/ResearchPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { GalleryPage } from './pages/GalleryPage';
import { StatsPage } from './pages/StatsPage';
import { PartnersPage } from './pages/PartnersPage';
import { ImagesPage } from './pages/ImagesPage';
import { PreviewPage } from './pages/PreviewPage';
import { DeployPage } from './pages/DeployPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="cms-layout">
        <Sidebar />
        <main className="cms-main">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/images" element={<ImagesPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/deploy" element={<DeployPage />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </BrowserRouter>
  );
}
