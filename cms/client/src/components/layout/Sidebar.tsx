import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, FileText, Users, BookOpen, FlaskConical,
  Star, Image, BarChart3, Handshake, Rocket, Eye, Images,
} from 'lucide-react';

type NavSection = { section: string };
type NavItem = { to: string; icon: LucideIcon; label: string };

const NAV: (NavSection | NavItem)[] = [
  { section: 'Overview' },
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { section: 'Content' },
  { to: '/publications', icon: BookOpen, label: 'Publications' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/posts', icon: FileText, label: 'Posts' },
  { to: '/research', icon: FlaskConical, label: 'Research Areas' },
  { to: '/features', icon: Star, label: 'Features' },
  { to: '/gallery', icon: Images, label: 'Gallery' },
  { to: '/stats', icon: BarChart3, label: 'Stats Ticker' },
  { to: '/partners', icon: Handshake, label: 'Partners' },
  { section: 'System' },
  { to: '/images', icon: Image, label: 'Image Manager' },
  { to: '/preview', icon: Eye, label: 'Preview' },
  { to: '/deploy', icon: Rocket, label: 'Deploy' },
];

export function Sidebar() {
  return (
    <aside className="cms-sidebar">
      <div className="cms-sidebar__logo">
        ACUTE<span>Content Manager</span>
      </div>
      <nav>
        {NAV.map((item, i) => {
          if ('section' in item) {
            return (
              <div key={i} className="cms-sidebar__section">
                {item.section}
              </div>
            );
          }
          const navItem = item as NavItem;
          const Icon = navItem.icon;
          return (
            <NavLink
              key={navItem.to}
              to={navItem.to}
              end={navItem.to === '/'}
              className={({ isActive }) =>
                `cms-sidebar__link ${isActive ? 'cms-sidebar__link--active' : ''}`
              }
            >
              <Icon size={18} />
              {navItem.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
