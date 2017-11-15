export class Item {
    data: string;
    dataSort: string; // use to sort the table
    isResponsive = false;

    isTranslatable = false;
    actions = [];

    type = 'text'; // svg, img, url, html, function or text
    config = null;
    classRow: string = null;
    translatableRow: boolean = false;
    multirows: any[] = [];
    contextRow: any;
    target: string;
    key: any;
    styleCell: any;

    constructor(data) {
        this.data = data;
    }
}