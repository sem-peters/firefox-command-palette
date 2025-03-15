const resolution = () => {
    document.body.style.width = screen.availWidth / 4 + 'px';
    document.body.style.height = screen.availHeight / 4 + 'px';
}

export const configurePopup = () => {
    resolution();
}