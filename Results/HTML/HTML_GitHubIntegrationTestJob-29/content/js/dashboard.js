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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.45719661335841955, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.45121951219512196, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.5253164556962026, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.10843373493975904, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.1144578313253012, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.5182926829268293, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.44871794871794873, 500, 1500, "signUp"], "isController": true}, {"data": [0.2710843373493976, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.06790123456790123, 500, 1500, "logout"], "isController": true}, {"data": [0.44047619047619047, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4873417721518987, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 177, 0, 0.0, 83.75706214689265, 0, 2041, 1.0, 1013.5999999999999, 2016.04, 1.4618917043840232, 29.44382395922809, 0.061242847983910935], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 82, 0, 0.0, 993.9878048780488, 398, 2076, 1514.7, 1825.7999999999981, 2076.0, 0.7130744814991956, 8.629315405017609, 0.40743958976477235], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 84, 0, 0.0, 0.3690476190476189, 0, 3, 1.0, 1.0, 3.0, 0.7085976515049265, 14.270668683674417, 0.0], "isController": false}, {"data": ["changeLanguage", 82, 0, 0.0, 1071.9878048780483, 416, 2005, 1582.8, 1837.8, 2005.0, 0.7132419455848584, 14.700167247625426, 0.3977839213955187], "isController": true}, {"data": ["verifyLogout", 79, 0, 0.0, 1001.873417721519, 409, 2072, 1489.0, 1534.0, 2072.0, 0.7518510763842625, 15.516473434793575, 0.4470063954927004], "isController": true}, {"data": ["navigateToDashboard", 83, 0, 0.0, 1931.3132530120479, 922, 3987, 2494.2, 2565.2, 3987.0, 0.7411243660261447, 9.40012037690192, 0.7729695536288306], "isController": true}, {"data": ["navigateToSettings", 83, 0, 0.0, 1944.2048192771083, 827, 4047, 2519.8, 2954.2, 4047.0, 0.7440076014270603, 9.273211930677315, 0.7868752268999085], "isController": true}, {"data": ["chooseOptions", 82, 0, 0.0, 1019.5121951219511, 392, 1820, 1483.8, 1553.95, 1820.0, 0.7077812783220404, 8.265972956497345, 0.4182389894695956], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 83, 0, 0.0, 0.43373493975903593, 0, 2, 1.0, 1.0, 2.0, 0.7505742345047114, 15.042411259291748, 0.0], "isController": false}, {"data": ["signUp", 78, 0, 0.0, 967.782051282051, 474, 1994, 1544.2, 1587.6, 1994.0, 0.7018175274428649, 8.66648694776858, 0.5669053389868635], "isController": true}, {"data": ["navigateToDhaka", 83, 0, 0.0, 1461.8313253012045, 581, 2569, 1979.0000000000002, 2297.7999999999997, 2569.0, 0.7056623023295358, 47.54357418221816, 0.2749602135053562], "isController": true}, {"data": ["logout", 81, 0, 0.0, 2031.6790123456785, 870, 3825, 2828.399999999999, 3082.1, 3825.0, 0.7421864262349158, 16.17704052589864, 0.81016470411043], "isController": true}, {"data": ["navigateToApp", 84, 0, 0.0, 1151.3333333333333, 411, 2680, 1794.5, 2113.0, 2680.0, 0.7025291047771979, 18.744629102268167, 0.25864596923926136], "isController": true}, {"data": ["SignUpUsingEmail", 79, 0, 0.0, 1050.6075949367084, 402, 1996, 1501.0, 1546.0, 1996.0, 0.6928244435479628, 8.353135332073387, 0.410088420075246], "isController": true}]}, function(index, item){
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
