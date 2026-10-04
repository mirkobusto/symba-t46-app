// Links back to the SYMBA project website (https://www.symbaproject.eu/),
// of which this tool is a subdomain deployment. Labels are i18n keys; the
// URLs are the ones the website's own menu and footer use.

export const SITE_URL = 'https://www.symbaproject.eu/'

/** Top-level entries of the website menu, in the website's order. */
export const SITE_NAV: readonly { key: string; href: string }[] = [
  { key: 'about', href: `${SITE_URL}about-us/` },
  { key: 'project', href: `${SITE_URL}objectives/` },
  { key: 'partners', href: `${SITE_URL}about-us/partners/` },
  { key: 'news', href: `${SITE_URL}category/news/` },
  { key: 'download', href: `${SITE_URL}downloads-project/` },
  { key: 'contact', href: `${SITE_URL}contact-us/` },
]

/** Where the public deliverables (D4.6 is one) are listed on the website. */
export const PUBLIC_DELIVERABLES_URL = `${SITE_URL}downloads/public-deliverables/`

export const PRIVACY_URL = `${SITE_URL}privacy-policy/`
export const COOKIES_URL = `${SITE_URL}cookie-policy/`

/** The project's own social accounts, as linked in the website footer. */
export const SOCIAL_LINKS: readonly { key: string; label: string; href: string }[] = [
  { key: 'x', label: 'X', href: 'https://x.com/SYMBAEUProject' },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/symba-eu-project/',
  },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@SYMBAEUProject' },
]
