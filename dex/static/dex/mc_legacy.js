console.log('im here! optionsmath.js')


    window.charty = Highcharts.chart('holder', {

        chart: {
            zoomType: 'x',
            spacingRight: 0
        },
        exporting: { enabled: false },
        title: {
            text: ac,
        },
        // subtitle: {
        //     text: document.ontouchstart === undefined ?
        //             'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        // },
        xAxis: {
            type: 'datetime',
            // min: new Date('2015/06/06').getTime(),
            min: new Date(last_day).setFullYear( last_day.getFullYear() - 1 ),
            max: new Date(last_day).getTime(),
        },


        yAxis: {
        	min: bott,
        	max: upp,
            title: {
                text: 'GRAPHLOW'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
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
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        labels: {
          align: 'right',
          x: 0,
          y: 0
        },

        series: [{
            type: 'area',
            // name: 'USD to EUR',
            data: objects,
        }]
    });
};




function get_from_fin() {
  var ivrank = 30
  var ivpct = 50
  probability_meter(ivrank,ivpct)

  // var ar1 = sec_data.filter(function(d){ return d['0'] ==symbol})[0]
  // var ar2 = marketdata.filter(function(d){ return d['0'] ==symbol})[0]
  // var symbol = ar1[11]
  $('#wrtc2').show()
  var symbol = ac
  var symbol_code = 'SPFB.'+symbol
  var fin_code = emo[ac]
  var fin_format = d3.timeFormat("%d.%m.%Y")
  var today = fin_format(d3.timeDay(new Date()))
  var fin_format = d3.timeFormat("%Y")
  var yt = fin_format(d3.timeDay(new Date()))
  var fin_format = d3.timeFormat("%m")
  var mt = fin_format(d3.timeDay(new Date()))
  var fin_format = d3.timeFormat("%d")
  var dt = fin_format(d3.timeDay(new Date()))
  var fin_url = 'http://export.finam.ru/table.txt?market=14&em='+fin_code+'&code='+symbol_code+'&apply=0&df=1&mf=9&yf=2012&from=01.10.2012&dt='+dt+'&mt='+mt+'&yt='+yt+'&to='+today+'&p=8&f=table&e=.txt&cn='+symbol+'&dtf=1&tmf=1&MSOR=1&mstime=on&mstimever=1&sep=1&sep2=1&datf=1&at=1';

  var high_parse = d3.timeParse("%Y%m%d")
  console.log(fin_url)
  $.get(fin_url, function(data, status) {
  	window.finam_data = data;
    var finam_parse_date = d3.timeParse('%Y%m%d');
    var csv = d3.csvParse(data);
    var prev = 0;
    var rets = [];
    window.objects = [];
    console.log(objects)
    csv.forEach(function(d) {
      d.date = finam_parse_date(d['<DATE>']);
      d.close = +d['<CLOSE>'];
      d.return = Math.log(d.close / prev);
      rets.push(d.return);
      prev = d.close;
      var high_date = high_parse(d['<DATE>'])
      objects.push([high_date,+d['<CLOSE>']])
      // console.log(d.date);
    });
    console.log(objects)
    // svg.append("path")
    //     .attr("class",'line')
    //     .style("stroke", "red")
    //     .attr('d',valueline(csv));
    csv.shift(1);
    rets.shift(1);
    window.csvdata = csv;
    var csv_20days = csv.slice(-20);
    var rets20 = rets.slice(-20);
    var rets250d = rets.slice(-250);
    var realized_vol_30d =  d3.deviation(rets20) * Math.sqrt(252);
    var realized_vol_250d =  d3.deviation(rets250d) * Math.sqrt(252);
    console.log(realized_vol_30d);
    console.log('YOU DID ITTTT!!!!!!!!_---------------');

    document.getElementById('30_day_realized_volatility').innerHTML = (realized_vol_30d*100).toFixed(2)+'%';
    document.getElementById('250_day_realized_volatility').innerHTML = (realized_vol_250d*100).toFixed(2)+'%';
    console.log('30_day_realized_volatility')
    console.log(Math.round(realized_vol_30d*100)+'%')
    function right_pane_table() {
		// $('#holder').empty()
      $('#wrtc').empty()
      var wrtc = d3.select('#holder')
      var left_pane = wrtc.append('td').attr('class','col-xs-10')
      var right_pane = wrtc.append('td').attr('class','col-xs-2')
      var controller = right_pane.append('table').attr('class','table table-bordered')
      var c_head = controller.append('thead')
      c_head.append('tr').append('th').text(symbol)
      var c_body = controller.append('tbody')
      var unorow = c_body.append('tr')
      unorow.append('th').text('30 Real Vol')
      unorow.append('td').text((realized_vol_30d*100).toFixed(2)+' %')
      var dosrow = c_body.append('tr')
      dosrow.append('th').text('250 Real Vol')
      dosrow.append('td').text((realized_vol_250d*100).toFixed(2)+' %')
    }
    // right_pane_table()
    options_lab_chart()



    console.log("YOU APPENDED A NEW LINE");

    // var realized_vol = d3.s
  });
}

var price_from_fin


var Jordi= 'soy Jordi usa tu propio codigo!!!'
console.log(Jordi)

console.log('si')
var positions_tablist = []

function BlackScholes(PutCallFlag, S, X, T, r, v) {
  var d1 = (Math.log(S / X) + (r + v * v / 2) * T) / (v * Math.sqrt(T));
  var d2 = d1 - v * Math.sqrt(T);
  if (PutCallFlag === "CALL") {
    return ( S * CND(d1)-X * Math.exp(-r * T) * CND(d2) );
  } else {
    return ( X * Math.exp(-r * T) * CND(-d2) - S * CND(-d1) );
  }
}

/* The cummulative Normal distribution function: */
function CND(x){
  if(x < 0) {
    return ( 1-CND(-x) );
  } else {
    k = 1 / (1 + .2316419 * x);
    return ( 1 - Math.exp(-x * x / 2)/ Math.sqrt(2*Math.PI) * k * (.31938153 + k * (-.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) );
  }
}

// GOOD dN()
function dN(x) {
	// whats dN()
	return Math.exp(-0.5 * x ** 2) / Math.sqrt(2 * Math.PI)
}
// GOOD DELTA
function BSM_delta(S, X, t, T, r, v) {
	var d1 = (Math.log(S / X) + (r + v * v / 2) * T) / (v * Math.sqrt(T))
	var delta = CND(d1)
	return delta
}

// CONFIRM THIS
function BSM_delta2(PutCallFlag,S, X, t, T, r, v) {
	var d1 = (Math.log(S / X) + (r + v * v / 2) * T) / (v * Math.sqrt(T))
	if (PutCallFlag === "CALL") {
			return CND(d1)
	} else {
			return CND(-d1)*(-1)
	}
}

// GOOD GAMMA
function BSM_gamma(S, X, t, T, r, v) {
	var d1 = (Math.log(S / X) + (r + v * v / 2) * T) / (v * Math.sqrt(T))
	var gamma = dN(d1) / (S * v * Math.sqrt(T - t))
	return gamma
}
// GOOD THETA
function BSM_theta(S, X, t, T, r, v) {
	var d1 = (Math.log(S / X) + (r + v * v / 2) * T) / (v * Math.sqrt(T))
	var d2 = d1 - v * Math.sqrt(T - t)
	var theta = -(S * dN(d1) * v / (2 * Math.sqrt(T - t)) + r * X * Math.exp(-r * (T - t)) * CND(d2))
	return theta
}
// GOOD RHO
function BSM_rho(S, X, t, T, r, v) {
	var d1 = (Math.log(S / X) + (r + v * v / 2) * T) / (v * Math.sqrt(T))
	var d2 = d1 - v * Math.sqrt(T - t)
	var rho = X * (T - t) * Math.exp(-r * (T - t)) * CND(d2)
	return rho
}
// GOOD VEGA
function BSM_vega(S, X, t, T, r, v) {
	var d1 = (Math.log(S / X) + (r + v * v / 2) * T) / (v * Math.sqrt(T))
	var vega = S * dN(d1) * Math.sqrt(T - t)
	return vega
}







var is_there_st
var is_there_mt
var is_there_sr
var is_there_vy
var is_there_profit
var is_there_delta
var is_there_gamma
var is_there_theta
var is_there_rho
var is_there_vega

var is_there_molvarray
var molvarray = []

function restore_empty_greeks() {
		console.log('restoring the empty greeks')
		is_there_st = false
		is_there_mt = false
		is_there_sr = false
		is_there_vy = false
		is_there_profit = false
		is_there_delta = false
		is_there_gamma = false
		is_there_theta = false
		is_there_rho = false
		is_there_vega = false
}
restore_empty_greeks()

function redo_positions_tablist(inputer) {
		if (inputer.valueAsNumber < 0) {
				inputer.previousElementSibling.textContent = "SELL"
				inputer.style.borderColor = 'red'
		} else {
				inputer.previousElementSibling.textContent = "BUY"
				inputer.style.borderColor = 'green'
		}
		// window.inputer = inputer
		// console.log(inputer)


		var ror = d3.select('#positions_body')
		var mo = ror.selectAll('tr')
		positions_tablist = []
		mo["_groups"][0]["forEach"](function(x){
				positions_tablist.push(
					[
						x.children[1].innerText,
						x.children[2].innerText,
						x.children[3].innerText,
						x.children[4].innerText,
						x.children[5].innerText,
						x.children[6].innerText,
						x.children[7].innerText,
						x.children[8].firstElementChild.lastElementChild.valueAsNumber,
					]
				)
				// console.log()
		})
		console.log(positions_tablist)
		// x.children[6].innerText
		restore_empty_greeks()
}





var PutCallFlag,S,X,T,t,r,v
function get_that_Contract() {
		PutCallFlag = 'CALL'
		S1 = 100000
		X = 100000
		T = .01
		t = 0
		r = 0.05
		v = 0.2
		return PutCallFlag,S1,X,T,t,r,v
}
function get_that_Contract_UNO() {
		PutCallFlag = 'CALL'
		SUNO = 100000
		X = 100000
		T = 1
		t = 0
		r = 0.05
		v = 0.2
		$('#actual_stockprice')[0].value = S
		$('#actual_volatility')[0].value = v
		$('#actual_date')[0].value = T
		return PutCallFlag,SUNO,X,T,t,r,v
}
function put_actual(S,v,T) {
		$('#actual_stockprice')[0].value = S
		$('#actual_volatility')[0].value = v
		$('#actual_date')[0].value = T
}

function get_that_Contract_DOS() {
		if($('#s2_stockprice')[0].value == '') {
				console.log('hi')
				SDOS = 100000
				v = 0.2
				T = .00001
				$('#s2_stockprice')[0].value = S
				$('#s2_volatility')[0].value = v
				$('#s2_date')[0].value = T
		} else {
			S = $('#s2_stockprice')[0].value
			v = $('#s2_volatility')[0].value
			T = $('#s2_date')[0].value
		}
		PutCallFlag = 'CALL'
		X = 100000
		t = 0
		r = 0.05
		return PutCallFlag,SDOS,X,T,t,r,v
}
function get_that_Contract_TRES() {
	if($('#s3_stockprice')[0].value == '') {
			console.log('hi')
			STRES = 100000
			v = 0.2
			T = .75
			$('#s3_stockprice')[0].value = S
			$('#s3_volatility')[0].value = v
			$('#s3_date')[0].value = T
	} else {
		S = $('#s3_stockprice')[0].value
		v = $('#s3_volatility')[0].value
		T = $('#s3_date')[0].value
	}
	PutCallFlag = 'CALL'
	X = 100000
	t = 0
	r = 0.05
	return PutCallFlag,STRES,X,T,t,r,v
}
function draw_greek_manager(which_greek) {
	var l1 = 75000
	var l2 = 125000
	var ll = 250
	var klist = d3.range(l1,l2,ll)
	var ksers
	if (which_greek == 'strike') {
		if (is_there_st == true) {
			console.log('I shouldnt be redrawing...')
		} else {
			var ll1 = 75
			var ll2 = 125
			var lll = 0.25
			var lklist = d3.range(ll1,ll2,lll)

			var ksers1 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_UNO()
				return BlackScholes(PutCallFlag, S, d, T, r, v)
			})
			var ksers2 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_DOS()
				return BlackScholes(PutCallFlag, S, d, T, r, v)
			})
			var ksers3 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_TRES()
				return BlackScholes(PutCallFlag, S, d, T, r, v)
			})
			var ksers = [ksers1,ksers2,ksers3]
			draw_greek(which_greek,klist,ksers)
			is_there_st = true
		}
	}
	if (which_greek == 'maturity') {
		// draw matureter
		if (is_there_mt == true) {
			//
		} else {
			var ll1 = .0001
			var ll2 = 1
			var lll = .005
			var lklist = d3.range(ll1,ll2,lll)

			var ksers1 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_UNO()
				return BlackScholes(PutCallFlag, S, X, d, r, v)
			})
			var ksers2 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_DOS()
				return BlackScholes(PutCallFlag, S, X, d, r, v)
			})
			var ksers3 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_TRES()
				return BlackScholes(PutCallFlag, S, X, d, r, v)
			})
			var ksers = [ksers1,ksers2,ksers3]
			draw_greek(which_greek,klist,ksers)
			is_there_mt = true
		}
	}
	if (which_greek == 'short_rate') {
		// draw shortrater
		if (is_there_sr == true) {
			//
		} else {
			var ll1 = 0
			var ll2 = 0.1
			var lll = .0005
			var lklist = d3.range(ll1,ll2,lll)

			var ksers1 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_UNO()
				return BlackScholes(PutCallFlag, S, X, T, d, v)
			})
			var ksers2 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_DOS()
				return BlackScholes(PutCallFlag, S, X, T, d, v)
			})
			var ksers3 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_TRES()
				return BlackScholes(PutCallFlag, S, X, T, d, v)
			})
			var ksers = [ksers1,ksers2,ksers3]
			draw_greek(which_greek,klist,ksers)
			is_there_sr = true
		}
	}
	if (which_greek == 'volatility') {
		// draw volatiliter
		if (is_there_vy == true) {
			//
		} else {
			var ll1 = .01
			var ll2 = .51
			var lll = .0025
			var lklist = d3.range(ll1,ll2,lll)


			var ksers1 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_UNO()
				return BlackScholes(PutCallFlag, S, X, T, r, d)
			})
			var ksers2 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_DOS()
				return BlackScholes(PutCallFlag, S, X, T, r, d)
			})
			var ksers3 = lklist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_TRES()
				return BlackScholes(PutCallFlag, S, X, T, r, d)
			})
			var ksers = [ksers1,ksers2,ksers3]
			draw_greek(which_greek,klist,ksers)
			is_there_vy = true
		}
	}
	if (which_greek == 'profit') {
		if (is_there_profit == true) {
			//
		} else {
			//
			// var l1 = 75
			// var l2 = 125
			// var ll = 0.25
			// var klist = d3.range(l1,l2,ll)
			var solvalist = d3.range(50000,150000,10)
			// window.solvarray = solvalist.map(function(d) {
			// 		var sol = 0
			// 		positions_tablist.forEach(function(x) {
			// 				var sol1 = BlackScholes(x[1], d, x[2], x[3], r, v) * x[7] -x[6] * x[7]
			// 				sol = sol+sol1
			// 		})
			// 		return sol
			// })
			window.molvarray = solvalist.map(function(d) {
					var sol = 0
					positions_tablist.forEach(function(x) {
							var sol1 = BlackScholes(x[1], d, x[2], x[3], r, v) * x[7] -x[6] * x[7]
							sol = sol+sol1
					})
					return [d,sol]
			})
			if (is_there_molvarray != true) {
				if (molvarray.length > 0) {
					d3.select('#right_controller').append('button').attr('onclick','proby_probs_profits()').text('Calculate Probability of Profit')
					is_there_molvarray = true
				}
			}



			var ksers1 = klist.map(function(d) {
				var sol = 0
				positions_tablist.forEach(function(x) {
						var sol1 = BlackScholes(x[1], d, x[2], x[3]/250, r, v) * x[7] -x[6] * x[7]
						sol = sol+sol1
				})
				return sol
			})
			var ksers2 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_DOS()
				// return BlackScholes(PutCallFlag, d, X, T, r, v)
				var sol = 0
				positions_tablist.forEach(function(x) {
						var sol1 = BlackScholes(x[1], d, x[2], T, r, v)  * x[7] -x[6] * x[7]
						sol = sol+sol1
				})
				return sol
			})
			var ksers3 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_TRES()
				// return BlackScholes(PutCallFlag, d, X, T, r, v)
				var sol = 0
				positions_tablist.forEach(function(x) {
						var sol1 = BlackScholes(x[1], d, x[2], T, r, v)  * x[7] -x[6]*x[7]
						sol = sol+sol1
				})
				return sol
			})
			var ksers = [ksers1,ksers2,ksers3]
			window.ksers = ksers
			draw_greek(which_greek,klist,ksers)
			is_there_profit = true
		}
	}
	if (which_greek == 'delta') {
		if (is_there_delta == true) {
			//
		} else {
			//
			// var l1 = 75
			// var l2 = 125
			// var ll = 0.25
			// var klist = d3.range(l1,l2,ll)


			var ksers1 = klist.map(function(d) {
				var sol = 0
				positions_tablist.forEach(function(x) {
						var sol1 = BSM_delta2(x[1],d, x[2], t, x[3], r, v) * x[7]
						sol = sol + sol1
				})
				return sol
				// PutCallFlag,S,X,T,t,r,v = get_that_Contract_UNO()
				// return BSM_delta(d, X, t, T, r, v)
			})
			var ksers2 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_DOS()
				// return BSM_delta(d, X, t, T, r, v)
				var sol = 0
				positions_tablist.forEach(function(x) {
						var sol1 = BSM_delta2(x[1],d, x[2], t, T, r, v) * x[7]
						sol = sol+sol1
				})
				return sol
			})
			var ksers3 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_TRES()
				// return BSM_delta(d, X, t, T, r, v)
				var sol = 0
				positions_tablist.forEach(function(x){
						var sol1 = BSM_delta2(x[1],d, x[2], t, T, r, v) * x[7]
						sol = sol+sol1
				})
				return sol
			})
			var ksers = [ksers1,ksers2,ksers3]
			draw_greek(which_greek,klist,ksers)
			is_there_delta = true
		}
	}
	if (which_greek == 'gamma') {
		if (is_there_gamma == true) {
			//
		} else {
			//
			// var l1 = 75
			// var l2 = 125
			// var ll = 0.25
			// var klist = d3.range(l1,l2,ll)


			var ksers1 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_UNO()
				return BSM_gamma(d, X, t, T, r, v)
			})
			var ksers2 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_DOS()
				return BSM_gamma(d, X, t, T, r, v)
			})
			var ksers3 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_TRES()
				return BSM_gamma(d, X, t, T, r, v)
			})
			var ksers = [ksers1,ksers2,ksers3]
			draw_greek(which_greek,klist,ksers)
			is_there_gamma = true
		}
	}
	if (which_greek == 'theta') {
		if (is_there_theta == true) {
			//
		} else {
			//
			// var l1 = 75
			// var l2 = 125
			// var ll = 0.25
			// var klist = d3.range(l1,l2,ll)


			var ksers1 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_UNO()
				return BSM_theta(d, X, t, T, r, v)
			})
			var ksers2 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_DOS()
				return BSM_theta(d, X, t, T, r, v)
			})
			var ksers3 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_TRES()
				return BSM_theta(d, X, t, T, r, v)
			})
			var ksers = [ksers1,ksers2,ksers3]
			draw_greek(which_greek,klist,ksers)
			is_there_theta = true
		}
	}
	if (which_greek == 'rho') {
		if (is_there_rho == true) {
			//
		} else {
			//
			// var l1 = 75
			// var l2 = 125
			// var ll = 0.25
			// var klist = d3.range(l1,l2,ll)


			var ksers1 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_UNO()
				return BSM_rho(d, X, t, T, r, v)
			})
			var ksers2 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_DOS()
				return BSM_rho(d, X, t, T, r, v)
			})
			var ksers3 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_TRES()
				return BSM_rho(d, X, t, T, r, v)
			})
			var ksers = [ksers1,ksers2,ksers3]
			draw_greek(which_greek,klist,ksers)
			is_there_rho = true
		}
	}
	if (which_greek == 'vega') {
		if (is_there_vega == true) {
			//
		} else {
			//
			// var l1 = 75
			// var l2 = 125
			// var ll = 0.25
			// var klist = d3.range(l1,l2,ll)


			var ksers1 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_UNO()
				return BSM_vega(d, X, t, T, r, v)
			})
			var ksers2 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_DOS()
				return BSM_vega(d, X, t, T, r, v)
			})
			var ksers3 = klist.map(function(d) {
				PutCallFlag,S,X,T,t,r,v = get_that_Contract_TRES()
				return BSM_vega(d, X, t, T, r, v)
			})
			var ksers = [ksers1,ksers2,ksers3]
			draw_greek(which_greek,klist,ksers)
			is_there_vega = true
		}
	}
	function draw_greek(which_greek,klist,ksers) {
		var maxo = []
		var mino = []
		ksers.forEach(function(x) {
			maxo.push(d3.max(x))
			mino.push(d3.min(x))
		})
		var maxo = d3.max(maxo)
		var mino = d3.min(mino)
		klist = klist.map(function(d){return d.toFixed(2)})
		window.varia = Highcharts.chart(which_greek+'_container', {
		chart: {
          zoomType: 'x'
      },

    title: {
        text: which_greek
    },

    subtitle: {
        enabled:false,
    },

    yAxis: {
        title: {
            text: 'Present Value'
        },
				// endOnTick:false,
				// max: maxo,
				// min: mino,
				// minorTickInterval:'auto',
				maxPadding:.01,

    },
		xAxis: {
				categories: klist,
				title: {text:which_greek}
		},
    legend: {
			// enabled:false
        // layout: 'horizontal',
        align: 'right',
        verticalAlign: 'top',
				horizontalAlign: 'right',
    },
		exporting: {
				enabled:false
		},
    // plotOptions: {
    //     series: {
    //         pointStart: 2010
    //     }
    // },

    series: [{
        name: 'Actual',
        data: ksers[0],
    },{
        name: 'Scenario 1',
        data: ksers[1],
    },{
        name: 'Scenario 2',
        data: ksers[2],
    }]

});
	}

}



