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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4577798861480076, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5061728395061729, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.5, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.4358974358974359, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.13253012048192772, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.08024691358024691, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.5125, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.39375, 500, 1500, "signUp"], "isController": true}, {"data": [0.30246913580246915, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.0875, 500, 1500, "logout"], "isController": true}, {"data": [0.4759036144578313, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.5, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 176, 0, 0.0, 91.75568181818183, 0, 2075, 1.0, 1416.3, 2017.2499999999993, 1.4536204233669483, 28.96119147061374, 0.06804973539565731], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 81, 0, 0.0, 1066.3580246913575, 402, 1983, 1522.1999999999998, 1830.8999999999987, 1983.0, 0.6884710842144629, 8.331575855064088, 0.3930254851171251], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 83, 0, 0.0, 0.2650602409638553, 0, 1, 1.0, 1.0, 1.0, 0.6969226247953315, 14.035243660523111, 0.0], "isController": false}, {"data": ["changeLanguage", 81, 0, 0.0, 1025.7530864197531, 423, 2036, 1427.8, 1758.2999999999977, 2036.0, 0.6932379346644643, 14.287877549896013, 0.386268860778994], "isController": true}, {"data": ["verifyLogout", 78, 0, 0.0, 1068.4615384615386, 466, 2026, 1639.6000000000006, 1821.1499999999994, 2026.0, 0.731412282100091, 15.094663825801975, 0.4349170538619506], "isController": true}, {"data": ["navigateToDashboard", 83, 0, 0.0, 2015.1325301204815, 785, 3575, 2886.0, 3148.2, 3575.0, 0.7272090068778201, 9.223623614579227, 0.7584562688921014], "isController": true}, {"data": ["navigateToSettings", 81, 0, 0.0, 1971.2716049382711, 815, 2968, 2555.4, 2891.299999999998, 2968.0, 0.7264899771290193, 9.054874587986008, 0.7683482863581326], "isController": true}, {"data": ["chooseOptions", 80, 0, 0.0, 943.6750000000001, 394, 1558, 1498.8000000000002, 1514.85, 1558.0, 0.697976739925142, 8.151468586684349, 0.41210618843627034], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 83, 0, 0.0, 0.313253012048193, 0, 1, 1.0, 1.0, 1.0, 0.7372338630166189, 14.775123547738113, 0.0], "isController": false}, {"data": ["signUp", 80, 0, 0.0, 1143.375, 507, 2042, 1615.1000000000001, 1854.0000000000005, 2042.0, 0.6973987028384127, 8.61192050526536, 0.5629587575842109], "isController": true}, {"data": ["navigateToDhaka", 81, 0, 0.0, 1420.9629629629635, 546, 2396, 2017.8, 2167.6, 2396.0, 0.6948733786287832, 47.253341732400834, 0.2707563262430513], "isController": true}, {"data": ["logout", 80, 0, 0.0, 2056.725000000001, 902, 5961, 3008.9000000000005, 3456.65, 5961.0, 0.7338305034994542, 15.994996766559344, 0.8010863557977197], "isController": true}, {"data": ["navigateToApp", 83, 0, 0.0, 1107.879518072289, 415, 2276, 1572.2, 1903.9999999999998, 2276.0, 0.6923474750171001, 18.472966516032432, 0.2548974590639128], "isController": true}, {"data": ["SignUpUsingEmail", 80, 0, 0.0, 1003.8625000000004, 406, 1959, 1533.1000000000001, 1583.95, 1959.0, 0.7014713361275274, 8.457387808428178, 0.4148545323816705], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 176, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
