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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3839869281045752, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.42857142857142855, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.3732394366197183, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.3695652173913043, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.028169014084507043, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.02112676056338028, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.40714285714285714, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.3235294117647059, 500, 1500, "signUp"], "isController": true}, {"data": [0.19444444444444445, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.05, 500, 1500, "logout"], "isController": true}, {"data": [0.410958904109589, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.36231884057971014, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 154, 0, 0.0, 88.63636363636363, 0, 3021, 1.0, 1001.25, 2398.399999999987, 1.267249821021535, 25.389837469038785, 0.056501328452227155], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 70, 0, 0.0, 1154.6142857142859, 495, 2122, 1549.7, 1667.45, 2122.0, 0.6017209218364522, 7.281763343161442, 0.3436726358814782], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 73, 0, 0.0, 0.4246575342465754, 0, 1, 1.0, 1.0, 1.0, 0.6106078475655148, 12.186720403293936, 0.0], "isController": false}, {"data": ["changeLanguage", 71, 0, 0.0, 1282.9577464788727, 497, 2445, 1906.0, 2053.3999999999987, 2445.0, 0.6043839114705257, 12.455974675462866, 0.3369566663119813], "isController": true}, {"data": ["verifyLogout", 69, 0, 0.0, 1213.927536231884, 508, 2390, 1794.0, 1999.5, 2390.0, 0.66663446210328, 13.757147903482924, 0.3962482186850877], "isController": true}, {"data": ["navigateToDashboard", 71, 0, 0.0, 2322.9577464788727, 980, 3973, 3033.6, 3364.3999999999983, 3973.0, 0.6337475007140817, 8.038195839135247, 0.6609788386353899], "isController": true}, {"data": ["navigateToSettings", 71, 0, 0.0, 2355.436619718311, 1171, 3784, 3177.2, 3416.5999999999995, 3784.0, 0.6373715157771893, 7.944113921742448, 0.6740950699088828], "isController": true}, {"data": ["chooseOptions", 70, 0, 0.0, 1133.942857142857, 495, 1979, 1573.1, 1821.4500000000005, 1979.0, 0.6043704618253715, 7.0582679228218925, 0.35699003004584584], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 71, 0, 0.0, 0.2394366197183099, 0, 1, 1.0, 1.0, 1.0, 0.6416629010393131, 12.744506891098057, 0.0], "isController": false}, {"data": ["signUp", 68, 0, 0.0, 1229.132352941177, 501, 2067, 1723.7, 1982.05, 2067.0, 0.5958796673589386, 7.3582992126501745, 0.4811399703812753], "isController": true}, {"data": ["navigateToDhaka", 72, 0, 0.0, 1633.5833333333335, 768, 2823, 2356.0, 2568.7999999999993, 2823.0, 0.5981904738167044, 40.58803661891528, 0.23308398345006356], "isController": true}, {"data": ["logout", 70, 0, 0.0, 2256.371428571429, 1060, 3944, 3146.1, 3776.65, 3944.0, 0.651187020912406, 14.192879124572078, 0.7108004309462678], "isController": true}, {"data": ["navigateToApp", 73, 0, 0.0, 1172.369863013698, 467, 2046, 1750.8000000000002, 1836.6999999999998, 2046.0, 0.6041145997120112, 16.116998778840266, 0.22241328524553536], "isController": true}, {"data": ["SignUpUsingEmail", 69, 0, 0.0, 1284.1159420289855, 481, 2009, 1733.0, 1938.0, 2009.0, 0.60050651419023, 7.2400912345630655, 0.35528438933274153], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 154, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