// What the fuck is this?
// var S=66000;
var r = 0.05;
var sigma = 0.2;
var M = 60;


function monte_carlo_single_path_v1(S,r,sigma,M) {
	var T = 1
	var dt = T/252
	var rands = d3.range(M).map(d3.randomNormal())
	var patho = rands.map(function(d,ix) {
		if (ix == 0) {
			return S
		} else {
			S = S * Math.exp((r - 0.5 * sigma**2) * dt + sigma * d * Math.sqrt(dt));
			return S
		}
	})
	return patho
}

var I = 25;
function monte_carlo_array_v1(S,r,sigma,M,I) {
	var rayo = d3.range(I).map(function(d) {
		return monte_carlo_single_path_v1(S,r,sigma,M)
	})
	return rayo
}

var moca = monte_carlo_array_v1(S,r,sigma,M,I)
var nos = moca.map(function(d) {return d.slice(-1)[0]})

// $('#paths_to_draw').defaultValue = 200
// $('#paths_to_compute').defaultValue = 5000
// $('#number_of_bins').defaultValue = 20


var has_charty_charts_been_done
var user_has_been_alerted_about_paths_drawn
var user_has_been_alerted_about_paths_computed
var user_has_been_alerted_about_steps
function charty_charts(I,I2,kiks) {
	if ($('#paths_to_compute')[0].valueAsNumber > 0) {
		// var I = $('#paths_to_draw')[0].valueAsNumber
		var I2 = $('#paths_to_compute')[0].valueAsNumber
		// var kiks = $('#number_of_bins')[0].valueAsNumber
		// var M = $('#number_of_steps')[0].valueAsNumber

		if ($('#paths_to_draw')[0].valueAsNumber > 0) {
			var I = $('#paths_to_draw')[0].valueAsNumber
		} else {
			var I = 250
			$('#paths_to_draw')[0].valueAsNumber = I
		}
		if ($('#number_of_bins')[0].valueAsNumber > 0) {
			var kiks = $('#number_of_bins')[0].valueAsNumber
		} else {
			var kiks = 40
			$('#number_of_bins')[0].valueAsNumber = kiks
		}
		if ($('#number_of_steps')[0].valueAsNumber > 0) {
			var M = $('#number_of_steps')[0].valueAsNumber
		} else {
			var M = 90
			$('#number_of_steps')[0].valueAsNumber = M
		}

		if (I > 250) {
			if (user_has_been_alerted_about_paths_drawn != true) {
				alert('Drawing more than 250 paths can be a significant drain on your computer resources. Click again if you wish to continue.')
				user_has_been_alerted_about_paths_drawn = true
				return
			}
		}
		if (I2 > 10000) {
			if (user_has_been_alerted_about_paths_computed != true) {
				alert('Computing more than 10 000 paths can be a significant drain on your computer resources. Click again if you wish to continue.')
				user_has_been_alerted_about_paths_computed = true
				return
			}
		}
		if (M > 90) {
			if (user_has_been_alerted_about_steps != true) {
				alert('These simulations are using volatility from the past 90 days, so we advise against relying on projections further than 90 days into the future as conditions are more likely to change drastically.')
				user_has_been_alerted_about_steps = true
				return
			}
		}


	} else {
		var I = 250
		$('#paths_to_draw')[0].valueAsNumber = I
		var I2 = 10000
		$('#paths_to_compute')[0].valueAsNumber = I2
		var kiks = 40
		$('#number_of_bins')[0].valueAsNumber = kiks
		var M = 90
		$('#number_of_steps')[0].valueAsNumber = M
	}

  window.I = I;
  window.I2 = I2;
	window.M = M
  $('#wrtc').hide()
  $('#wrtc2').show()
  $('#rider').empty()
	window.moca = monte_carlo_array_v1(S,r,sigma,M,I)
    window.nos = moca.map(function(d) {return d.slice(-1)[0]})

    var xxx = d3.scaleLinear().domain([d3.min(nos), d3.max(nos)]).range([0, 50])
    var xxaxis = d3.axisBottom().scale(xxx)

    window.mocax = monte_carlo_array_v1(S,r,sigma,M,I2)
    window.nostra = mocax.map(function(d) {return d.slice(-1)[0]})
    window.histogram = d3.histogram().domain(xxx.domain()).thresholds(xxx.ticks(kiks))
    window.bins = histogram(nostra)
      /* implementation heavily influenced by http://bl.ocks.org/1166403 */

    // define dimensions of graph
    var m = [0, 0, 0, 0]; // margins
    // var w = 1000 - m[1] - m[3]; // width
    // var h = 400 - m[0] - m[2]; // height
    var ddd = d3.timeDay.count(new Date(charty.axes[0].min), new Date(charty.axes[0].max))
    var ppd = charty.plotBox.width / ddd;
    var w = moca[1].length*ppd
    var h = charty.chartHeight
    var height = charty.chartHeight;


    var chartymin = charty.axes[1].dataMin;
    var chartymax = charty.axes[1].dataMax;
    var chartymin = charty.axes[1].min;
    var chartymax = charty.axes[1].max;
    var plotheight = charty.plotBox.height;
    var top_margin = charty.plotBox.y;

    // create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
    // var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];
    var data = moca[1]
    // X scale will fit all values from data[] within pixels 0-w
    var x = d3.scaleLinear().range([0, w]);
    x.domain([0, data.length])
    // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
    var y = d3.scaleLinear().range([plotheight+top_margin,top_margin]);
    y.domain([chartymin, chartymax])
      // automatically determining max range can work something like this
      // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

    // create a line function that can convert data[] into x and y points
    window.line = d3.line()
      // assign the X function to plot our line as we wish
      .x(function(d,i) {
        return x(i);
      })
      .y(function(d) {
        return y(d);
      })

      var wet = d3.max(bins, function(d) { return d.length; }) / I2
      var x2 = d3.scaleLinear().range([0, w]);
        x2.domain([0, wet])

      var line2 = d3.line()
      // assign the X function to plot our line as we wish
      .x(function(d) {
        return x2(-d.length/I2);
      })
      .y(function(d) {
        return y(d.x0);
      })

      window.line3 = d3.line()
      // assign the X function to plot our line as we wish
      .x(function(d) {
        return x2(-d.length/I2);
      })
      .y(function(d) {
        return y(d.x0);
      })
      .curve(d3.curveBasis)



      // Add an SVG element with the desired dimensions and margin.
      window.graph = d3.select("#rider").append("svg")
            .attr('id','linda')
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
          .append("g");
            // .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

      // create yAxis
      var xAxis = d3.axisBottom().scale(x).ticks(10);
      var h3 = plotheight+top_margin;
      // Add the x-axis.
      graph.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h3 + ")")
            .call(xAxis);


      // create left yAxis
      // var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
      var yAxisLeft = d3.axisRight().scale(y).ticks(8)
      // Add the y-axis to the left
      graph.append("g")
            .attr("class", "y axis")
            // .attr("transform", "translate(-25,0)")
            .call(yAxisLeft);

        graph.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(200,0)")
            .call(yAxisLeft);

        graph.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(200,50)")
            .call(xxaxis);



      var moca_mean = d3.mean(nos)
      var moca_std = d3.deviation(nos)
      for (var i in moca) {
        var datums = moca[i]
        if (moca_mean-moca_std < datums.slice(-1)[0] && datums.slice(-1)[0] < moca_mean+moca_std) {
          graph.append("path")
            .attr("class",'line')
            .attr("d", line(datums))
            .attr("style","stroke:rgba(255,255,0,0.5)")
        } else if (moca_mean-2*moca_std < datums.slice(-1)[0] && datums.slice(-1)[0] < moca_mean+2*moca_std) {
          graph.append("path")
            .attr("class",'line')
            .attr("d", line(datums))
            .attr("style","stroke:rgba(255,69,0,0.5)")
        } else {
          graph.append("path")
            .attr("class",'line')
            .attr("d", line(datums))
            .attr("style","stroke:rgba(0,128,128,0.5)")
        }
      }
      // window.tammy = graph.append("path")
      //       .attr("class",'line')
      //       .attr("d", line2(bins))
      //       .attr("style","stroke:black")
      //       .attr('transform','translate(200,0)')
    window.tammy2 = graph.append("path")
            .attr("class",'line')
            .attr("d", line3(bins))
            .attr("style","stroke:steelblue;stroke-width: 5px;")
            .attr('transform','translate(200,0)')


						// var mm = graph.append("path")
						//             .attr("class",'line')
						//             .attr("d", line(axl))
						//             .attr("style","stroke:black")


