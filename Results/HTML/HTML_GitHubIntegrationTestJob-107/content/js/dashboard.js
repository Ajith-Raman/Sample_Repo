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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3755630630630631, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.35507246376811596, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.42028985507246375, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.3230769230769231, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.04285714285714286, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.043478260869565216, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.3880597014925373, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "signUp"], "isController": true}, {"data": [0.2318840579710145, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.043478260869565216, 500, 1500, "logout"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.3484848484848485, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 150, 0, 0.0, 107.52666666666669, 0, 2519, 1.9000000000000057, 1028.35, 2495.0300000000007, 1.2329341366584199, 24.026378561638488, 0.06655917878366938], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 69, 0, 0.0, 1267.0434782608695, 732, 2030, 1919.0, 2008.5, 2030.0, 0.5918885533900631, 7.2991881369235525, 0.33793003062379906], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 70, 0, 0.0, 0.47142857142857153, 0, 2, 1.0, 1.0, 2.0, 0.5876821814762576, 11.55351357860669, 0.0], "isController": false}, {"data": ["changeLanguage", 69, 0, 0.0, 1221.579710144927, 720, 2352, 1702.0, 1952.0, 2352.0, 0.5912089795218919, 12.429822382936338, 0.3294591026904293], "isController": true}, {"data": ["verifyLogout", 65, 0, 0.0, 1336.3692307692306, 738, 2245, 1985.2, 2017.7, 2245.0, 0.630731162971229, 13.27799968766678, 0.37485672092571926], "isController": true}, {"data": ["navigateToDashboard", 70, 0, 0.0, 2457.071428571429, 1290, 3974, 3431.7, 3511.1, 3974.0, 0.6187845303867403, 7.9287810773480665, 0.6453729281767956], "isController": true}, {"data": ["navigateToSettings", 69, 0, 0.0, 2369.579710144927, 1196, 4087, 3495.0, 4007.0, 4087.0, 0.6328997816954376, 7.9705816257269175, 0.6693656870860927], "isController": true}, {"data": ["chooseOptions", 67, 0, 0.0, 1227.9552238805975, 697, 2007, 1612.4000000000005, 1947.5999999999997, 2007.0, 0.5794895302675166, 6.842956445307432, 0.3422137040624811], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 70, 0, 0.0, 0.5428571428571429, 0, 4, 1.0, 1.4500000000000028, 4.0, 0.6325968099046587, 12.376348857372012, 0.0], "isController": false}, {"data": ["signUp", 65, 0, 0.0, 1311.1692307692313, 768, 2129, 2024.6, 2066.4, 2129.0, 0.5813797483072906, 7.254756273311092, 0.46938378777850326], "isController": true}, {"data": ["navigateToDhaka", 69, 0, 0.0, 1457.2898550724642, 843, 2220, 2059.0, 2149.5, 2220.0, 0.5878994947472458, 40.7357536882173, 0.2290741195353038], "isController": true}, {"data": ["logout", 69, 0, 0.0, 2382.173913043478, 1094, 4045, 3239.0, 3545.0, 4045.0, 0.6388593120688857, 14.189212160316652, 0.6972785548122772], "isController": true}, {"data": ["navigateToApp", 70, 0, 0.0, 1311.3285714285714, 751, 1982, 1731.8999999999999, 1843.3500000000001, 1982.0, 0.582901015080482, 15.788420463156493, 0.21460320574740402], "isController": true}, {"data": ["SignUpUsingEmail", 66, 0, 0.0, 1293.2272727272727, 702, 2467, 1877.6000000000004, 2008.95, 2467.0, 0.5766156157992679, 7.0269397163662735, 0.34108574645512446], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 150, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
