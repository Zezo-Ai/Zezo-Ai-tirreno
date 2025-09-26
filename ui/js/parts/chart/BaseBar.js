import {BaseChart}  from './BaseChart.js?v=2';
import {COLOR_MAP} from '../utils/Constants.js?v=2';
import {formatIntTimeUtc} from '../utils/Date.js?v=2';
import {renderChartTooltipPart} from '../DataRenderers.js?v=2';

export class BaseBarChart extends BaseChart {
    getSeries() {
        return [
            this.getDaySeries(),
            {
                width:      -1,
                paths:      uPlot.paths.bars({size: [0.6, 100]}),
                points:     {show: false},
            },
            this.getSingleSeries('Regular events', 'green'),
            this.getSingleSeries('Warning events', 'yellow'),
            this.getSingleSeries('Alert events', 'red'),
        ];
    }

    getSingleSeries(label, color) {
        return {
            label:      label,
            width:      -1,
            drawStyle:  1,
            fill: 	    COLOR_MAP[color].main,
            stroke:     COLOR_MAP[color].main,
            paths:      uPlot.paths.bars({size: [0.6, 100]}),
            points:     {show: false},
        };
    }

    // dataset adaption for bands instead of regular bars
    getData(data) {
        let stacked = [data[0]];
        let sums = new Array(data[0].length).fill(0);

        stacked.push(new Array(data[0].length).fill(0));

        let maxLvl = data.length - 1;

        for (let i = 1; i < data.length; i++) {
            let series = [];
            for (let j = 0; j < data[0].length; j++) {
                sums[j] += +data[i][j];
                series.push(sums[j]);
            }
            stacked.push(series);
        }

        maxLvl = data.length;

        for (let i = 0; i < data[0].length; i++) {
            let topMet = false;
            for (let j = maxLvl; j > 1; j--) {
                if (stacked[j][i] <= stacked[j-1][i] && !topMet) {
                    stacked[j][i] = null;
                } else {
                    topMet = true;
                }
            }
        }

        this.data = stacked;

        return stacked;
    }

    stack(data, omit) {
        let data2 = [];
        let bands = [];
        let d0Len = data ? data[0].length : 0;
        let accum = Array(d0Len);

        let i;

        for (i = 0; i < d0Len; i++) {
            accum[i] = 0;
        }

        let el;

        for (i = 1; i < data.length; i++) {
            el = data[i];

            if (!omit(i)) {
                el = el.map((v, j) => {
                    let val = accum[j] + +v;
                    accum[j] = val;

                    return val;
                });
            }

            data2.push(el);
        }

        for (i = 1; i < data.length; i++) {
            !omit(i) && bands.push({
                series: [
                    data.findIndex((s, j) => j > i && !omit(j)),
                    i,
                ],
            });
        }

        bands = bands.filter(b => b.series[1] > -1);

        return {
            data: [data[0]].concat(data2),
            bands,
        };
    }

    getOptions(resolution = 'day', nullChar = '0') {
        const opts = super.getOptions(resolution, nullChar);

        let stacked = this.stack(this.data, i => false);

        opts.bands = stacked.bands;

        opts.series.forEach((s, sIdx) => {
            if (s) {
                s.value = (u, v, si, i) => u.data[sIdx][i];

                s.points = s.points || {};
                s.points.filter = (u, seriesIdx, show, gaps) => {
                    if (show) {
                        let pts = [];
                        u.data[seriesIdx].forEach((v, i) => {
                            v != null && pts.push(i);
                        });
                        return pts;
                    }
                };
            }
        });

        return opts;
    }

    tooltipCursor(u, seriestt, opts, resolution, defaultVal) {
        const left = u.cursor.left;
        const idx  = u.cursor.idx;
        const col  = [];

        if (opts && opts.cursorMemo) {
            opts.cursorMemo.set(left, top);
        }

        seriestt.style.display = 'none';

        if (left >= 0 && u.data) {
            let xVal = u.data[0][idx];

            let maxLvl = u.data.length - 1;

            for (let i = 0; i <= maxLvl; i++) {
                col.push(u.data[i][idx]);
            }

            const vtp = (resolution === 'day') ? 'DAY' : ((resolution === 'hour') ? 'HOUR' : 'MINUTE');
            let ts = '';

            if (Number.isInteger(xVal)) {
                const useTime = resolution === 'hour' || resolution === 'minute';
                ts = formatIntTimeUtc(xVal * 1000, useTime);
            }

            let frag = document.createDocumentFragment();
            frag.appendChild(document.createTextNode(ts.replace(/\./g, '/')));

            let prev = null;

            let maxVal = 0;
            let maxIdx = 0;

            for (let i = maxLvl; i >= 1; i--) {
                if (col[i] === null) {
                    col[i] = 0;
                } else {
                    if (maxVal < col[i]) {
                        maxVal = col[i];
                        maxIdx = i;
                    }

                    if (prev !== null) {
                        col[prev] -= col[i];
                    }

                    prev = i;
                }
            }

            for (let i = 2; i <= maxLvl; i++) {
                frag = this.extendTooltipFragment(i, null, col, defaultVal, u, frag);
            }

            if (frag.children.length > 1) {
                seriestt.replaceChildren(frag);

                seriestt.style.top = Math.round(u.valToPos(maxVal, u.series[maxIdx].scale)) + 'px';
                seriestt.style.left = Math.round(u.valToPos(xVal, vtp)) + 'px';
                seriestt.style.display = null;
            }
        }

        return [seriestt, opts];
    }
}