has_charty_charts_been_done = true
}
// THIS SECTION IS TO DEAL WITH POSITIONS TABLE
function remove_contracts() {
	var nn = d3.select('#positions_panel_body')
	var casp = nn.selectAll('input')
	casp["_groups"][0].forEach(function(d) {
		// console.log(d)
		if (d.checked == true) {
			var to_remove = d.parentElement.parentElement.children[1].innerHTML
			console.log(d.parentElement.parentElement)
			d.parentElement.parentElement.remove()
			var to_remove = d.parentElement.parentElement.children[1].innerHTML
			positions_tablist = positions_tablist.filter(function(m){if(m[0] != to_remove){return m}})
		}
	})
	restore_empty_greeks();
}

function selecting_the_alls() {
		d3.select('#positions_panel_body').selectAll('input').attr('checked','true')
}


// THIS SECTION IS THE SECTION OF ALL OPTIONS ALL PARAMS
function all_options_all_params() {
		url = 'http://0.0.0.0:8080/all_options_all_params.json'
		$.getJSON(url, function(data) {
			console.log(data)
			window.yyy = data
		})

}
function i_forgot_the_option_bases() {
	var option_bases = []
	for (var i in yyy) {
		if (yyy[i]['Option base']) {
			if (option_bases.includes(yyy[i]['Option base'])) {

			} else {option_bases.push(yyy[i]['Option base'])}
		}
	}
	alert('No Worries! \n Here they are, choose one of them and check out the smile \n'+option_bases)
}


