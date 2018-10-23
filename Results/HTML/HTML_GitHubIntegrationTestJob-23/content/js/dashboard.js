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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.44180407371484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5192307692307693, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.4810126582278481, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.4675324675324675, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.08024691358024691, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.06875, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.5, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.3618421052631579, 500, 1500, "signUp"], "isController": true}, {"data": [0.2625, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.08860759493670886, 500, 1500, "logout"], "isController": true}, {"data": [0.4146341463414634, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4807692307692308, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 173, 0, 0.0, 109.05202312138728, 0, 3508, 1.0, 1260.7999999999963, 2784.279999999991, 1.4236925482450726, 28.881995664115543, 0.058907979467555445], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 78, 0, 0.0, 1053.8076923076922, 399, 2014, 1539.5000000000005, 1633.2999999999995, 2014.0, 0.6783729485741122, 8.209372635478905, 0.38724128877814595], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 82, 0, 0.0, 0.3536585365853658, 0, 2, 1.0, 1.0, 2.0, 0.6859456429903883, 13.814377331796926, 0.0], "isController": false}, {"data": ["changeLanguage", 79, 0, 0.0, 1011.3291139240507, 405, 1915, 1702.0, 1785.0, 1915.0, 0.6703095302742329, 13.815315074646179, 0.3734861027440266], "isController": true}, {"data": ["verifyLogout", 77, 0, 0.0, 1060.4415584415583, 436, 2030, 1549.6, 1874.6999999999998, 2030.0, 0.7229639644714851, 14.920310020679587, 0.42969996995474435], "isController": true}, {"data": ["navigateToDashboard", 81, 0, 0.0, 2036.1975308641975, 904, 3315, 2918.2, 2999.9, 3315.0, 0.7108256107834878, 9.015823274273378, 0.7413688987468408], "isController": true}, {"data": ["navigateToSettings", 80, 0, 0.0, 2136.0874999999996, 844, 3578, 2996.3, 3254.6500000000005, 3578.0, 0.7144005286563913, 8.904193307853047, 0.7555622778660857], "isController": true}, {"data": ["chooseOptions", 78, 0, 0.0, 992.2307692307692, 393, 1959, 1528.0, 1568.5999999999997, 1959.0, 0.6755352317605486, 7.889380699828518, 0.3988154587144045], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 81, 0, 0.0, 0.34567901234567905, 0, 1, 1.0, 1.0, 1.0, 0.7266855066612838, 14.563752144731529, 0.0], "isController": false}, {"data": ["signUp", 76, 1, 1.3157894736842106, 1211.4210526315794, 437, 2229, 1790.6999999999998, 1993.6999999999998, 2229.0, 0.6876023487048648, 8.404221120701354, 0.5550014023468954], "isController": true}, {"data": ["navigateToDhaka", 80, 0, 0.0, 1454.9625, 521, 2640, 2128.2000000000003, 2482.5, 2640.0, 0.6668167004242621, 45.28230765984846, 0.2598240854192193], "isController": true}, {"data": ["logout", 79, 0, 0.0, 2042.0886075949365, 907, 3492, 3080.0, 3309.0, 3492.0, 0.7177576886385318, 15.644466480034525, 0.7834415317085359], "isController": true}, {"data": ["navigateToApp", 82, 0, 0.0, 1166.939024390244, 402, 2018, 1700.5000000000005, 1910.5, 2018.0, 0.6805939427139098, 18.15936299104438, 0.25057023086244534], "isController": true}, {"data": ["SignUpUsingEmail", 78, 0, 0.0, 1039.423076923077, 407, 2131, 1565.9, 1783.6, 2131.0, 0.6730636476598094, 8.114886517585944, 0.39801359933729114], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 173, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
