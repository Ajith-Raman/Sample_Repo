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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4198782961460446, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49333333333333335, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.4276315789473684, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.43243243243243246, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.05128205128205128, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.05194805194805195, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.4594594594594595, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.410958904109589, 500, 1500, "signUp"], "isController": true}, {"data": [0.21428571428571427, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.04054054054054054, 500, 1500, "logout"], "isController": true}, {"data": [0.4423076923076923, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.41216216216216217, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 166, 0, 0.0, 87.53614457831324, 0, 2112, 1.0, 1070.4500000000007, 2103.29, 1.3682483947808743, 27.270332539481387, 0.06180235301632832], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 75, 0, 0.0, 1036.4266666666667, 415, 2016, 1704.4, 1866.8, 2016.0, 0.6470984107263033, 7.830901861055029, 0.3692505306206968], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 78, 0, 0.0, 0.4615384615384615, 0, 5, 1.0, 2.0, 5.0, 0.6553960945114777, 13.080876298188418, 0.0], "isController": false}, {"data": ["changeLanguage", 76, 0, 0.0, 1116.1973684210525, 451, 2425, 1779.6, 1980.5999999999995, 2425.0, 0.649456080532554, 13.384883909725605, 0.3617139231420001], "isController": true}, {"data": ["verifyLogout", 74, 0, 0.0, 1059.162162162162, 432, 2227, 1563.0, 1773.5, 2227.0, 0.695057577066857, 14.343707732985179, 0.4130940276708057], "isController": true}, {"data": ["navigateToDashboard", 78, 0, 0.0, 2155.2435897435903, 975, 4070, 3013.300000000001, 3237.149999999999, 4070.0, 0.6868434261159004, 8.71164298671222, 0.716356229581818], "isController": true}, {"data": ["navigateToSettings", 77, 0, 0.0, 2128.818181818181, 1299, 3537, 2995.6000000000004, 3189.5999999999985, 3537.0, 0.6913269886873765, 8.616607770133777, 0.7311593054183876], "isController": true}, {"data": ["chooseOptions", 74, 0, 0.0, 1118.0675675675677, 391, 2004, 1587.5, 1731.0, 2004.0, 0.6442513625045707, 7.524025433781407, 0.3802286929097526], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 78, 0, 0.0, 0.4230769230769232, 0, 6, 1.0, 1.0, 6.0, 0.6975621098570892, 13.854815623938007, 0.0], "isController": false}, {"data": ["signUp", 73, 0, 0.0, 1128.1506849315072, 479, 2338, 1622.2000000000007, 1872.6999999999996, 2338.0, 0.640232939546224, 7.90600148492383, 0.5166605822611624], "isController": true}, {"data": ["navigateToDhaka", 77, 0, 0.0, 1597.064935064935, 610, 2602, 2279.2, 2442.6999999999994, 2602.0, 0.648104504747155, 44.67008186264813, 0.2525329076114403], "isController": true}, {"data": ["logout", 74, 0, 0.0, 2208.905405405405, 863, 3225, 2908.5, 3060.75, 3225.0, 0.6859855016037228, 14.951127154133527, 0.7486852427368967], "isController": true}, {"data": ["navigateToApp", 78, 0, 0.0, 1171.7051282051282, 493, 2082, 1643.2, 1827.1999999999998, 2082.0, 0.6478566741696222, 17.283980939101472, 0.2385175450800269], "isController": true}, {"data": ["SignUpUsingEmail", 74, 0, 0.0, 1125.1621621621625, 496, 1994, 1550.5, 1602.0, 1994.0, 0.6425172785051922, 7.74659992229014, 0.3798327175876081], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 166, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