function visualize_the_smile() {
		var symboly = $('#viz_the_smil')[0].value
		console.log(symboly)

		// console.log('below option_bases')
		// console.log(option_bases)
		var expys = []
		window.yyy_sub = []
		for (var i in yyy) {
				if (yyy[i]['Option base']) {
						if (yyy[i]['Option base'] == symboly) {
								yyy_sub.push(yyy[i])
								if (expys.includes(yyy[i]['Expiration'])) {} else {expys.push(yyy[i]['Expiration'])}
								// siriosna.push({'name':yyy[i]['Expiration'],'data':[yyy[i]['Strike'],yyy[i]['Volatility']]})
						}
				}
		}
		console.log('yyy_sub')
		console.log(yyy_sub)

		var siriosna = []
		var olms = []
		expys.forEach(
				function(d) {
						var nelo = []
						var nel = yyy_sub.filter(function(u) { return u['Expiration'] == d})
						nel.forEach(function(t) {nelo.push([t['Strike'],t['Volatility']])})
						siriosna.push({'name':d,'data':nelo})
				}
		)
		console.log(expys)
		Highcharts.chart('viz_the_smil_chart', {
		chart: {
				type: 'spline'
		},
		title: {
				text: yyy_sub[0]['Option Base']
		},
		subtitle: {
				text: 'Smile'
		},
		// xAxis: {
		//     type: 'datetime',
		//     dateTimeLabelFormats: { // don't display the dummy year
		//         month: '%e. %b',
		//         year: '%b'
		//     },
		//     title: {
		//         text: 'Date'
		//     }
		// },
		yAxis: {
				title: {
						text: 'IV'
				},
				min: 0
		},
		tooltip: {
			split:true,
				// headerFormat: '<b>{series.name}</b><br>',
				// pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
		},

		plotOptions: {
				spline: {
						marker: {
								enabled: true
						}
				}
		},

		series: siriosna,
});

}

