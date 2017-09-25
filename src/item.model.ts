export class Item {
    data: string;
    isResponsive = false;

    isTranslatable = false;
    actions = [];

    type = 'text'; // svg, img, url, html, function or text
    config = null;
    classRow: string = null;
    multirows: any[] = [];

    constructor(data) {
        this.data = data;
    }
}