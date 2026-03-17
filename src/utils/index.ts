export function createPageUrl(pageName: string) {
    // If the page is Home, always return the root slash
    if (pageName === 'Home') return '/';
    
    return '/' + pageName.replace(/ /g, '-');
}