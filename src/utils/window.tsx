export const smoothScrollToElementById = (id: string) => {
    const element = document.getElementById(id);

    if (element) {        
        window.scroll({
            top: element.offsetTop,
            behavior: 'smooth'
        });
    }
};
