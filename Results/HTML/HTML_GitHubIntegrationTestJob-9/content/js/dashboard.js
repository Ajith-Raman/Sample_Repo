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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3475274725274725, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.35714285714285715, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.39622641509433965, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.02631578947368421, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.008771929824561403, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.33035714285714285, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.24074074074074073, 500, 1500, "signUp"], "isController": true}, {"data": [0.16071428571428573, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.018518518518518517, 500, 1500, "logout"], "isController": true}, {"data": [0.31896551724137934, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.30357142857142855, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 125, 0, 0.0, 393.304, 0, 7249, 5.600000000000051, 3982.2999999999997, 7145.519999999998, 0.9914733293674401, 19.503008501883798, 0.06013905413444378], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 56, 0, 0.0, 1994.0892857142862, 447, 10490, 5028.6, 6214.599999999994, 10490.0, 0.526791089704997, 6.374995296508128, 0.30102347983142685], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 58, 0, 0.0, 0.6724137931034483, 0, 18, 1.0, 1.0499999999999972, 18.0, 0.48398671539912214, 9.656982238522005, 0.0], "isController": false}, {"data": ["changeLanguage", 56, 0, 0.0, 1681.8571428571431, 454, 4269, 3973.2000000000003, 4162.75, 4269.0, 0.5241286361424132, 10.801963610497548, 0.2923362565984052], "isController": true}, {"data": ["verifyLogout", 53, 0, 0.0, 1246.1886792452835, 448, 3999, 1957.4, 2265.2999999999997, 3999.0, 0.6000973742909227, 12.384040735855251, 0.35659530367191655], "isController": true}, {"data": ["navigateToDashboard", 57, 0, 0.0, 2445.385964912281, 1308, 6050, 3825.600000000001, 5331.699999999999, 6050.0, 0.6323917722502053, 8.021000330064126, 0.6595648562140812], "isController": true}, {"data": ["navigateToSettings", 57, 0, 0.0, 2722.894736842105, 1408, 7249, 3784.6000000000035, 6683.5999999999985, 7249.0, 0.5932926702333617, 7.3947210451058565, 0.627476525256573], "isController": true}, {"data": ["chooseOptions", 56, 0, 0.0, 1917.3392857142856, 438, 7960, 4416.000000000003, 5996.149999999999, 7960.0, 0.5316018302291583, 6.20842410909229, 0.3141553226633252], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 57, 0, 0.0, 0.6140350877192985, 0, 11, 1.0, 1.0, 11.0, 0.6720113180853572, 13.345045482344966, 0.0], "isController": false}, {"data": ["signUp", 54, 0, 0.0, 1855.666666666666, 542, 6438, 3470.0, 4006.5, 6438.0, 0.5562709245428792, 6.86918539144991, 0.44933443857841876], "isController": true}, {"data": ["navigateToDhaka", 56, 0, 0.0, 2103.375000000001, 840, 4547, 3981.1, 4334.65, 4547.0, 0.516953298808238, 35.042598524029096, 0.20143004514110055], "isController": true}, {"data": ["logout", 54, 0, 0.0, 2521.3703703703704, 1321, 6269, 3549.0, 5697.25, 6269.0, 0.6129676716309481, 13.359560344680801, 0.6689258025335997], "isController": true}, {"data": ["navigateToApp", 58, 0, 0.0, 1618.7413793103444, 455, 3976, 3286.6, 3661.8499999999995, 3976.0, 0.4684483858722428, 12.497599075824025, 0.17246586081429252], "isController": true}, {"data": ["SignUpUsingEmail", 56, 0, 0.0, 1844.8571428571427, 576, 5462, 4319.8, 4920.599999999999, 5462.0, 0.5363573672515517, 6.466668023523102, 0.31748944046433225], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 125, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
