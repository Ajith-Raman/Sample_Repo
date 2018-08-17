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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.47527472527472525, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.572289156626506, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.5180722891566265, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.5182926829268293, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.10465116279069768, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.07738095238095238, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.5, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.4329268292682927, 500, 1500, "signUp"], "isController": true}, {"data": [0.3941176470588235, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.05421686746987952, 500, 1500, "logout"], "isController": true}, {"data": [0.5, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4879518072289157, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 182, 0, 0.0, 79.2032967032967, 0, 3190, 1.0, 898.6499999999985, 1798.089999999979, 1.5037593984962407, 30.31587112957531, 0.060935305296207554], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 83, 0, 0.0, 939.0000000000001, 247, 1975, 1476.8, 1728.9999999999993, 1975.0, 0.718421895422008, 8.694027468817893, 0.4103674013901031], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 86, 0, 0.0, 0.5116279069767442, 0, 13, 1.0, 1.0, 13.0, 0.7195689280096388, 14.278382117770843, 0.0], "isController": false}, {"data": ["changeLanguage", 83, 0, 0.0, 960.3975903614455, 264, 1790, 1438.8000000000002, 1668.8, 1790.0, 0.7235070040708166, 15.226854926494305, 0.40338035220843976], "isController": true}, {"data": ["verifyLogout", 82, 0, 0.0, 979.8780487804877, 299, 1585, 1502.8, 1562.7, 1585.0, 0.7561994522164943, 15.93557419861302, 0.44956979628724514], "isController": true}, {"data": ["navigateToDashboard", 86, 0, 0.0, 1988.290697674418, 794, 3555, 2546.8, 2951.6999999999994, 3555.0, 0.7489071181009109, 9.498833642475224, 0.7810867208318094], "isController": true}, {"data": ["navigateToSettings", 84, 0, 0.0, 2060.273809523809, 957, 3550, 3000.5, 3086.0, 3550.0, 0.7532078584686567, 9.387882712534635, 0.7966055768765188], "isController": true}, {"data": ["chooseOptions", 83, 0, 0.0, 1007.6506024096385, 281, 2022, 1522.0, 1565.6, 2022.0, 0.7122996120970787, 8.31874127057516, 0.42078241392331195], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 86, 0, 0.0, 0.38372093023255804, 0, 1, 1.0, 1.0, 1.0, 0.7624992242013707, 15.056112752910352, 0.0], "isController": false}, {"data": ["signUp", 82, 0, 0.0, 1089.146341463414, 436, 2099, 1544.8, 1614.0499999999997, 2099.0, 0.7127645703855013, 8.801667961449867, 0.5755730094745535], "isController": true}, {"data": ["navigateToDhaka", 85, 0, 0.0, 1320.9764705882353, 487, 2570, 1919.4, 2001.6, 2570.0, 0.7111007002250425, 46.98673856016748, 0.27707927674784366], "isController": true}, {"data": ["logout", 83, 0, 0.0, 2027.9879518072287, 727, 3105, 2760.4000000000015, 3009.8, 3105.0, 0.7472024918752982, 16.61178695051359, 0.8156263081670132], "isController": true}, {"data": ["navigateToApp", 86, 0, 0.0, 956.9999999999999, 337, 1995, 1466.3, 1511.6, 1995.0, 0.7105911126534794, 19.38026229901013, 0.26161411081090014], "isController": true}, {"data": ["SignUpUsingEmail", 83, 0, 0.0, 971.5421686746993, 283, 2031, 1567.6000000000001, 1604.6, 2031.0, 0.712886934414402, 8.59502157449239, 0.4218255461529873], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 182, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