//
// // $('#viz_the_smil')[0].placeholder='RIU7'
// function the_option_bases() {
// 	var option_bases = []
// 	// var bases_bases = []
// 	for (var i in yyy) {
// 		if (yyy[i]['Option base']) {
// 			if (option_bases.includes(yyy[i]['Option base'])) {
//
// 			} else {option_bases.push(yyy[i]['Option base'])}
// 		}
// 	}
//
//
//
// 	function visualize_the_smile() {
// 		var symbol = $('#viz_the_smil')[0].value
// 		console.log(symbol)
// 		function not_yet() {
//
// 			var symboly = symbol
// 			var expys = []
// 			var yyy_sub = []
// 			for (var i in yyy) {
// 					if (yyy[i]['Option base']) {
// 							if (yyy[i]['Option base'] == symboly) {
// 									yyy_sub.push(yyy[i])
// 									if (expys.includes(yyy[i]['Expiration'])) {} else {expys.push(yyy[i]['Expiration'])}
// 									// siriosna.push({'name':yyy[i]['Expiration'],'data':[yyy[i]['Strike'],yyy[i]['Volatility']]})
// 							}
// 					}
// 			}
// 			// // This is quite inefficient
// 			// // There has to be a better way to make this
// 			// // that does not include two for-loops over the same list
// 			var siriosna = []
// 			// for (var i in expys) {
// 			// 		siriosna.push({'name':expys[i],'data':[]})
// 			// }
// 			//
// 			// e
// 			// expys = ["8/10/2017", "7/27/2017", "8/3/2017", "8/17/2017", "9/21/2017"]
// 			var olms = []
// 			var nel = yyy_sub.forEach(function(d){if (d['Expiration']=='8/10/2017'){return [d['Strike'],d['Volatility']]}})
//
// 			expys.forEach(
// 					function(d) {
// 							var nelo = []
// 							var nel = yyy_sub.filter(function(u) { return u['Expiration'] == d})
// 							nel.forEach(function(t) {nelo.push([t['Strike'],t['Volatility']])})
// 							siriosna.push({'name':d,'data':nelo})
// 					}
// 			)
//
// 		}
// 		function viz_the_smil_charter() {
// 			// $('#volumer').empty()
// 				Highcharts.chart('viz_the_smil_chart', {
// 		    chart: {
// 		        type: 'spline'
// 		    },
// 		    title: {
// 		        text: 'Snow depth at Vikjafjellet, Norway'
// 		    },
// 		    subtitle: {
// 		        text: 'Irregular time data in Highcharts JS'
// 		    },
// 		    // xAxis: {
// 		    //     type: 'datetime',
// 		    //     dateTimeLabelFormats: { // don't display the dummy year
// 		    //         month: '%e. %b',
// 		    //         year: '%b'
// 		    //     },
// 		    //     title: {
// 		    //         text: 'Date'
// 		    //     }
// 		    // },
// 		    yAxis: {
// 		        title: {
// 		            text: 'Snow depth (m)'
// 		        },
// 		        min: 0
// 		    },
// 		    tooltip: {
// 					split:true,
// 		        // headerFormat: '<b>{series.name}</b><br>',
// 		        // pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
// 		    },
//
// 		    plotOptions: {
// 		        spline: {
// 		            marker: {
// 		                enabled: true
// 		            }
// 		        }
// 		    },
//
// 		    series: siriosna,
// 		});
// 		}
// 		not_yet()
// 		viz_the_smil_charter()
//
// 	}
//
//
//
//
//
// }


