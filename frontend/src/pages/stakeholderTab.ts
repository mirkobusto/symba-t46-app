// Which audience tab a given role lands on.
//
// Its own module because the page may only export components: a page
// that also exports a helper breaks fast refresh (eslint
// react-refresh/only-export-components), and the test imports the helper
// directly rather than rendering the page to find out.

import type { StakeholderType } from '../components/StakeholderView'
import type { UserRole } from '../store/preferenceStore'

const ROLE_TAB: Partial<Record<UserRole, StakeholderType>> = {
  industry: 'industry',
  community: 'community',
  authority: 'authority',
  enduser: 'end-user',
}

/** The tab a given role should land on; analysts and undeclared users
 * get the technical one. */
export function tabForRole(role: UserRole | null): StakeholderType {
  return (role && ROLE_TAB[role]) || 'industry'
}
