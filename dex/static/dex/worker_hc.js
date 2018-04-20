
var testo = []
//evol.forEach(function(d) {
//	var dia = new Date(d.key).getTime()
//	var m = [dia,d.value.close]
//
//	testo.push(m)
//})

vs = {'v1':[],'v2':[],'v3':[],'v4':[],'v5':[]}
//d3.entries(snap1).forEach(function(d) {
//	d = d.value
//	var minuto = d.index
//	var m = [minuto,d.vol_1]
//	vs['v1'].push(m)
//	var m = [minuto,d.vol_2]
//	vs['v2'].push(m)
//	var m = [minuto,d.vol_3]
//	vs['v3'].push(m)
//	var m = [minuto,d.vol_4]
//	vs['v4'].push(m)
//	var m = [minuto,d.vol_5]
//	vs['v5'].push(m)
//})


Highcharts.theme = {
    chart: {
        backgroundColor: 'rgba(0,0,0,0)',
        // spacingTop: 2,
        marginTop: 0,
    },
    yAxis : {
        gridLineColor: 'rgb(0,0,0)',
    },
    xAxis : {
        lineColor:'black', 
        // labels: {
        //     y: -20,
        // },
        tickColor:'black',
        // tickPosition:'inside',
    },
    // rangeSelector: {
    //     buttonTheme: {
    //         fill:'none',
    //         color: 'lightgrey',
    //     },
    //     buttonPosition: {
    //         // x:5,
    //         y:-25,
    //     },
    //     states: {
    //         select: {
    //             fill:'none',
    //             style: {
    //                 color:'white',
    //             },
    //         },
    //     },
    // },
    rangeSelector: {
            selected: 1,
            height: 10,
            inputEnabled: false,
            buttonPosition: {
                x:5,
                y:-25,
            },
            buttonTheme: { // styles for the buttons
            fill: 'none',
            stroke: 'none',
            'stroke-width': 0,
            r: 8,
            // style: {
            //     color: '#039',
            //     fontWeight: 'bold'
            // },
            states: {
                hover: {
                },
                select: {
                    fill: 'none',
                    style: {
                        color: 'lightgrey'
                    }
                }
                // disabled: { ... }
            }
        },
        },
    title: {
        align: 'right',
    },
}
Highcharts.setOptions(Highcharts.theme);

//vana = d3.entries(volterms)

function chartyBoyFunk(index) {
	if (index == 'RVI') { var datums = testo }
	var t1 = vana.map(function(d) {return [d.value.day,d.value['ttm_1']]})
	var t2 = vana.map(function(d) {return [d.value.day,d.value['ttm_2']]})
	var t3 = vana.map(function(d) {return [d.value.day,d.value['ttm_3']]})
	var t4 = vana.map(function(d) {return [d.value.day,d.value['ttm_4']]})
	var t5 = vana.map(function(d) {return [d.value.day,d.value['ttm_5']]})

	window.joni = Highcharts.stockChart('chartyboy', {


        rangeSelector: {
            selected: 1,
			height: 10,
			inputEnabled: false,
        },
		navigator: {
			enabled:false
        },
		scrollbar: {
			enabled:false
        },

        title: {
            text: 'RVI Index'
        },
		exporting: { enabled: false },
		// tooltip: {
		// 	enabled:true,
		//     formatter: function () {
	 //            return this.y;
	 //        }
	 //    },

        series: [{
            name: 'RVI Index',
            data: datums,
            type: 'area',
			lineWidth: 1,
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        }]
    })
}










function chartyBoyFunkV() {
	// if (index == 'v1') {var datums = vs['v1']; var datums2 = vs['v2']}

	window.joni = Highcharts.stockChart('chartyboy', {


        rangeSelector: {
            selected: 1,
			height: 10,
			inputEnabled: false,
        },
		navigator: {
			enabled:false
        },
		scrollbar: {
			enabled:false
        },

        title: {
            text: 'RVI Index'
        },
        legend: {enabled:true,},
		exporting: { enabled: false },
		yAxis: {min:0},
		// tooltip: {
		// 	enabled:true,
		//     formatter: function () {
	 //            return this.y;
	 //        }
	 //    },

        series: [{
            name: 'V 1',
            data: vs['v1'],
            type: 'area',
			lineWidth: 1,
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        },{
            name: 'V 2',
            data: vs['v2'],
            type: 'area',
			lineWidth: 1,
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        },{
            name: 'V 3',
            data: vs['v3'],
            type: 'area',
			lineWidth: 1,
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        },{
            name: 'V 4',
            data: vs['v4'],
            type: 'area',
			lineWidth: 1,
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        },{
            name: 'V 5',
            data: vs['v5'],
            type: 'area',
			lineWidth: 1,
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        }]
    })
}
