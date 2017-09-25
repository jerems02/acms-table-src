import {Component, OnInit, OnChanges, Input} from "@angular/core";


@Component({
    selector: 'acms-data',
    templateUrl: './acms-data.component.html',
    styleUrls: ['./acms-data.component.css'],
})

export class DataComponent implements OnInit, OnChanges {

    @Input() row;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
    }

    /**
     * Stop the propagation of event
     * @param evt
     */
    stopPropagation(evt) {
        evt.stopPropagation();
    }

    /**
     * Method called on svg/img by click event
     * @param evt
     * @param method
     * @param params
     */
    genericClickMethod(evt, method, params, context) {

        this.stopPropagation(evt);
        if(!params) {
            params = [];
        }
        var newParams = params.slice();
        newParams.push(evt);
        if(context) {
            method.call(context, newParams);
        } else {
            method(newParams);
        }
    }

}

