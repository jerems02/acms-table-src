import {
  Component, OnInit, OnChanges, ChangeDetectorRef, Input, Output, EventEmitter,
  SecurityContext
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

export class Item {
  data: string;
  isResponsive = false;
  isHtml = false;
  img = null;
  isTranslatable = false;
  actions = [];

  constructor(data) {
    this.data = data;
  }
}

@Component({
  selector: 'acms-table',
  templateUrl: './acms-table.component.html',
  styleUrls: ['./acms-table.component.css'],
})

export class AcmsTableComponent implements OnInit, OnChanges {

  constructor(private _ref: ChangeDetectorRef, private _sanitizer: DomSanitizer) {
  }

  @Input() config: any;
  @Input() collection: any[];
  @Output() rowSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() emptyTableEvt: EventEmitter<boolean> = new EventEmitter<boolean>();

  headers: any[];
  targets: any[] = [];
  results: any[] = [];
  filteredResults: any[] = [];
  displayedResults: any[] = [];
  colsSearchable: number[] = [];
  pageCurrent = 1;
  nbResultsByPage: number;
  pageTotal: number;
  collectionPage: any[];
  nbPageBeforeAfter: number;
  eventResize: any;
  breakPoint: number;
  selectedRowsList: string[] = [];
  viewportWidth: number = 0;
  isEmptyTable: boolean = true;

  ngOnInit() {
    this.eventResize = this.addResizeEvent();
  }

  ngOnChanges() {
    this.breakPoint = (this.config.global.responsiveViewBreakPoint)?this.config.global.responsiveViewBreakPoint:800;
    this.nbResultsByPage = (this.config.global.pagination && this.config.global.pagination.nbResultsByPage)?this.config.global.pagination.nbResultsByPage:10;
    this.nbPageBeforeAfter = (this.config.global.pagination && this.config.global.pagination.nbPageBeforeAfter)?this.config.global.pagination.nbPageBeforeAfter:3;
    this.prepareTable();
    this.applyFilter();
    this.applyPagination();
  }

  reinit() {
    this.headers = [];
    this.targets = [];
    this.results = [];
    this.filteredResults = [];
    this.displayedResults = [];
  }

  /**
   * Find the value of an element with is target (ex: object.property1...)
   * It find through the element sent
   * Returns false if there is no match
   * @param target
   * @param el
   * @returns {null}
   */
  findTargetThroughObject(target, el) {
    let test = target.split('.').reduce(function (object, property) {
      if(object[property]) {
        return object[property];
      } else {
        return false;
      }
    }, el);
    return test;
  }


  prepareTable() {

    this.reinit();
    /**
     * We map on the headers to get the target of each cols in the json conf
     * and we obtain if this col is responsive
     */
    this.headers = this.config.columns.map( (el, index) => {
      let target = {
        src: el.target,
        actions: el.actions,
        isResponsive: el.hideWithResponsiveView,
        isHtml: el.isHtml,
        img: el.img,
        messageIfEmpty: el.messageIfEmpty,
        isMessageIfEmptyTranslatable: el.isMessageIfEmptyTranslatable
      }
      this.targets.push(target);
      //which column is searchable
      if(el.is_searchable) {
        this.colsSearchable.push(index);
      }
      return el;
    });


    /**
     * we loop on collection to extract data on json, we use the targets array installed before
     * to know for each item the target and if the element is responsive
     */
    this.collection.forEach( (el, index) => {

      var row: any = {};
      row.items = [];

      row.id = this.findTargetThroughObject(this.config.global.target_id, el);
      if(!row.id) row.id = index;

      this.targets.forEach( target => {

        let translatable = false;
        //find object
        if (target.src !== null) { // if it is not a actions item
          var objectFound = this.findTargetThroughObject(target.src, el);
          if(!objectFound) {
            objectFound = target.messageIfEmpty;
            if(target.isMessageIfEmptyTranslatable) translatable = true;
            if(target.isHtml) objectFound = this._sanitizer.sanitize(SecurityContext.HTML, objectFound);
            if(target.img) objectFound = this._sanitizer.sanitize(SecurityContext.URL, objectFound);
          }
        };

        let item: Item = new Item((objectFound)?objectFound:null);
        item.actions = target.actions;
        item.isResponsive = target.isResponsive;
        item.isHtml = target.isHtml;
        item.img = target.img;
        item.isTranslatable = translatable;
        row.items.push(item);

      });

      this.results.push(row);

    })

  }

  applyFilter() {
    this.filteredResults = this.results;
    this.isEmpty();
  }

  isEmpty() {
    let oldState = this.isEmptyTable;
    this.isEmptyTable = (this.filteredResults.length === 0);
    // only if there is a change we sent an event
    if(oldState !== this.isEmptyTable) this.emptyTableEvt.emit(this.isEmptyTable);
  }

  applyPagination() {

    if (!this.config.global.pagination) {
      this.displayedResults = this.filteredResults;
      return;
    }

    this.pageTotal = Math.ceil(this.filteredResults.length / this.nbResultsByPage);

    // check if we are in a page without result
    if(this.pageCurrent > this.pageTotal) {
      this.pageCurrent = 1;
    }

    let start = Math.ceil((this.pageCurrent - 1) * this.nbResultsByPage);
    let end = start + this.nbResultsByPage;
    this.displayedResults = this.filteredResults.slice(start, end);

    // page collection
    this.collectionPage = [];
    if (this.pageCurrent > 1) {
      this.collectionPage.push({
        'name': '<<',
        'number': 1
      })
    }

    if ((this.pageCurrent - 1) > 0) {
      this.collectionPage.push({
        'name': '<',
        'number': this.pageCurrent - 1
      })
    }

    start = (this.pageCurrent - this.nbPageBeforeAfter > 0) ? (this.pageCurrent - this.nbPageBeforeAfter) : 1;

    for(let i = start; i < this.pageCurrent; i++) {
      this.collectionPage.push({
        'name': i,
        'number': i
      })
    }

    this.collectionPage.push({
      'name': this.pageCurrent,
      'number': this.pageCurrent,
      'current': true
    })

    end = (this.pageCurrent + this.nbPageBeforeAfter < this.pageTotal) ? (this.pageCurrent + this.nbPageBeforeAfter) : this.pageTotal;

    for(let i = this.pageCurrent + 1; i <= end; i++) {
      this.collectionPage.push({
        'name': i,
        'number': i
      })
    }

    if ((this.pageCurrent) < this.pageTotal) {
      this.collectionPage.push({
        'name': '>',
        'number': this.pageCurrent + 1
      })

      this.collectionPage.push({
        'name': '>>',
        'number': this.pageTotal
      })
    }
  }

  changePage(page) {
    this.deselectAll();
    this.pageCurrent = page;
    this.applyPagination();
  }

  isNumeric(val) {
    return !isNaN(parseFloat(val)) && isFinite(val);
  }

  sort(columnIndex, type) {
    let that = this;
    let compare = function(a, b) {
      a = a.items[columnIndex].data;
      b = b.items[columnIndex].data;
      if(!that.isNumeric(a)) {
        a.toLowerCase();
      }
      if(!that.isNumeric(b)) {
        b.toLowerCase();
      }
      if ( a < b ) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }
    this.filteredResults.sort(compare);
    if(type === 'ASC') this.filteredResults.reverse();

    this.applyPagination();
  }

  searchWithTerms(event, el) {
    let keyCode = event.keyCode;
    let searchTerm = el.value;

    let temp = [];
    this.results.forEach( (el) => {
      let alreadyInList = false;
      el.items.forEach( (item, index) => {
        if(alreadyInList) {
          return;
        }
        if (this.colsSearchable.indexOf(index) > -1) {
          let data = item.data;
          let valueTemp = (!this.isNumeric(data))?data.toLowerCase():data;
          valueTemp += '';
          if (valueTemp.indexOf(searchTerm.toLowerCase()) > -1) {
            alreadyInList = true;
            temp.push(el);
          }
        }
      });
    });

    this.filteredResults = temp;
    this.isEmpty();
    this.applyPagination();
  }

  addResizeEvent() {

    var that = this;

    let toDo = function(event: any) {
      that.viewportWidth = window.innerWidth;
    };

    window.addEventListener('resize', toDo, false);

    function _killMe() {
      document.removeEventListener('resize', toDo, false);
    }

    return {
      'killMe': _killMe
    };
  }

  showColumn(isResponsive) {
    if(isResponsive && window.innerWidth < this.breakPoint) {
      return false;
    }
    return true;
  }

  selectGlobalAction(evt) {
    let type = evt.target.value;
    this.sendEvent(evt, type + 'All', this.selectedRowsList);
    // reset select option
    let copy = this.config.global.group_actions;
    this.config.global.group_actions = null;
    this._ref.detectChanges();
    this.config.global.group_actions = copy;
    this._ref.detectChanges();
  }

  sendEvent(evt, type, rowId) {
    evt.stopPropagation();
    this.rowSelected.emit({type: type, id: rowId});
  }

  updateSelectedRowsList(evt) {
    if(this.config.global.group_actions) this.resetMainSwitch();
    let idRow = evt.id;
    let state = evt.state;
    let pos = this.selectedRowsList.indexOf(idRow);

    if(pos > -1 && !state) { // we remove
      this.selectedRowsList.splice(pos, 1);
    } else if(state) { // we add
      this.selectedRowsList.push(idRow);
    }
  }

  resetMainSwitch() {
    document.getElementById('main-switch').querySelector('input').checked = false;
  }

  deselectAll() {
    this.resetMainSwitch();
    this.selectDeselectAll({state: false});
  }

  selectDeselectAll(evt) {
    let state = evt.state;
    let all = document.querySelectorAll('.item-switch');
    this.selectedRowsList = [];
    if(state) {
      this.selectedRowsList = this.displayedResults.map((el) => {
        return el.id;
      });
    }
    [].forEach.call(all, function(el) {
      el.querySelector('input').checked = state;
    });
  }

  stopPropagation(evt) {
    evt.stopPropagation();
  }



}