//
// var nel = yyy_sub.filter(function(d) { return d['Expiration'] == '8/10/2017'})






//
// if (siriosna.includes(yyy[i]['expiration']))
//
// if (for (var i in siriosna) {siriosna[i] == yyy[i]['Expiration']})
//
// // if (for (var i in siriosna) {siriosna[i]['name'] == 'john'})
// for (var j in siriosna) {
// 	if (siriosna[j]['name'] == 'jack') {
// 		console.log('no jack')
// 	} else {console.log('add jack')}
// }
//
// var siriosna = [
// 	{'name':'john','data':[[1,2],[2,5]]},
// 	{'name':'jar','data':[[3,9],[4,2]]},
// ]
// var mu = 0
// for (i in yyy) {
// 	if (yyy[i]["Option base"]){
// 		mu++
// 	}
// }
//
// var mu = []
//
// var ri = []
// for (i in yyy) {
// 	if (yyy[i]['Option base']) {
// 		if (yyy[i]['Option base'].startsWith('RI')) {
// 			ri.push(yyy[i])
// 		}
// 	}
// }





var molvarray = []
// HERE IS THE END OF THE ALL OPTIONS ALL PARAMS SECTION
function proby_probs_profits() {
	// if (molvarray.length == 0 ) {
	// 		alert('To calculate Probability of Profit, first select a strategy')
	// }

	var c = 0
	var proffits = []
	var minos = molvarray.filter(function(d){return d[1]>0})
	proffits.push(minos[0][0])
	for (var i in minos) {
		if (c < minos.length-1) {
			var apo = minos[c][0]
			var vapo = minos[c+1][0]
			if (vapo - apo > 10) {
				// moffits.push([vapo,apo])
				proffits.push(apo)
				proffits.push(vapo)
			} else {
				//
			}
			c++
		}
	}
	proffits.push(minos[minos.length-1][0])
	var proby_proffits = []
	for (var i = 0; i < proffits.length; i=i+2) {
		proby_proffits.push([proffits[i],proffits[i+1]])
		console.log(proffits[i],proffits[i+1])
	}
	if (price_from_fin == true) {
			//
	} else {
			get_from_fin_no_internet()
			// get_from_fin()
	}
	if (has_charty_charts_been_done == true) {
		//
	} else {
		charty_charts()
	}
	var monta = 0;
	window.gutchang = []
	proby_proffits.forEach(function(d) {
		var conta = 0
		for (var i in nostra) {
			if ((nostra[i] > d[0]) & (nostra[i] < d[1])) {
					conta++;
					monta++
			}
		}
		console.log(d[0],d[1],conta/I2)
		gutchang.push([d[0],d[1],conta/I2])
	})
	console.log(monta/I2)
	window.prob_of_profit = monta/I2
	d3.select('#probability_of_profit').select('tbody').selectAll('tr').remove()
	d3.select('#probability_of_profit').select('tbody').append('tr').append('td').attr('colspan','3').attr('style','text-align:center').text('BREAKEVEN POINTS')
	var prob_table_body = d3.select('#probability_of_profit').select('tbody')
	var kuru = 0
	gutchang.forEach(function(d) {
			if (kuru == 0) {
				var a1 = prob_table_body.append('tr').append('td').attr('colspan','3').attr('style','text-align:center').attr('id','yumyumers')
												.text('You will profit if, in 60 days, RTS is between:')
				var a2 = prob_table_body.append('tr')
				if (d[0] == 50000) {
					var a3 = a2.append('td').attr('style','text-align:center;;border-right-color:transparent').text(0)
				} else {
					var a3 = a2.append('td').attr('style','text-align:center;;border-right-color:transparent').text(d[0])
				}
				var a4 = a2.append('td').attr('style','text-align:center;border-right-color:transparent').text('and')
				if (d[1] == 149990) {
					var a5 = a2.append('td').attr('style','text-align:center;').text('inf')
				} else {
					var a5 = a2.append('td').attr('style','text-align:center;').text(d[1])
				}
				var a2 = prob_table_body.append('tr')
				var a3 = a2.append('td').attr('colspan','2').attr('style','text-align:right;border-top-color:transparent;border-right-color:transparent').text('PROBABILITY:')
				var a4 = a2.append('td').attr('style','text-align:center;border-top-color:transparent').text((d[2]*100).toFixed(2)+'%')
				kuru = 1
			} else {
				// var a1 = d3.select('#yumyumers')
				// var aoro = prob_table_body.append('tr').append('td').attr('colspan','3').attr('style','text-align:center').text('or')
				var a2 = prob_table_body.append('tr')
				if (d[0] == 50000) {
					var a3 = a2.append('td').attr('style','text-align:center;;border-right-color:transparent').text(0)
				} else {
					var a3 = a2.append('td').attr('style','text-align:center;;border-right-color:transparent').text(d[0])
				}
				var a4 = a2.append('td').attr('style','text-align:center;border-right-color:transparent').text('and')
				if (d[1] == 149990) {
					var a5 = a2.append('td').attr('style','text-align:center;').text('inf')
				} else {
					var a5 = a2.append('td').attr('style','text-align:center;').text(d[1])
				}
				// var a3 = a2.append('td').attr('style','text-align:center;border-right-color:transparent').text(d[0])
				// var a4 = a2.append('td').attr('style','text-align:center;border-right-color:transparent').text('and')
				// var a5 = a2.append('td').attr('style','text-align:center').text(d[1])
				var a2 = prob_table_body.append('tr')
				var a3 = a2.append('td').attr('colspan','2').attr('style','text-align:right;border-top-color:transparent;border-right-color:transparent').text('PROBABILITY:')
				var a4 = a2.append('td').attr('style','text-align:center;border-top-color:transparent').text((d[2]*100).toFixed(2)+'%')
			}
			// kuru++
	})
	prob_table_body.append('tr').append('td').attr('colspan','3').attr('style','text-align:center;font-size:small').text('PROBABILITY OF PROFIT')
	prob_table_body.append('tr').append('td').attr('colspan','3').attr('style','text-align:center;font-size:medium;color:green').text((prob_of_profit*100).toFixed(2)+'%')
}


