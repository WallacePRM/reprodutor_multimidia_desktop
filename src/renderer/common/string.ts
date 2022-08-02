export const hasSymbol = (str: string) => {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return format.test(str);
};

export const removeExtension = (str: string) => {
    return str.replace(/\.[^/.]+$/, "");
};

export const convertMediaType = (str: string) => {

    if (str.indexOf("audio") > -1) return 'music';
    else if (str.indexOf("video") > -1) return 'video';
    else return 'folder';
};

export const capitalizeFirstLetter = (str: string) => {

    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
};

export const removeMediaExt = (name: string) => {

    if (!name) return '';

    return name.replace(/\.[^/.]+$/, "");
};

export const adjustDark = (color: string, amount: number) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
};