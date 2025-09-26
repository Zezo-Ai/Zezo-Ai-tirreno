import {BasePage} from './Base.js';

import {DatesFilter} from '../parts/DatesFilter.js?v=2';
import {SearchFilter} from '../parts/SearchFilter.js?v=2';
import {EntityTypeFilter} from '../parts/choices/EntityTypeFilter.js?v=2';
import {BlacklistGridActionButtons} from '../parts/BlacklistGridActionButtons.js?v=2';
import {BlacklistChart} from '../parts/chart/Blacklist.js?v=2';
import {BlacklistGrid} from '../parts/grid/Blacklist.js?v=2';

export class BlacklistPage extends BasePage {

    constructor() {
        super('blacklist');
        this.tableId = 'blacklist-table';
        this.initUi();
    }

    initUi() {
        const datesFilter       = new DatesFilter();
        const searchFilter      = new SearchFilter();

        const gridParams = {
            url:            '/admin/loadBlacklist',
            tileId:         'totalBlacklist',
            tableId:        'blacklist-table',

            dateRangeGrid:  true,

            getParams: function() {
                const dateRange     = datesFilter.getValue();
                const searchValue   = searchFilter.getValue();

                return {dateRange, searchValue};
            },
        };

        if (document.getElementById('entity-type-selectors')) {
            const entityTypeFilter  = new EntityTypeFilter();

            gridParams.choicesFilterEvents = [entityTypeFilter.getEventType()];
            gridParams.getParams = function() {
                const dateRange     = datesFilter.getValue();
                const searchValue   = searchFilter.getValue();
                const entityTypeIds = entityTypeFilter.getValues();

                return {dateRange, searchValue, entityTypeIds};
            };
        }

        const chartParams = this.getChartParams(datesFilter, searchFilter);

        new BlacklistChart(chartParams);
        new BlacklistGrid(gridParams);
        new BlacklistGridActionButtons(this.tableId);
    }
}