function proby_probs() {
	if (price_from_fin == true) {
			//
	} else {
			// get_from_fin_no_internet()
			get_from_fin()
	}
	if (has_charty_charts_been_done == true) {
		//
	} else {
		charty_charts()
	}
	var upper_band = $('#upper_band')[0].valueAsNumber
	var lower_band = $('#lower_band')[0].valueAsNumber
	console.log(upper_band)
	console.log(lower_band)
	// window.nosax = mocax.map(function(d) {return d.slice(-1)[0]})
	// upper_band = 100200
	// lower_band = 100100
	var conta = 0;
	for (var i in nostra) {
		if ((nostra[i] > lower_band) & (nostra[i] < upper_band) ) {conta++}
	}
	console.log(conta)
	var probs = conta/I2
	console.log(probs)
	$('#probability_result')
	$('#probability_result')[0].innerHTML = (probs*100).toFixed(2)+'%'
}


function proby_probs_stds() {
		var uppy = S
		var lowy = S
		var proby = 0
		var one_std_low
		var one_std_high
		var one_std_proby
		var two_std_low
		var two_std_high
		var two_std_proby
		function uppy_lowy(pct_dev) {
				uppy = uppy+100
				lowy = lowy-100
				var conta = 0
				for (var i in nostra) {
						if ((nostra[i] > lowy) & (nostra[i] < uppy)) {conta++}
				}
				is_this_crazy++
				proby = conta/I2
				if (proby < pct_dev) {
					uppy_lowy(pct_dev)
				} else {
					if (pct_dev == .68) {
						one_std_low = lowy
						one_std_high = uppy
						one_std_proby = proby
					} else {
						two_std_low = lowy
						two_std_high = uppy
						two_std_proby = proby
					}
				}
		}
		var is_this_crazy = 0
		uppy_lowy(.68)
		console.log(one_std_high)
		console.log(one_std_low)
		console.log(one_std_proby)
		console.log(is_this_crazy)
		var is_this_crazy = 0
		uppy_lowy(.95)
		console.log(two_std_high)
		console.log(two_std_low)
		console.log(two_std_proby)
		console.log(is_this_crazy)
}


// var focus = graph.append("g")
//       .attr("class", "focus")
//       .style("display", "none");

//   focus.append("circle")
//       .attr("r", 4.5)
//       .attr('style','stroke:black');

//   focus.append("text")
//       .attr("x", 9)
//       .attr("dy", ".35em");

//   graph.append("rect")
//       .attr("class", "overlay")
//       .attr("width", 100)
//       .attr("height", 100)
//       .attr('style','stroke:black')
//       .attr('pointer-events','all')
//       .on("mouseover", function() { focus.style("display", null); })
//       .on("mouseout", function() { focus.style("display", "none"); })
//       .on("mousemove", mousemove);

//   function mousemove() {
//     var d = d3.mouse(this)
//     console.log(d)
//     // var x0 = x.invert(d3.mouse(this)[0]),
//     //     i = bisectDate(data, x0, 1),
//     //     d0 = data[i - 1],
//     //     d1 = data[i],
//     //     d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//     focus.attr("transform", "translate(" + d[0] + "," + d[1] + ")");
//     focus.select("text").text(d);
//   }


var ivrank = 30
var ivpct = 50
function probability_meter(ivr,ivp) {
window.vu =	Highcharts.chart('volatility_meter', {

    chart: {
        type: 'gauge',
				spacing:0,
        // plotBorderWidth: 1,
        // plotBackgroundColor: {
        //     linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        //     stops: [
        //         [0, '#FFF4C6'],
        //         [0.3, '#FFFFFF'],
        //         [1, '#FFF4C6']
        //     ]
        // },
        // plotBackgroundImage: null,
				width:200,
        height: 60
    },

    title: {
				floating:true,
        text: ''
				// enabled:false,
    },

    pane: [{
        startAngle: -45,
        endAngle: 45,
        background: null,
        center: ['25%', '145%'],
        size: 100
    }, {
        startAngle: -45,
        endAngle: 45,
        background: null,
        center: ['75%', '145%'],
        size: 100
    }],

    tooltip: {
        enabled: false
    },

    yAxis: [{
        min: 0,
        max: 100,
        minorTickPosition: 'outside',
        tickPosition: 'outside',
        labels: {
            // rotation: 'auto',
            // distance: 20
        },
        plotBands: [{
            from: 50,
            to: 100,
            color: '#C02316',
            innerRadius: '100%',
            outerRadius: '105%'
        }],
        pane: 0,
        title: {
						floating:true,
            text: 'IV R: '+ivr,
            y: -40
        }
    }, {
        min: 0,
        max: 100,
        minorTickPosition: 'outside',
        tickPosition: 'outside',
        labels: {
            // rotation: 'auto',
            // distance: 20
        },
        plotBands: [{
            from: 50,
            to: 100,
            color: '#C02316',
            innerRadius: '100%',
            outerRadius: '105%'
        }],
        pane: 1,
        title: {
						floating:true,
            text: 'IV P: '+ivp+'%',
            y: -40
        }
    }],

    plotOptions: {
        gauge: {
            dataLabels: {
                // enabled: false
            },
            dial: {
                radius: '100%'
            }
        }
    },
		exporting: {
			enabled:false,
		},

    series: [{
        // name: 'Channel A',
        data: [ivr],
        yAxis: 0
    }, {
        // name: 'Channel B',
        data: [ivp],
        yAxis: 1
    }]

},

    // Let the music play
    // function (chart) {
    //     setInterval(function () {
    //         if (chart.series) { // the chart may be destroyed
    //             var left = chart.series[0].points[0],
    //                 right = chart.series[1].points[0],
    //                 leftVal,
    //                 rightVal,
    //                 inc = (Math.random() - 0.5) * 3;
		//
    //             leftVal = left.y + inc;
    //             rightVal = leftVal + inc / 3;
    //             if (leftVal < -20 || leftVal > 6) {
    //                 leftVal = left.y - inc;
    //             }
    //             if (rightVal < -20 || rightVal > 6) {
    //                 rightVal = leftVal;
    //             }
		//
    //             left.update(leftVal, false);
    //             right.update(rightVal, false);
    //             chart.redraw();
    //         }
    //     }, 500);
		//
    // }
	);
}


  var one_std_low
  var one_std_high
  var one_std_proby
  var two_std_low
  var two_std_high
  var two_std_proby
