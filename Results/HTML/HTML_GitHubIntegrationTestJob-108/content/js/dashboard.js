/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.6704021094265, "KoPercent": 0.3295978905735003};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15405777166437415, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.0, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.0, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.0, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.0, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.0, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.0, 500, 1500, "signUp"], "isController": true}, {"data": [0.0, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.0, 500, 1500, "logout"], "isController": true}, {"data": [0.0, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.0, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3034, 10, 0.3295978905735003, 1.8707976268951878, 0, 1087, 1.0, 1.0, 1.0, 25.152540124684972, 492.33785746410337, 0.08210074539478047], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 1508, 1508, 100.0, 74.1505305039788, 3, 7111, 98.0, 120.0, 1064.5500000000004, 12.587646076794659, 52.216267020555094, 5.935600675605175], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 1511, 0, 0.0, 0.34083388484447374, 0, 54, 1.0, 1.0, 1.0, 12.613319531863032, 248.11640353700938, 0.0], "isController": false}, {"data": ["changeLanguage", 1511, 1511, 100.0, 68.82528127068164, 3, 3137, 98.0, 116.0, 1062.6399999999996, 12.586841710677573, 52.24863997446812, 5.879582097695883], "isController": true}, {"data": ["verifyLogout", 1509, 1509, 100.0, 63.665341285619625, 3, 3081, 97.0, 112.0, 1056.8000000000002, 12.69977529224632, 53.23066544160965, 6.339195026026545], "isController": true}, {"data": ["navigateToDashboard", 1513, 1513, 100.0, 75.3066754791805, 3, 3114, 98.0, 122.0, 1065.86, 12.70723800245242, 52.4808719533704, 6.451508184011389], "isController": true}, {"data": ["navigateToSettings", 1512, 1512, 100.0, 76.34523809523816, 3, 7059, 99.0, 122.0, 1064.7399999999998, 12.702466563613147, 53.19881484075711, 6.3614557167400365], "isController": true}, {"data": ["chooseOptions", 1506, 1506, 100.0, 79.9409030544489, 3, 7102, 98.0, 125.0, 1070.93, 12.64281936550844, 52.78068668463889, 6.216218458537261], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 1513, 0, 0.0, 0.2670191672174487, 0, 30, 1.0, 1.0, 1.0, 12.715354231448021, 248.78796767322885, 0.0], "isController": false}, {"data": ["signUp", 1506, 1506, 100.0, 68.44555112881811, 3, 3070, 97.0, 118.0, 1061.93, 12.558686424777138, 52.79032189973065, 8.157497738018796], "isController": true}, {"data": ["navigateToDhaka", 1511, 1511, 100.0, 74.89344804765055, 3, 3072, 99.0, 121.0, 1063.8799999999999, 12.655153352652475, 52.5220958736746, 4.792106808740515], "isController": true}, {"data": ["logout", 1512, 1512, 100.0, 71.95238095238096, 3, 7059, 99.0, 120.34999999999991, 1065.7399999999998, 12.677650609986166, 52.26513534723096, 6.051387666121662], "isController": true}, {"data": ["navigateToApp", 1511, 1511, 100.0, 61.358041032428865, 3, 3119, 98.0, 113.0, 1055.7599999999998, 12.611424565152072, 52.22601835323257, 5.4852618712023835], "isController": true}, {"data": ["SignUpUsingEmail", 1506, 1506, 100.0, 70.89110225763622, 3, 3064, 96.29999999999995, 120.64999999999986, 1062.8600000000001, 12.643668510884805, 52.42720845734231, 6.206526895081058], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401", 10, 100.0, 0.3295978905735003], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3034, 10, "401", 10, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["navigateToLogin", 2, 2, "401", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["changeLanguage", 3, 3, "401", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["navigateToDashboard", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["signUp", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["logout", 3, 3, "401", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
