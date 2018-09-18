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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.41657922350472193, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4726027397260274, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.40540540540540543, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.45714285714285713, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.06, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.06756756756756757, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.4375, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.45774647887323944, 500, 1500, "signUp"], "isController": true}, {"data": [0.20666666666666667, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.0410958904109589, 500, 1500, "logout"], "isController": true}, {"data": [0.38, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4225352112676056, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 160, 0, 0.0, 101.14375, 0, 2511, 1.0, 1108.9499999999987, 2346.2999999999965, 1.3212875947610947, 26.51188074966555, 0.06668534619799495], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 73, 0, 0.0, 1063.808219178082, 464, 1992, 1504.2, 1622.7999999999997, 1992.0, 0.6242357387787213, 7.554227807564369, 0.356694206793053], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 75, 0, 0.0, 0.5066666666666666, 0, 2, 1.0, 1.0, 2.0, 0.634372858991601, 12.660983677057693, 0.0], "isController": false}, {"data": ["changeLanguage", 74, 0, 0.0, 1144.0540540540544, 495, 2264, 1700.0, 1797.0, 2264.0, 0.6306997357879486, 12.998327367254753, 0.3517555985255263], "isController": true}, {"data": ["verifyLogout", 70, 0, 0.0, 1133.7714285714285, 432, 2377, 1740.8, 1888.3500000000001, 2377.0, 0.6569623935955552, 13.557548145958274, 0.3906213339152143], "isController": true}, {"data": ["navigateToDashboard", 75, 0, 0.0, 2171.92, 1027, 3418, 2926.000000000001, 3192.2000000000003, 3418.0, 0.6631182472458489, 8.410722456278403, 0.6916116094321939], "isController": true}, {"data": ["navigateToSettings", 74, 0, 0.0, 2146.3378378378375, 1100, 3489, 2968.5, 3094.75, 3489.0, 0.6660366320147608, 8.301392123441788, 0.7044117895234238], "isController": true}, {"data": ["chooseOptions", 72, 0, 0.0, 1136.2083333333328, 553, 2045, 1568.3000000000002, 1751.5999999999992, 2045.0, 0.6227781093494564, 7.2732455172950665, 0.36800063899628926], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 75, 0, 0.0, 0.46666666666666673, 0, 9, 1.0, 1.0, 9.0, 0.6738665564520477, 13.384130470673327, 0.0], "isController": false}, {"data": ["signUp", 71, 0, 0.0, 1185.7746478873237, 417, 2611, 1526.1999999999998, 1979.9999999999993, 2611.0, 0.6308699785859627, 7.790381717987791, 0.5095274695005464], "isController": true}, {"data": ["navigateToDhaka", 75, 0, 0.0, 1641.5599999999997, 604, 3225, 2340.6000000000004, 2548.6000000000004, 3225.0, 0.6300297374036055, 42.783686968149894, 0.24549010275785016], "isController": true}, {"data": ["logout", 73, 0, 0.0, 2378.821917808219, 985, 4133, 3119.6000000000004, 3349.8999999999996, 4133.0, 0.6653178031752975, 14.500896655297025, 0.7262405927024663], "isController": true}, {"data": ["navigateToApp", 75, 0, 0.0, 1221.8933333333339, 470, 1985, 1853.4000000000003, 1944.2, 1985.0, 0.6302732864970251, 16.814878822082257, 0.23204397364197116], "isController": true}, {"data": ["SignUpUsingEmail", 71, 0, 0.0, 1166.4084507042253, 498, 2556, 1649.8, 1917.9999999999993, 2556.0, 0.6316220231476127, 7.615239743926198, 0.3738180022284692], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 160, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
