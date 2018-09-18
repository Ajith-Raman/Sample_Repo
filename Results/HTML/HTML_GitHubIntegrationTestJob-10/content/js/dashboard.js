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

    var data = {"OkPercent": 99.41894247530506, "KoPercent": 0.5810575246949448};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15466426318161333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0017605633802816902, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.0023391812865497076, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.0, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.0, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.0, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.0, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.0, 500, 1500, "signUp"], "isController": true}, {"data": [0.0011695906432748538, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.0, 500, 1500, "logout"], "isController": true}, {"data": [5.841121495327102E-4, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.0, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1721, 10, 0.5810575246949448, 1.828006972690296, 0, 321, 1.0, 1.0, 3.7799999999999727, 14.334021855010661, 284.2974957626766, 0.07450453508128999], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 852, 849, 99.64788732394366, 123.13615023474175, 4, 1341, 280.4000000000001, 379.3499999999999, 1107.7600000000002, 7.364190328017632, 30.860818382924933, 3.5068802940922255], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 856, 0, 0.0, 0.30257009345794433, 0, 12, 1.0, 1.0, 1.42999999999995, 7.144228281462564, 142.65826837750487, 0.0], "isController": false}, {"data": ["changeLanguage", 855, 847, 99.06432748538012, 133.5204678362575, 3, 2123, 306.0, 408.99999999999966, 1168.8399999999965, 7.281677425948321, 31.31320068845918, 3.40211659679521], "isController": true}, {"data": ["verifyLogout", 853, 853, 100.0, 116.43141852286043, 3, 1459, 269.20000000000005, 379.5999999999999, 1153.220000000004, 7.49402586449255, 30.715225987599275, 3.5712086889627845], "isController": true}, {"data": ["navigateToDashboard", 855, 855, 100.0, 126.99532163742688, 3, 1333, 299.4, 413.79999999999905, 1111.4799999999975, 7.4807731007148295, 31.560126713796993, 3.9677780600080492], "isController": true}, {"data": ["navigateToSettings", 854, 854, 100.0, 120.83021077283358, 3, 1300, 299.0, 379.5, 1100.3000000000006, 7.506834383762735, 30.700972773441276, 3.578729051844624], "isController": true}, {"data": ["chooseOptions", 850, 850, 100.0, 124.1341176470588, 3, 1349, 296.9, 381.44999999999993, 1142.94, 7.435269419174248, 30.920991036673374, 3.633714573128062], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 855, 0, 0.0, 0.3426900584795325, 0, 10, 1.0, 1.0, 1.4399999999999409, 7.500789556795453, 148.99287987003018, 0.0], "isController": false}, {"data": ["signUp", 850, 850, 100.0, 120.7176470588235, 4, 1250, 291.0, 395.24999999999966, 1122.47, 7.440736720473406, 31.216215772611086, 4.820800661569033], "isController": true}, {"data": ["navigateToDhaka", 855, 845, 98.83040935672514, 140.9754385964911, 3, 3210, 287.4, 394.0, 1686.7999999999988, 7.219332612807349, 35.508105059760034, 2.7424591484987166], "isController": true}, {"data": ["logout", 854, 854, 100.0, 124.89110070257611, 3, 3099, 290.5, 380.75, 1112.5000000000005, 7.501625059292704, 31.604555271780185, 3.7442244514326872], "isController": true}, {"data": ["navigateToApp", 856, 846, 98.83177570093459, 142.28271028037398, 4, 3082, 293.30000000000007, 411.04999999999984, 1799.5799999999947, 7.142261159783062, 31.39653733833959, 3.0875834376303715], "isController": true}, {"data": ["SignUpUsingEmail", 850, 850, 100.0, 118.35294117647055, 4, 1325, 269.79999999999995, 362.3499999999998, 1090.3700000000001, 7.4393040312275724, 30.88691512574612, 3.6684469714374486], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401", 9, 90.0, 0.5229517722254503], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException", 1, 10.0, 0.05810575246949448], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1721, 10, "401", 9, "Non HTTP response code: org.apache.http.NoHttpResponseException", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["navigateToLogin", 2, 2, "401", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["changeLanguage", 3, 3, "401", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["verifyLogout", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["navigateToDashboard", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["signUp", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["logout", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["navigateToApp", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
