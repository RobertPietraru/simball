import * as m from '$lib/paraglide/messages.js';
import { languageTag } from '$lib/paraglide/runtime';

export const load = async ({ locals, url, params }) => {
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
        } else if (section === 'words') {
            crumbs.push({
                label: m.contributor_breadcrumbs_words(),
                href: path
            })
        } else if (section === 'sources') {
            crumbs.push({
                label: m.contributor_breadcrumbs_sources(),
                href: path
            })
        } else if (section === 'source') {
            crumbs.push({
                label: m.contributor_breadcrumbs_sources(),
                href: path
            })
        } else if (section === params.source_id) {
            crumbs.push({
                label: m.contributor_breadcrumbs_source_id(),
                href: path
            })
        } else if (section === 'create') {
            crumbs.push({
                label: m.contributor_breadcrumbs_create(),
                href: path
            })
        }

    }
    const result = crumbs.reverse();
    return {
        crumbs: result
    };
};