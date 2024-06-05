export const smoothScrollToElementById = (id: string, waitFor?: number) => {
    const element = document.getElementById(id);

    if (element) {
        setTimeout(() => {
            window.scroll({
                top: element.offsetTop,
                behavior: 'smooth'
            });
        }, 1000 * (waitFor ?? 0));   
    }
};
