import * as m from '$lib/paraglide/messages.js';
import { languageTag } from '$lib/paraglide/runtime';

export const load = async ({ locals, url }) => {
    const crumbs = []
    const language = languageTag();
    const sections = url.pathname.split('/').filter(e => e !== '' && e !== language);
    while (sections.length) {
        const path = '/' + sections.join('/');
        const section = sections.pop()!;
        if (section === 'contributor') {
            crumbs.push({
                label: m.contributor_breadcrumbs_contributor(),
                href: path
            })
        }  else if (section === 'words') {
            crumbs.push({
                label: m.contributor_breadcrumbs_words(),
                href: path
            })
        } else if (section === 'sources') {
            crumbs.push({
                label: m.contributor_breadcrumbs_sources(),
                href: path
            })
        }
    }
    return {
        crumbs: crumbs.reverse()
    };
};