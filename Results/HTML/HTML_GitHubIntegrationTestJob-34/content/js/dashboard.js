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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4656907593778591, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5119047619047619, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.5178571428571429, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.47560975609756095, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.12209302325581395, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.125, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.5059523809523809, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.4382716049382716, 500, 1500, "signUp"], "isController": true}, {"data": [0.3235294117647059, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.07738095238095238, 500, 1500, "logout"], "isController": true}, {"data": [0.4470588235294118, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.5, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 181, 0, 0.0, 73.03314917127072, 0, 1878, 1.0, 927.0000000000023, 1839.4600000000003, 1.4930051471558665, 29.964870429218358, 0.06639999907202719], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 84, 0, 0.0, 997.3214285714283, 388, 1961, 1472.0, 1512.25, 1961.0, 0.7222637810508937, 8.740520287873707, 0.4125038424003233], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 85, 0, 0.0, 0.3764705882352942, 0, 3, 1.0, 1.0, 3.0, 0.7178811526637614, 14.457420410205737, 0.0], "isController": false}, {"data": ["changeLanguage", 84, 0, 0.0, 966.5476190476189, 397, 1683, 1381.0, 1411.5, 1683.0, 0.7240692692934291, 14.92332219574006, 0.4036356196826163], "isController": true}, {"data": ["verifyLogout", 82, 0, 0.0, 1089.59756097561, 422, 2302, 1526.7, 1684.3499999999995, 2302.0, 0.766068759342302, 15.809893643731314, 0.45556494651532137], "isController": true}, {"data": ["navigateToDashboard", 86, 0, 0.0, 1860.9069767441858, 834, 3008, 2470.9, 2512.35, 3008.0, 0.7524191149451434, 9.543378383698752, 0.7847496237904426], "isController": true}, {"data": ["navigateToSettings", 84, 0, 0.0, 1885.9047619047615, 944, 3392, 2529.5, 2595.75, 3392.0, 0.7608833493360386, 9.483549011304554, 0.8047233079403613], "isController": true}, {"data": ["chooseOptions", 84, 0, 0.0, 992.8452380952377, 403, 1709, 1493.0, 1518.5, 1709.0, 0.7216618842248148, 8.428080540473204, 0.42625504196807507], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 86, 0, 0.0, 0.43023255813953504, 0, 1, 1.0, 1.0, 1.0, 0.7646619482875129, 15.324827812133229, 0.0], "isController": false}, {"data": ["signUp", 81, 0, 0.0, 1079.0370370370367, 434, 1969, 1551.3999999999999, 1611.1999999999998, 1969.0, 0.7099098151605185, 8.766415637406988, 0.5732241025337645], "isController": true}, {"data": ["navigateToDhaka", 85, 0, 0.0, 1345.4235294117655, 604, 2718, 1884.4, 2067.4, 2718.0, 0.7120060981228169, 48.21901785302938, 0.2774320636240273], "isController": true}, {"data": ["logout", 84, 0, 0.0, 1920.464285714286, 839, 2917, 2507.0, 2602.5, 2917.0, 0.7579038544824599, 16.51982984381767, 0.827424192697055], "isController": true}, {"data": ["navigateToApp", 85, 0, 0.0, 1129.2235294117645, 456, 1986, 1552.2000000000003, 1665.7000000000003, 1986.0, 0.7092080232286486, 18.922833604153457, 0.26110490698945366], "isController": true}, {"data": ["SignUpUsingEmail", 83, 0, 0.0, 1029.7951807228915, 403, 2452, 1502.0, 1573.6, 2452.0, 0.7245364712455044, 8.735475853512693, 0.42863349857275046], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 181, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
