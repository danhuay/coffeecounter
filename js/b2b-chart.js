var numberFormat = d3.format(".2f");
function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.value !== 0;
            });
        }
    };
}

// using # to refer the id in <div>
// total sales by origins chart
var originChart = dc.rowChart("#origin");

// four pie filter charts
// var sourceChart = dc.pieChart("#source");
var blendChart = dc.pieChart("#blend");
var roastLevelChart = dc.pieChart("#roastLevel");
var seasonalChart = dc.pieChart("#seasonal");

// Calendar filter year/month
var originHeatMapChart = dc.heatMap("#originHeatMap");
var datesData = { 1:"January",2: "February",3: "March",4: "April", 5: "May", 6:"June",
7:"July", 8:"August", 9:"September", 10:"October", 11: "November", 12:"December"};
originHeatMapChart.colsLabel(function(d) { return datesData[d]; });

// unit-price bubble chart
// var bubbleChart = dc.bubbleChart("#bubbleChart");

// reading the data, creating filter groups
d3.csv("csv/b2b.csv", function (err, data){
    if (err) throw err;

    // year,month,origin,blend,roast_level,type,sales,unit_price
    // 2014,1,Colombia,Single,medium,Seasonal,80.0,9.1
    // 2014,1,"Colombia, Brazil, Ethiopia ",Blend,dark,Evergreen,1402.75,10.381833333333333
    
    // reading the data
    var ndx = crossfilter(data);
    
    // for pie charts/rowcharts
    var originDim = ndx.dimension(function (d) {return d["origin"];});
    // var sourceDim = ndx.dimension(function (d) {return d["source"];});
    var blendDim = ndx.dimension(function (d) {return d["blend"];});
    var roastLevelDim = ndx.dimension(function (d) {return d["roast_level"];});
    var seasonalDim = ndx.dimension(function (d) {return d["type"];});
    
    // group of categorical features
    var originGroup = remove_empty_bins(originDim.group().reduceSum(function (d) {return +d.sales;}));
    // var sourceGroup = sourceDim.group().reduceSum(function (d) {return +d.sales;});
    var blendGroup = blendDim.group().reduceSum(function (d) {return +d.sales;});
    var roastLevelGroup = roastLevelDim.group().reduceSum(function (d) {return +d.sales;});
    var seasonalGroup = seasonalDim.group().reduceSum(function (d) {return +d.sales;});
    
    // for calendar filter
    var runDim = ndx.dimension(function(d) { return [+d.month, +d.year]; });
    var runGroup = remove_empty_bins(runDim.group().reduceSum(function(d) { return +d.sales; }));
    

    // var originBubbleGroup = originDim.group().reduce(
    //     // reduceAdd
    //     function (p,v){
    //         ++p.count;
    //         p.totalSales += +v.sales;
    //         // p.monthlySales += +v.monthly_sales;
    //         p.avgSales = p.totalSales / p.count;
    //         p.totalUnitPrice += +v.unit_price;
    //         p.avgUnitPrice = p.totalUnitPrice / p.count;
    //         return p;
    //     },
    //     //reduceSubtract
    //     function (p,v){
    //         --p.count;
    //         p.totalSales -= +v.sales;
    //         // p.monthlySales -= +v.monthly_sales;
    //         p.avgSales = p.count ? p.totalSales / p.count : 0; // guard divide by 0
    //         p.totalUnitPrice -= +v.unit_price;
    //         p.avgUnitPrice = p.count ? p.totalUnitPrice/p.count : 0; // guard divide by 0
    //         return p;
    //     },
    //     //reduceInitial
    //     function (){
    //         return{
    //             count: 0,
    //             totalSales: 0,
    //             // monthlySales: 0,
    //             avgSales: 0,
    //             totalUnitPrice: 0,
    //             avgUnitPrice: 0
    //         };
    //     }
    //
    // );
    
    // var filter_originBubbleGroup = remove_empty_bins(originBubbleGroup);
    //
    // var xRange = [-10, d3.max(originBubbleGroup.all(), function(d) { return d.value.avgUnitPrice + d.value.totalSales*2; }) ],
    // yRange = [-10, d3.max(originBubbleGroup.all(), function(d) { return d.value.avgSales + d.value.totalSales*2; }) ];
    
    //---------------------------------
    //--------CREATING CHARTS----------
    //---------------------------------
    
    
    // bubbleChart
    //     .width(800)
    //     .height(400)
    //     .transitionDuration(1500)
    //     .margins({top: 10, right: 50, bottom: 40, left: 50})
    //     .dimension(originDim)
    //     .group(filter_originBubbleGroup)
    //     .keyAccessor(function (p){
    //         return p.value.avgUnitPrice;
    //     })
    //     .valueAccessor(function (p){
    //         return p.value.avgSales;
    //     })
    //     .radiusValueAccessor(function (p){
    //         return p.value.totalSales * 0.2;
    //     })
    //     .maxBubbleRelativeSize(0.7)
    //     .x(d3.scale.linear().domain(xRange))
    //     .y(d3.scale.linear().domain(yRange))
    //     .r(d3.scale.linear().domain([0, 100000]))
    //     .elasticX(true)
    //     .elasticY(true)
    //     .xAxisLabel('Unit Price')
    //     .yAxisLabel('Monthly Sales')
    //     .renderLabel(true)
    //     .label(function(p){
    //         return p.key;
    //     })
    //     .on('renderlet', function(chart, filter){
    //         chart.svg().select(".chart-body").attr("clip-path",null);
    //     })
    //     .title(function (p) {
    //         return p.key
    //                 + "\n"
    //                 + "Unit Price: " + numberFormat(p.value.avgUnitPrice) + "\n"
    //                 + "Monthly Sales: " + numberFormat(p.value.avgSales);
    //     });
    // bubbleChart.yAxis().tickFormat(function (s) {
    //     return s;
    // });
    // bubbleChart.xAxis().tickFormat(function (s) {
    //     return s;
    // });
    //
    
    
    originChart
    .height(400)
    .width(400)
    .dimension(originDim)
    .group(originGroup)
    //    .data(function (group) {return group.top(10); })
    .elasticX(true)
    .xAxis().tickFormat(function(v) { return ""; });
    
    blendChart
    .width(175)
    .height(175)
    .dimension(blendDim)
    .group(blendGroup)
    .on('pretransition', function(chart) {
      chart.selectAll('text.pie-slice').text(function(d) {
        return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
      })
    });
    
    // sourceChart
    // .width(160)
    // .height(125)
    // .dimension(sourceDim)
    // .group(sourceGroup)
    // .on('pretransition', function(chart) {
    //   chart.selectAll('text.pie-slice').text(function(d) {
    //     return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
    //   })
    // });
    
    roastLevelChart
    .width(175)
    .height(175)
    .dimension(roastLevelDim)
    .group(roastLevelGroup)
    .on('pretransition', function(chart) {
      chart.selectAll('text.pie-slice').text(function(d) {
        return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
      })
    });
    
    seasonalChart
    .width(175)
    .height(175)
    .dimension(seasonalDim)
    .group(seasonalGroup)
    .on('pretransition', function(chart) {
      chart.selectAll('text.pie-slice').text(function(d) {
        return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
      })
    });
    
    originHeatMapChart
        .width(12 * 50 + 80)
        .height(20 * 4 + 40)
        .dimension(runDim)
        .group(runGroup)
        .keyAccessor(function(d) { return +d.key[0]; })
        .valueAccessor(function(d) { return +d.key[1]; })
        .colorAccessor(function(d) { return +d.value; })
        .colors(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
        .calculateColorDomain();
    
    originHeatMapChart.xBorderRadius(0);
    originHeatMapChart.yBorderRadius(0);
    
    dc.renderAll();

});
