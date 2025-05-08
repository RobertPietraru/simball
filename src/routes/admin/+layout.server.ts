import * as m from '$lib/paraglide/messages.js';

export const load = async ({ locals, url }) => {
    let path = url.pathname;
    console.log(path);
    const sections = path.split('/')
    const crumbs = []
    while (sections.length) {
        
        const section = sections.pop()!;

        if (section.length === 0) continue;

        const path = '/' + sections.join('/')
        if (section === 'admin') {
            crumbs.push({
                label: m.admin_breadcrumbs_admin(),
                href: path
            })
        } else if (section === 'users') {
            crumbs.push({
                label: m.admin_breadcrumbs_users(),
                href: path
            })
        } else if (section === 'words') {
            crumbs.push({
                label: m.admin_breadcrumbs_words(),
                href: path
            })
        } else if (section === 'sources') {
            crumbs.push({
                label: m.admin_breadcrumbs_sources(),
                href: path
            })
        }
    }
    return {
        crumbs: crumbs.reverse()
    };
};