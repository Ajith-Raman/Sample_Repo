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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4648217636022514, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5493827160493827, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.4879518072289157, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.49375, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.10843373493975904, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.08536585365853659, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.4567901234567901, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.46794871794871795, 500, 1500, "signUp"], "isController": true}, {"data": [0.3192771084337349, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.06097560975609756, 500, 1500, "logout"], "isController": true}, {"data": [0.47058823529411764, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.525, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 178, 0, 0.0, 73.64606741573033, 0, 2600, 1.0, 872.7999999999997, 2013.8200000000058, 1.4715973445108592, 29.447529003075473, 0.05658002430615839], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 81, 0, 0.0, 971.567901234568, 432, 1935, 1469.2, 1488.3, 1935.0, 0.695977934921767, 8.422420478076695, 0.39761297289982217], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 85, 0, 0.0, 0.32941176470588235, 0, 4, 1.0, 1.0, 4.0, 0.7104469128992085, 14.307751106416589, 0.0], "isController": false}, {"data": ["changeLanguage", 83, 0, 0.0, 1029.6144578313254, 409, 1865, 1528.2, 1615.1999999999998, 1865.0, 0.7040043427737771, 14.509777006094302, 0.3925400720544204], "isController": true}, {"data": ["verifyLogout", 80, 0, 0.0, 1054.8375000000003, 417, 1819, 1544.9, 1571.85, 1819.0, 0.7508423512628231, 15.49565567308324, 0.44671087055477865], "isController": true}, {"data": ["navigateToDashboard", 83, 0, 0.0, 2004.5903614457827, 900, 3981, 2516.2000000000003, 2991.6, 3981.0, 0.7320321388567951, 9.284798261203179, 0.7634866448232981], "isController": true}, {"data": ["navigateToSettings", 82, 0, 0.0, 2013.865853658537, 973, 4009, 2939.2, 3320.149999999998, 4009.0, 0.7420075829555429, 9.248283966075775, 0.7847599729891143], "isController": true}, {"data": ["chooseOptions", 81, 0, 0.0, 1024.9259259259263, 390, 1851, 1515.0, 1547.3999999999999, 1851.0, 0.6933981646349816, 8.097996729364985, 0.40968208015169155], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 83, 0, 0.0, 0.4216867469879518, 0, 1, 1.0, 1.0, 1.0, 0.7442144054802873, 14.91492636032082, 0.0], "isController": false}, {"data": ["signUp", 78, 0, 0.0, 1053.7051282051284, 431, 2025, 1571.6000000000001, 1661.7499999999998, 2025.0, 0.6924162664559828, 8.550394227867091, 0.5592246158421291], "isController": true}, {"data": ["navigateToDhaka", 83, 0, 0.0, 1393.072289156626, 554, 2432, 2091.4, 2259.3999999999996, 2432.0, 0.7046079663146457, 48.03475294417892, 0.2745493931245543], "isController": true}, {"data": ["logout", 82, 0, 0.0, 2046.9512195121952, 928, 3522, 2596.7, 2820.25, 3522.0, 0.7460513865637964, 16.26183759507606, 0.8146609617239245], "isController": true}, {"data": ["navigateToApp", 85, 0, 0.0, 1070.423529411765, 419, 2537, 1592.0, 1691.3, 2537.0, 0.7029092172072177, 18.754771125523046, 0.25878591297570414], "isController": true}, {"data": ["SignUpUsingEmail", 80, 0, 0.0, 991.3624999999998, 412, 2045, 1530.0000000000002, 1663.5500000000002, 2045.0, 0.6928986549104862, 8.354030071801624, 0.41008909160986345], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 178, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
