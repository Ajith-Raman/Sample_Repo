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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4506172839506173, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.47560975609756095, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.5060975609756098, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.5128205128205128, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.07317073170731707, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.10625, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.49382716049382713, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.4050632911392405, 500, 1500, "signUp"], "isController": true}, {"data": [0.2926829268292683, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.06962025316455696, 500, 1500, "logout"], "isController": true}, {"data": [0.42771084337349397, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.46875, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 175, 0, 0.0, 116.66285714285715, 0, 2986, 1.0, 1421.5999999999997, 2970.8, 1.4346143756558238, 28.44694603902971, 0.06358095631394281], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 82, 0, 0.0, 1150.7560975609756, 390, 2073, 1920.8, 1999.75, 2073.0, 0.7012202943414944, 8.48586121824199, 0.4004658678883863], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 83, 0, 0.0, 0.4337349397590361, 0, 2, 1.0, 1.0, 2.0, 0.7000910961908297, 14.09910256018253, 0.0], "isController": false}, {"data": ["changeLanguage", 82, 0, 0.0, 993.1463414634148, 398, 2155, 1440.8000000000002, 1698.7999999999988, 2155.0, 0.7058074178638135, 14.546939017593541, 0.3934358565231238], "isController": true}, {"data": ["verifyLogout", 78, 0, 0.0, 1005.9743589743589, 442, 1965, 1504.3000000000002, 1821.6499999999996, 1965.0, 0.7203080702208021, 14.865498484351768, 0.42809775757939544], "isController": true}, {"data": ["navigateToDashboard", 82, 0, 0.0, 2067.7804878048782, 871, 3443, 2948.4, 3036.9999999999995, 3443.0, 0.708215297450425, 8.9827151203966, 0.7386464235127478], "isController": true}, {"data": ["navigateToSettings", 80, 0, 0.0, 1971.1499999999999, 781, 3545, 2881.1000000000004, 3018.25, 3545.0, 0.7063955285163045, 8.804420049271087, 0.7470960521319899], "isController": true}, {"data": ["chooseOptions", 81, 0, 0.0, 1010.3950617283953, 394, 2032, 1509.6, 1923.2999999999968, 2032.0, 0.688067549545111, 8.035742016611309, 0.4063832599960924], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 82, 0, 0.0, 0.3902439024390244, 0, 2, 1.0, 1.0, 2.0, 0.7269503546099291, 14.569221658909575, 0.0], "isController": false}, {"data": ["signUp", 79, 0, 0.0, 1085.0759493670894, 431, 2074, 1647.0, 1750.0, 2074.0, 0.6782105543298164, 8.374973104980985, 0.5476087444090554], "isController": true}, {"data": ["navigateToDhaka", 82, 0, 0.0, 1377.756097560975, 557, 2366, 2001.7, 2124.2, 2366.0, 0.7067137809187278, 49.487765488989915, 0.27536992049469966], "isController": true}, {"data": ["logout", 79, 0, 0.0, 2036.6962025316461, 891, 3587, 2779.0, 3058.0, 3587.0, 0.7118592140713841, 15.515725527586797, 0.776915275800391], "isController": true}, {"data": ["navigateToApp", 83, 0, 0.0, 1132.6867469879514, 477, 2414, 1838.8000000000004, 2002.3999999999999, 2414.0, 0.6916897229907664, 18.45541661284543, 0.2546552984057802], "isController": true}, {"data": ["SignUpUsingEmail", 80, 0, 0.0, 1080.55, 409, 2534, 1757.2000000000007, 1980.75, 2534.0, 0.6837373081262179, 8.2435750059827, 0.4045167526323886], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 175, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
