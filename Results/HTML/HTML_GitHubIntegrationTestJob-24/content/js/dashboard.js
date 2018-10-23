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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.45540796963946867, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.50625, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.475, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.44375, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.12048192771084337, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.1, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.46875, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.4177215189873418, 500, 1500, "signUp"], "isController": true}, {"data": [0.29878048780487804, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.075, 500, 1500, "logout"], "isController": true}, {"data": [0.4880952380952381, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4936708860759494, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 177, 0, 0.0, 84.90395480225989, 0, 2036, 1.0, 1022.5999999999998, 2033.66, 1.4569819893977807, 29.830928095469364, 0.05466254815448948], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 80, 0, 0.0, 1077.6375000000003, 429, 3637, 1509.0, 1963.8000000000002, 3637.0, 0.6925327654564656, 8.38072854446926, 0.3952644284873353], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 84, 0, 0.0, 0.4880952380952382, 0, 11, 1.0, 1.0, 11.0, 0.7033703160979694, 14.165230204626335, 0.0], "isController": false}, {"data": ["changeLanguage", 80, 0, 0.0, 996.8499999999999, 438, 2064, 1519.8000000000002, 1708.6000000000004, 2064.0, 0.6924428518258853, 14.27149061307159, 0.38574611799226194], "isController": true}, {"data": ["verifyLogout", 80, 0, 0.0, 1104.8749999999995, 476, 2306, 1576.2000000000003, 1863.15, 2306.0, 0.7440061008500269, 15.354571219984004, 0.44206241397429463], "isController": true}, {"data": ["navigateToDashboard", 83, 0, 0.0, 2066.192771084336, 979, 4916, 2934.6, 3038.3999999999996, 4916.0, 0.7248655068818557, 9.193899612677287, 0.7560120716306854], "isController": true}, {"data": ["navigateToSettings", 80, 0, 0.0, 1976.1875000000002, 816, 3936, 3003.3, 3023.85, 3936.0, 0.7284050660572344, 9.078744002039535, 0.770373717324204], "isController": true}, {"data": ["chooseOptions", 80, 0, 0.0, 1059.3250000000003, 418, 2079, 1560.1000000000001, 2006.0500000000002, 2079.0, 0.689714630571601, 8.05497779981033, 0.4071269613759807], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 83, 0, 0.0, 0.31325301204819284, 0, 1, 1.0, 1.0, 1.0, 0.7361288491556691, 14.75280441256031, 0.0], "isController": false}, {"data": ["signUp", 79, 0, 0.0, 1044.582278481013, 431, 2064, 1598.0, 1641.0, 2064.0, 0.686180839051507, 8.473395224420221, 0.5537727731694606], "isController": true}, {"data": ["navigateToDhaka", 82, 0, 0.0, 1466.5609756097563, 652, 2531, 1984.7, 2307.9999999999995, 2531.0, 0.6890987932367474, 45.99891192508572, 0.26850626806783423], "isController": true}, {"data": ["logout", 80, 0, 0.0, 1968.1750000000004, 944, 3811, 2511.6, 2564.75, 3811.0, 0.7342278676187154, 16.003048479689422, 0.8012154052478937], "isController": true}, {"data": ["navigateToApp", 84, 0, 0.0, 1108.4404761904768, 435, 2273, 1572.5, 1828.5, 2273.0, 0.6975527524269023, 18.611851857234203, 0.2568138551415451], "isController": true}, {"data": ["SignUpUsingEmail", 79, 0, 0.0, 995.0632911392408, 396, 1972, 1529.0, 1573.0, 1972.0, 0.6899021037647696, 8.317901731523285, 0.4078810808539067], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 177, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