function std_lines() {


  function proby_probs_stds() {
      var uppy = S
      var lowy = S
      var proby = 0
      // var one_std_low
      // var one_std_high
      // var one_std_proby
      // var two_std_low
      // var two_std_high
      // var two_std_proby
      function uppy_lowy(pct_dev) {
          uppy = uppy+10
          lowy = lowy-10
          var conta = 0
          for (var i in nostra) {
              if ((nostra[i] > lowy) & (nostra[i] < uppy)) {conta++}
          }
          is_this_crazy++
          proby = conta/I2
          if (proby < pct_dev) {
            uppy_lowy(pct_dev)
          } else {
            if (pct_dev == .68) {
              one_std_low = lowy
              one_std_high = uppy
              one_std_proby = proby
            } else {
              two_std_low = lowy
              two_std_high = uppy
              two_std_proby = proby
            }
          }
      }
      var is_this_crazy = 0
      uppy_lowy(.68)
      console.log(one_std_high)
      console.log(one_std_low)
      console.log(one_std_proby)
      console.log(is_this_crazy)

      var is_this_crazy = 0
      uppy_lowy(.95)
      console.log(two_std_high)
      console.log(two_std_low)
      console.log(two_std_proby)
      console.log(is_this_crazy)

			$('#one_std_text')[0].innerHTML = '68% of the runs fall between:'
			$('#one_std_high')[0].innerHTML = one_std_high
			$('#one_std_low')[0].innerHTML = one_std_low

  }
  proby_probs_stds()
  // var s1l = moca[0].map(function(d){return S})
  // var s1 = graph.append("path")
  //   .attr("class",'line')
  //   .attr("d", line(s1l))
  //   .attr("style","stroke:black")
  // var s2l = moca[0].map(function(d){return one_std_high})
  // var s2 = graph.append("path")
  //   .attr("class",'line')
  //   .attr("d", line(s2l))
  //   .attr("style","stroke:black")
  // var s3l = moca[0].map(function(d){return one_std_low})
  // var s3 = graph.append("path")
  //   .attr("class",'line')
  //   .attr("d", line(s3l))
  //   .attr("style","stroke:black")

  var s4l = moca[0].map(function(d){return two_std_high})
  // var s4 = graph.append("path")
  //   .attr("class",'line')
  //   .attr("d", line(s4l))
  //   .attr("style","stroke:black")
  var s5l = moca[0].map(function(d){return two_std_low})
  // var s5 = graph.append("path")
  //   .attr("class",'line')
  //   .attr("d", line(s5l))
  //   .attr("style","stroke:black")

    var x_n = S
    var x_n_h = one_std_high
    var sss = (x_n_h-x_n)/M
    var mu = S
    moca_line = moca[0].map(function(d,u){ return u})
    moca_line = moca_line.map(function(d){return d*sss})
    moca_line_u = moca_line.map(function(d){return S+d})
		sultry = moca_line_u.map(function(d,u){return 2000*Math.sin(u*(1/30))+d})
    // var mooc1 = graph.append("path")
    //   .attr("class",'line')
    //   .attr("d", line(moca_line_u))
    //   .attr("style","stroke:black")
    moca_line_d = moca_line.map(function(d){return S-d})
    // var mooc2 = graph.append("path")
    //   .attr("class",'line')
    //   .attr("d", line(moca_line_d))
    //   .attr("style","stroke:black")


}
console.log('all the way past std lines!')










// function minnie_mouse2() {

// var focus = graph.append("g")
//       .attr("class", "focus")
//       .style("display", "none");

//   focus.append("circle")
//       .attr("r", 4.5);

//   focus.append("text")
//       .attr("x", 9)
//       .attr("dy", ".35em");

//   graph.append("rect")
//       .attr("class", "overlay")
//       .attr("width", width)
//       .attr("height", height)
//       .on("mouseover", function() { focus.style("display", null); })
//       .on("mouseout", function() { focus.style("display", "none"); })
//       .on("mousemove", mousemove);

//   function mousemove() {
//     var x0 = x.invert(d3.mouse(this)[0]);
//     console.log(x0)
//     var d = x0
//         // i = bisectDate(data, x0, 1),
//         // d0 = data[i - 1],
//         // d1 = data[i],
//         // d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//     focus.attr("transform", "translate(" + x(d.length) + "," + y(d.x1) + ")");
//     focus.select("text").text(d.x0);
//   }

// }







// function minnie_mouse() {
//     var focus = graph.append('g')
//       .attr('class', 'focus')
//       .style('display', 'none');

//     focus.append('circle')
//       .attr('r', 4.5);

//     focus.append('line')
//       .classed('x', true);

//     focus.append('line')
//       .classed('y', true);

//     focus.append('text')
//       .attr('x', 9)
//       .attr('dy', '.35em');

//     graph.append('rect')
//       .attr('class', 'overlay')
//       .attr('width', width)
//       .attr('height', height)
//       .on('mouseover', function(){ focus.style('display', null)})
//       .on('mouseout',function() { focus.style("display", "none"); })
//       .on('mousemove', mousemove);

//       d3.select('.overlay')
//       .styles({
//         fill: 'none',
//         'pointer-events': 'all'
//       });

//       d3.selectAll('.focus')
//       .style('opacity', 0.7);

//     d3.selectAll('.focus circle')
//       .styles({
//         fill: 'none',
//         stroke: 'black'
//       });

//     d3.selectAll('.focus line')
//       .styles({
//         fill: 'none',
//         'stroke': 'black',
//         'stroke-width': '1.5px',
//         'stroke-dasharray': '3 3'
//       });

//     function mousemove() {
//       const x0 = x.invert(d3.mouse(this)[0]);
//       const i = bisectDate(data, x0, 1);
//       const d0 = data[i - 1];
//       const d1 = data[i];
//       const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//       focus.attr('transform',"translate(" + x2(d.length) + "," + y(d.x1) + ")");
//       focus.select('line.x')
//         .attr('x1', 0)
//         .attr('x2', -x2(d.length))
//         .attr('y1', 0)
//         .attr('y2', 0);

//       focus.select('line.y')
//         .attr('x1', 0)
//         .attr('x2', 0)
//         .attr('y1', 0)
//         .attr('y2', height - y(d.x0));

//       // focus.select('text').text(formatCurrency(d.close));
//     }
// };












// // loop to populate data array with
// // probabily - quantile pairs
// function prob_quant_pars() {
//     for (var i = 0; i < 100000; i++) {
//     q = normal() // calc random draw from normal dist
//     p = gaussian(q) // calc prob of rand draw
//     el = {
//         "q": q,
//         "p": p
//     }
//     data.push(el)
// };
// }

// function prob_quant_pairs() {
//     for (var i = 0; i < 100000; i++) {
//     q = normal() // calc random draw from normal dist
//     p = gaussian(q) // calc prob of rand draw
//     el = {
//         "q": q,
//         "p": p
//     }
//     data.push(el)
// };
// }
// // var xx = d3.scaleLinear().domain([d3.min(nos), d3.max(nos)])
// var xx = d3.scaleLinear().domain([d3.min(nos), d3.max(nos)])
// var histogram = d3.histogram().domain(xx.domain()).thresholds(xx.ticks(20))
// var bins = histogram(nos);

// var dash = []
// for (var i in bins) {
//     dash.push([bins[i][0],bins[i].length])
// }
// ########################################

// ########################################

// var interval = (d3.max(nos) - d3.min(nos))/5
// var rango = d3.range(d3.min(nos),d3.max(nos),interval)
// var snos = nos.sort()
// var xx = d3.scaleLinear().domain([d3.min(nos), d3.max(nos)])
//     .rangeRound([d3.min(nos), d3.max(nos)]);

// var histogram = d3.histogram()
//     .domain()
//     .thresholds(xx.ticks(1000));
// var bins = histogram(nos);


// var dosh = []
// for (var i in bkk) {

// }

