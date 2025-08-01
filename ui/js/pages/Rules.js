import {BasePage} from './Base.js';
import {Tooltip} from '../parts/Tooltip.js?v=2';
import {handleAjaxError} from '../parts/utils/ErrorHandler.js?v=2';
import {getRuleClass} from '../parts/utils/String.js?v=2';
import {ThresholdsForm} from '../parts/ThresholdsForm.js?v=2';
import {
    renderClickableUser,
    renderProportion,
    renderRulePlayResult,
} from '../parts/DataRenderers.js?v=2';

export class RulesPage extends BasePage {

    constructor() {
        super();

        this.initUi();
    }

    initUi() {
        new ThresholdsForm();

        const searchTable = this.searchTable.bind(this);
        this.searchInput.addEventListener('keyup', searchTable, false);

        const onPlayButtonClick = this.onPlayButtonClick.bind(this);
        this.playButtons.forEach(button => button.addEventListener('click', onPlayButtonClick, false));

        const onSaveButtonClick = this.onSaveButtonClick.bind(this);
        this.saveButtons.forEach(button => button.addEventListener('click', onSaveButtonClick, false));

        const onSelectChange = this.onSelectChange.bind(this);
        this.selects.forEach(select => select.addEventListener('change', onSelectChange, false));
    }

    onPlayButtonClick(e) {
        e.preventDefault();

        this.updateDisabled(true);

        const currentPlayButton = e.target.closest('button');
        currentPlayButton.classList.add('is-loading');

        const ruleUid = currentPlayButton.dataset.ruleUid;
        const token = document.head.querySelector('[name=\'csrf-token\'][content]').content;
        const params  = {ruleUid: currentPlayButton.dataset.ruleUid, token: token};

        $.ajax({
            url: '/admin/checkRule',
            type: 'get',
            context: {currentPlayButton: currentPlayButton, ruleUid: ruleUid},
            data: params,
            success: this.onCheckRuleLoad,          // without binding to keep simultaneous calls scopes separate
            error: handleAjaxError,
            complete: this.updateDisabled.bind(this, false)
        });

        return false;
    }

    onCheckRuleLoad(data, status) {
        if ('success' !== status || 0 === data.length) {
            return;
        }

        this.currentPlayButton.classList.remove('is-loading');

        let row     = document.querySelector(`tr[data-rule-uid="${this.ruleUid}"]`);
        let nextRow = row.nextElementSibling;
        if (!nextRow || nextRow.dataset.ruleUid) {
            const ex = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 6;

            ex.replaceChildren(td);

            nextRow = row.parentNode.insertBefore(ex, row.nextSibling);
        }

        nextRow.querySelector('td').replaceChildren(renderRulePlayResult(data.users, data.count, this.ruleUid));

        // 3 is index of proportion column
        row.children[3].replaceChildren(renderProportion(data.proportion, data.proportion_updated_at));

        Tooltip.addTooltipsToRulesProportion();
    }

    updateDisabled(disabled) {
        this.playButtons.forEach(button => button.disabled = disabled);
    }

    onSelectChange(e) {
        e.preventDefault();

        const field = e.target;
        const parentRow = field.closest('tr');
        const saveButton = parentRow.querySelector('button[type="button"]');

        const value = field.value;
        const cls   = getRuleClass(parseInt(value, 10));

        const newClassName = `ruleHighlight ${cls}`;
        parentRow.querySelector('h3').className = newClassName;

        if (field.dataset.initialValue == value) {
            parentRow.classList.remove('input-field-changed');
            saveButton.classList.add('is-hidden');
        } else {
            parentRow.classList.add('input-field-changed');
            saveButton.classList.remove('is-hidden');
        }

        return false;
    }

    onSaveButtonClick(e) {
        e.preventDefault();

        const currentSaveButton = e.target.closest('button');
        currentSaveButton.classList.add('is-loading');

        const select = currentSaveButton.closest('tr').querySelector('select');
        const token = document.head.querySelector('[name=\'csrf-token\'][content]').content;

        const params = {
            rule: select.name,
            value: select.value,
            token: token,
        };

        $.ajax({
            url: '/admin/saveRule',
            type: 'post',
            data: params,
            context: {currentSaveButton: currentSaveButton},
            error: handleAjaxError,
            success: this.onSaveLoaded,         // without binding to keep simultaneous calls scopes separate
        });

        return false;
    }

    onSaveLoaded(data, status) {
        if ('success' !== status) {
            return;
        }

        this.currentSaveButton.classList.remove('is-loading');

        const parentRow = this.currentSaveButton.closest('tr');
        const saveButton = parentRow.querySelector('button[type="button"]');

        parentRow.classList.remove('input-field-changed');
        saveButton.classList.add('is-hidden');
    }

    searchTable() {
        let td, i, txtValue;
        const input =   document.getElementById('search');
        const filter =  input.value.toLowerCase();
        const table =   document.getElementById('rules-table');
        const tr =      table.getElementsByTagName('tr');

        // i = 1 because search must skip first line with column names
        for (i = 1; i < tr.length; i++) {
            td = tr[i].getElementsByTagName('td');
            let found = false;

            for (let j = 0; j < Math.min(td.length, 3); j++) {
                if (td[j]) {
                    txtValue = td[j].textContent || td[j].innerText;
                    if (txtValue.toLowerCase().indexOf(filter) > -1) {
                        found = true;
                        break;
                    }
                }
            }
            tr[i].style.display = found ? '' : 'none';
        }
    }

    get selects() {
        return document.querySelectorAll('td select');
    }

    get saveButtons() {
        return document.querySelectorAll('td button[type="button"]');
    }

    get playButtons() {
        return document.querySelectorAll('td button[data-rule-uid]');
    }

    get searchInput() {
        return document.getElementById('search');
    }
}
