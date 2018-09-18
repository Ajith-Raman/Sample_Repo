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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4019088016967126, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4444444444444444, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.4041095890410959, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.37857142857142856, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.0410958904109589, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.04794520547945205, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.4236111111111111, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.40714285714285714, 500, 1500, "signUp"], "isController": true}, {"data": [0.17123287671232876, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.041666666666666664, 500, 1500, "logout"], "isController": true}, {"data": [0.4066666666666667, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4375, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 158, 0, 0.0, 97.35443037974684, 0, 2843, 1.0, 1074.749999999999, 2786.3599999999997, 1.3005827927957592, 25.796928504988312, 0.05862558289568997], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 72, 0, 0.0, 1103.930555555556, 441, 2196, 1585.8000000000002, 1744.0499999999988, 2196.0, 0.6323388633708931, 7.652288276261824, 0.3612139698585142], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 75, 0, 0.0, 0.3200000000000002, 0, 1, 1.0, 1.0, 1.0, 0.6289782876695096, 12.553497551702016, 0.0], "isController": false}, {"data": ["changeLanguage", 73, 0, 0.0, 1194.8904109589037, 566, 2202, 1669.6000000000004, 1818.3999999999999, 2202.0, 0.6181987551340136, 12.740689969090063, 0.34469344116526235], "isController": true}, {"data": ["verifyLogout", 70, 0, 0.0, 1231.0142857142857, 576, 2303, 1850.8, 2082.1, 2303.0, 0.6705109293281482, 13.837145467346119, 0.39856486714304873], "isController": true}, {"data": ["navigateToDashboard", 73, 0, 0.0, 2220.698630136986, 1203, 4118, 2905.6, 3074.899999999999, 4118.0, 0.6634916018323275, 8.415457934177997, 0.6920010065985603], "isController": true}, {"data": ["navigateToSettings", 73, 0, 0.0, 2139.999999999999, 1165, 3811, 2891.4, 3085.7999999999993, 3811.0, 0.6649784109748766, 8.288202596945654, 0.703292596763468], "isController": true}, {"data": ["chooseOptions", 72, 0, 0.0, 1182.1805555555552, 456, 2122, 1668.1000000000001, 1967.9999999999995, 2122.0, 0.6316177309133016, 7.376480902336109, 0.3731383177037187], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 73, 0, 0.0, 0.3150684931506851, 0, 1, 1.0, 1.0, 1.0, 0.6792277273784602, 13.490591925447779, 0.0], "isController": false}, {"data": ["signUp", 70, 0, 0.0, 1182.7285714285713, 496, 2364, 1759.7, 1929.0, 2364.0, 0.6239359663431112, 7.704756146883439, 0.5038491835352211], "isController": true}, {"data": ["navigateToDhaka", 73, 0, 0.0, 1752.123287671233, 702, 3649, 2453.4, 2601.1999999999994, 3649.0, 0.6175554953979426, 44.23938497182932, 0.24062953385134678], "isController": true}, {"data": ["logout", 72, 0, 0.0, 2224.9305555555543, 861, 3468, 2964.0, 3104.85, 3468.0, 0.6711159166324895, 14.627173844655307, 0.7325220035140375], "isController": true}, {"data": ["navigateToApp", 75, 0, 0.0, 1269.0400000000004, 463, 2514, 1854.200000000001, 2156.6, 2514.0, 0.6224686275811699, 16.60666058290037, 0.22917057870908306], "isController": true}, {"data": ["SignUpUsingEmail", 72, 0, 0.0, 1098.069444444445, 485, 2243, 1571.6000000000001, 1725.7499999999998, 2243.0, 0.632616660662666, 7.627231730997337, 0.37434624120267457], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 158, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
