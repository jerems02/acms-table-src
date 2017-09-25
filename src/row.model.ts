export class Row {
    data: string;
    isTranslatable = false;
    type = 'text'; // svg, img, url, html, function or text
    config = null;

    constructor(data) {
        this.data = data;
    }
}