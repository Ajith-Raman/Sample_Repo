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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.46016869728209936, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.50625, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.5, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.49375, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.14705882352941177, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.07228915662650602, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.50625, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.4240506329113924, 500, 1500, "signUp"], "isController": true}, {"data": [0.2619047619047619, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.09876543209876543, 500, 1500, "logout"], "isController": true}, {"data": [0.48214285714285715, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.475, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 179, 0, 0.0, 91.14525139664804, 0, 2446, 1.0, 1029.0, 2288.399999999998, 1.469417240615021, 30.02915457971794, 0.06389258580493691], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 80, 0, 0.0, 1018.6375, 402, 2019, 1490.8, 1890.9500000000012, 2019.0, 0.6951202558042541, 8.412041220631169, 0.39680912649450856], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 84, 0, 0.0, 0.35714285714285726, 0, 2, 1.0, 1.0, 2.0, 0.7083347387594023, 14.26506911007016, 0.0], "isController": false}, {"data": ["changeLanguage", 82, 0, 0.0, 1026.3658536585367, 444, 2570, 1411.7, 1800.849999999998, 2570.0, 0.6971129322950318, 14.367742613365865, 0.3884232761332336], "isController": true}, {"data": ["verifyLogout", 80, 0, 0.0, 1089.7249999999995, 419, 2029, 1520.7, 1941.6000000000008, 2029.0, 0.744483840047647, 15.364430655983325, 0.44250985277832067], "isController": true}, {"data": ["navigateToDashboard", 85, 0, 0.0, 1873.8941176470582, 779, 3445, 2530.6, 2881.3, 3445.0, 0.7401279986068179, 9.387482857329443, 0.7719303735469546], "isController": true}, {"data": ["navigateToSettings", 83, 0, 0.0, 2045.9759036144583, 906, 3477, 2935.000000000001, 3121.6, 3477.0, 0.7410714285714286, 9.236615862165179, 0.7837698800223214], "isController": true}, {"data": ["chooseOptions", 80, 0, 0.0, 966.8375000000002, 382, 2070, 1521.7, 1918.350000000001, 2070.0, 0.6955433062651063, 8.12304921838321, 0.41063545488532227], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 85, 0, 0.0, 0.34117647058823536, 0, 2, 1.0, 1.0, 2.0, 0.7492815711993794, 15.016837141997673, 0.0], "isController": false}, {"data": ["signUp", 79, 0, 0.0, 1086.6835443037971, 480, 2018, 1554.0, 1592.0, 2018.0, 0.6898719807185147, 8.51897577752502, 0.5568539927432454], "isController": true}, {"data": ["navigateToDhaka", 84, 0, 0.0, 1458.142857142857, 548, 2556, 2175.0, 2297.25, 2556.0, 0.6969913207985529, 47.627618708927294, 0.2715815791002174], "isController": true}, {"data": ["logout", 81, 0, 0.0, 2003.4074074074083, 916, 3845, 2581.4, 3274.1999999999975, 3845.0, 0.7297626019190053, 15.90613949389612, 0.7965501683634397], "isController": true}, {"data": ["navigateToApp", 84, 0, 0.0, 1071.72619047619, 404, 1991, 1598.5, 1832.75, 1991.0, 0.7023352647553114, 18.739457132465446, 0.2585746043093285], "isController": true}, {"data": ["SignUpUsingEmail", 80, 0, 0.0, 995.4375000000001, 399, 1901, 1535.9, 1557.45, 1901.0, 0.6927426547630386, 8.352149234086403, 0.40965851034351375], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 179, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
