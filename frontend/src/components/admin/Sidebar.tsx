// AdminShell · Sidebar
//
// Dark persistent left rail with navigation groups. Follows the Data
// Dashboard mockup (design/mockups/03-data-dashboard) and CLAUDE.md
// visual-identity notes.
//
// Groups:
//   - Workspace  → Home overview / New assessment / My cases / Recent results
//   - Reports    → Stakeholder views / Regional dashboard
//   - System     → Settings / About (Scoring queue will land in a later phase)
//
// The sidebar footer surfaces the mandatory EU / GA reference so it is
// visible without scrolling to the very bottom of the page.

import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface NavItem {
  to: string
  label: string
  glyph: string
  end?: boolean
}

interface NavGroup {
  title: string
  items: NavItem[]
}

export default function Sidebar() {
  const { t } = useTranslation()

  const groups: NavGroup[] = [
    {
      title: t('adminShell.groups.workspace'),
      items: [
        { to: '/', label: t('adminShell.nav.home'), glyph: '⌂', end: true },
        { to: '/questionnaire', label: t('adminShell.nav.questionnaire'), glyph: '≡' },
        { to: '/cases', label: t('adminShell.nav.cases'), glyph: '▤' },
        { to: '/result', label: t('adminShell.nav.recentResult'), glyph: '◷' },
      ],
    },
    {
      title: t('adminShell.groups.reports'),
      items: [
        { to: '/stakeholder-report', label: t('adminShell.nav.stakeholder'), glyph: '⊞' },
        { to: '/aggregate', label: t('adminShell.nav.aggregate'), glyph: '⊠' },
        { to: '/data-collection', label: t('adminShell.nav.dcf'), glyph: '↓' },
      ],
    },
    {
      title: t('adminShell.groups.system'),
      items: [
        { to: '/about', label: t('adminShell.nav.about'), glyph: 'ⓘ' },
      ],
    },
  ]

  return (
    <aside className="dd-sidebar" aria-label="Primary navigation">
      <div className="dd-sidebar-brand">
        <div className="dd-sidebar-brand-mark" aria-hidden="true">S</div>
        <div className="dd-sidebar-brand-text">
          <span className="dd-sidebar-brand-name">SYMBA</span>
          <span className="dd-sidebar-brand-sub">T4.6 · Monitoring &amp; Reporting</span>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.title} className="dd-sidebar-group">
          <div className="dd-sidebar-group-title">{group.title}</div>
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? 'dd-sidebar-link dd-sidebar-link-active'
                  : 'dd-sidebar-link'
              }
            >
              <span className="dd-sidebar-glyph" aria-hidden="true">{item.glyph}</span>
              <span className="dd-sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      ))}

      <div className="dd-sidebar-foot">
        <span aria-hidden="true">🇪🇺</span>{' '}
        {t('adminShell.footerGa')} <a href="https://www.symbaproject.eu" target="_blank" rel="noopener noreferrer">101135562</a>
        <div className="dd-sidebar-foot-meta">{t('adminShell.footerProgramme')}</div>
      </div>
    </aside>
  )
}
