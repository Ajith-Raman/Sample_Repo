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

    var data = {"OkPercent": 99.6514464970373, "KoPercent": 0.34855350296270476};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1540326491029578, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.0, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.0, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.0, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.0, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.0, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.0, 500, 1500, "signUp"], "isController": true}, {"data": [0.0, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.0, 500, 1500, "logout"], "isController": true}, {"data": [0.0, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.0, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2869, 10, 0.34855350296270476, 2.299058905542001, 0, 3038, 1.0, 1.0, 2.0, 23.757276649304835, 464.9679764031616, 0.08247526922567343], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 1426, 1426, 100.0, 71.1942496493689, 3, 3059, 107.0, 149.0, 1065.73, 11.958071278825996, 49.636505830712785, 5.646218225890985], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 1429, 0, 0.0, 0.30300909727081926, 0, 39, 1.0, 1.0, 1.7000000000000455, 11.929408621898688, 234.66370177156728, 0.0], "isController": false}, {"data": ["changeLanguage", 1429, 1429, 100.0, 78.53463960811762, 3, 3085, 111.0, 146.0, 1061.0, 11.88525612768541, 49.344432074077, 5.553742849820765], "isController": true}, {"data": ["verifyLogout", 1427, 1427, 100.0, 70.26769446391039, 3, 3068, 111.0, 141.5999999999999, 1059.44, 12.007943587068109, 49.782393166011715, 5.860237847426749], "isController": true}, {"data": ["navigateToDashboard", 1430, 1430, 100.0, 78.32797202797211, 3, 7204, 108.0, 143.45000000000005, 1063.38, 12.020645248062406, 50.118255987206, 6.223757376305039], "isController": true}, {"data": ["navigateToSettings", 1430, 1430, 100.0, 77.004895104895, 3, 3071, 113.0, 153.45000000000005, 1068.0700000000002, 12.011658868888125, 49.825202932986706, 5.897862969441667], "isController": true}, {"data": ["chooseOptions", 1426, 1426, 100.0, 73.35694249649364, 3, 3173, 108.0, 141.64999999999986, 1059.65, 11.949353511484285, 49.72746232832231, 5.836985673973705], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 1430, 0, 0.0, 0.2937062937062947, 0, 31, 1.0, 1.0, 1.0, 12.021150499760418, 235.20600209004095, 0.0], "isController": false}, {"data": ["signUp", 1423, 1423, 100.0, 73.19606465214358, 3, 3068, 114.60000000000014, 143.79999999999995, 1066.76, 11.946538610071025, 50.17116284084994, 7.745378442605403], "isController": true}, {"data": ["navigateToDhaka", 1429, 1429, 100.0, 76.87963610916725, 3, 3080, 110.0, 150.0, 1068.7, 11.973990715758072, 49.62876354039232, 4.521660634458112], "isController": true}, {"data": ["logout", 1428, 1428, 100.0, 72.70728291316507, 3, 3071, 106.0, 142.54999999999995, 1062.0, 12.004135878748139, 49.97456121962188, 5.847077564539043], "isController": true}, {"data": ["navigateToApp", 1429, 1429, 100.0, 79.95591322603221, 3, 3077, 112.0, 154.0, 1080.9000000000003, 11.923038414043987, 49.47786025942412, 5.20817308795431], "isController": true}, {"data": ["SignUpUsingEmail", 1425, 1425, 100.0, 78.24491228070194, 3, 3099, 110.0, 146.10000000000014, 1081.92, 11.93467336683417, 49.668835715033495, 5.902952261306532], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401", 10, 100.0, 0.34855350296270476], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2869, 10, "401", 10, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["changeLanguage", 3, 3, "401", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["navigateToSettings", 2, 2, "401", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["chooseOptions", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["signUp", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["logout", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["SignUpUsingEmail", 2, 2, "401", 2, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
