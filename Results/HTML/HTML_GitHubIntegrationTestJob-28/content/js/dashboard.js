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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.46207865168539325, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5182926829268293, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.5, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.5125, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.09523809523809523, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.07407407407407407, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.5185185185185185, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.39375, 500, 1500, "signUp"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.075, 500, 1500, "logout"], "isController": true}, {"data": [0.4470588235294118, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.50625, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 179, 0, 0.0, 79.38547486033521, 0, 2048, 1.0, 963.0, 2015.1999999999996, 1.4685251577228837, 29.89017050838454, 0.05986393581150372], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 82, 0, 0.0, 1043.5365853658539, 418, 1931, 1526.6000000000001, 1662.35, 1931.0, 0.69559316282818, 8.417764134537897, 0.39716938117657036], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 85, 0, 0.0, 0.28235294117647064, 0, 2, 1.0, 1.0, 2.0, 0.7123044305335579, 14.345069792740361, 0.0], "isController": false}, {"data": ["changeLanguage", 82, 0, 0.0, 995.9512195121952, 408, 1979, 1502.5, 1656.25, 1979.0, 0.6939331623888226, 14.302206437711035, 0.386734187632757], "isController": true}, {"data": ["verifyLogout", 80, 0, 0.0, 989.1125000000002, 417, 1851, 1495.7, 1566.25, 1851.0, 0.7309741143791746, 15.08562105388193, 0.43414080274663525], "isController": true}, {"data": ["navigateToDashboard", 84, 0, 0.0, 2005.0000000000005, 941, 3496, 2672.5, 2973.75, 3496.0, 0.7222824124232575, 9.16113669194655, 0.7533179848320694], "isController": true}, {"data": ["navigateToSettings", 81, 0, 0.0, 2078.901234567901, 942, 3520, 2988.0, 3061.3999999999996, 3520.0, 0.7044703426682901, 8.780424788550182, 0.7450599424899982], "isController": true}, {"data": ["chooseOptions", 81, 0, 0.0, 999.1358024691358, 393, 1956, 1501.6, 1573.1999999999998, 1956.0, 0.6953446248143602, 8.120728875151302, 0.41063091257543627], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 84, 0, 0.0, 0.2857142857142858, 0, 1, 1.0, 1.0, 1.0, 0.7352361946275241, 14.735367281661109, 0.0], "isController": false}, {"data": ["signUp", 80, 0, 0.0, 1149.7749999999999, 414, 2021, 1597.5, 1726.3, 2021.0, 0.6900477858091673, 8.521146730036055, 0.557109136448324], "isController": true}, {"data": ["navigateToDhaka", 84, 0, 0.0, 1273.654761904762, 565, 2665, 1818.0, 2220.0, 2665.0, 0.6962691577629867, 46.707910296287395, 0.27130018940178874], "isController": true}, {"data": ["logout", 80, 0, 0.0, 2074.8125, 1024, 4055, 2701.0000000000005, 3053.4, 4055.0, 0.7235824567433362, 15.7706704330641, 0.7894221006955436], "isController": true}, {"data": ["navigateToApp", 85, 0, 0.0, 1134.3764705882354, 413, 2279, 1753.4000000000005, 1982.8, 2279.0, 0.7062440280835861, 18.84374935087865, 0.26001367049561713], "isController": true}, {"data": ["SignUpUsingEmail", 80, 0, 0.0, 980.3124999999999, 385, 1980, 1499.9, 1521.45, 1980.0, 0.695077979060776, 8.38030539988705, 0.4111583094400278], "isController": true}]}, function(index, item){
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
