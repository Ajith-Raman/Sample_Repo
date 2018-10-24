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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4432793136320305, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.47530864197530864, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.46296296296296297, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.4936708860759494, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.1144578313253012, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.09259259259259259, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.4620253164556962, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.3717948717948718, 500, 1500, "signUp"], "isController": true}, {"data": [0.32926829268292684, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.0875, 500, 1500, "logout"], "isController": true}, {"data": [0.4329268292682927, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4230769230769231, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 175, 0, 0.0, 89.30285714285716, 0, 2531, 1.0, 1005.7999999999979, 2497.5600000000004, 1.4408984619438132, 28.909038524478806, 0.06383533978444159], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 81, 0, 0.0, 1058.5308641975312, 377, 2150, 1538.8, 1898.4999999999989, 2150.0, 0.6943849121303044, 8.403142413201886, 0.396234060222889], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 82, 0, 0.0, 0.41463414634146345, 0, 2, 1.0, 1.0, 2.0, 0.6961482626007081, 14.019708702808364, 0.0], "isController": false}, {"data": ["changeLanguage", 81, 0, 0.0, 1089.7654320987647, 456, 2212, 1581.2, 1837.8999999999999, 2212.0, 0.6932557343375556, 14.288244407416125, 0.3861116163129065], "isController": true}, {"data": ["verifyLogout", 79, 0, 0.0, 1007.1012658227846, 431, 2050, 1515.0, 1605.0, 2050.0, 0.7316847272390479, 15.10028646556914, 0.43505285032879504], "isController": true}, {"data": ["navigateToDashboard", 83, 0, 0.0, 1972.4216867469886, 892, 3463, 2563.4, 2985.4, 3463.0, 0.7292984675945452, 9.25012548546675, 0.7606355111239983], "isController": true}, {"data": ["navigateToSettings", 81, 0, 0.0, 1949.5308641975305, 942, 3472, 2499.2, 2801.0999999999976, 3472.0, 0.7194116811141111, 8.966651646542383, 0.7608621588345531], "isController": true}, {"data": ["chooseOptions", 79, 0, 0.0, 1048.6075949367091, 408, 2071, 1551.0, 1939.0, 2071.0, 0.6837163010082652, 7.984925042732269, 0.4035055335583539], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 83, 0, 0.0, 0.3614457831325301, 0, 6, 1.0, 1.0, 6.0, 0.7367692225753192, 14.765846224945408, 0.0], "isController": false}, {"data": ["signUp", 78, 0, 0.0, 1170.2179487179494, 468, 2069, 1735.9000000000017, 2020.7, 2069.0, 0.6870007134238177, 8.483519551996265, 0.5544035204382712], "isController": true}, {"data": ["navigateToDhaka", 82, 0, 0.0, 1330.9634146341461, 539, 2487, 1903.8000000000002, 2072.55, 2487.0, 0.6822928367572785, 46.20773145172362, 0.2658543377599161], "isController": true}, {"data": ["logout", 80, 0, 0.0, 1995.825000000001, 805, 3181, 2884.000000000002, 3017.65, 3181.0, 0.7308806197867656, 15.930663696702815, 0.7978482703253332], "isController": true}, {"data": ["navigateToApp", 82, 0, 0.0, 1179.0609756097563, 410, 2465, 1681.2, 1975.35, 2465.0, 0.6893131246900193, 18.39200507107491, 0.2537803203204465], "isController": true}, {"data": ["SignUpUsingEmail", 78, 0, 0.0, 1083.5256410256407, 438, 2332, 1562.6000000000001, 1951.0999999999997, 2332.0, 0.6875396657499471, 8.289418665379735, 0.4064534246967774], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 175, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
