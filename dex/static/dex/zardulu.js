//We add the Overview page
op_buttons = d3.select('#overview_page').append('div')
//op_buttons.append('button').text('b1')
op_buttons.append('button').text('exit').attr("onclick","d3.select('#overview_page').attr('style','display:none')")
op_buttons.append('button').text('Options').attr("onclick","overviewLevels()")

op_buttons2 = d3.select('#overview_page').append('div')
op_buttons3 = d3.select('#overview_page').append('div')
op_buttons.append('button').text('Striker').attr("onclick","optionsfromAPI()")

op_svg = d3.select('#overview_page').append('svg')
    .attr('id','op_svg')
    .attr('height',750)
    .attr('width',950)
bubabutton = d3.select('#mid_pane').append('button').text('Enter').attr("onclick","d3.select('#overview_page').attr('style','')")


var titless = [];
function optionLevelButtons(rep) {
    d3.entries(rep[0].value).forEach(function(a){
        titless.push(a.key);     op_buttons2.append('button').text(a.key).attr("onclick","DonutMaker(\""+a.key+"\")")
    })
    op_buttons2.append('button').text('CLOSE PIE').attr("onclick","destroyDonut()")
}

function destroyDonut() {
    op_svg.transition().attr('height',0)
    if (typeof pie !== 'undefined') {
        pie.destroy()
        pie = null
    }
}

buttons_are_set = false
function overviewLevels() {
    $.post('/dex/optionlevels/', $(this).serialize(),function(data){
        console.log('optionlevelling')
        window.optionlevels = data
        rep = JSON.parse(JSON.parse(optionlevels).rr[0])
        rep = d3.entries(rep)
        rep.forEach(function(d){
        if (d.value.CALL == 1) {
            d.value.CALL = 'CALL'
        } else {
            d.value.CALL = 'PUT'
        }
        })
        window.rep = rep
        console.log('REPPED!')
        if (buttons_are_set == false) {
            optionLevelButtons(rep)
            buttons_are_set = true
        }
        
      
    });
}



pie = null
piesmall = null
function DonutMaker(parameter) {
    var cheight = 300
    if (piesmall != null) {miniDonutMaker('a','off')}
    if (pie != null) {
        pie.destroy()
        pie = null
    }
    if (parameter == 'OICHANGE') {
        rep.sort(function(a,b){return d3.descending(a.value[parameter],b.value[parameter])})
        lero = []
        rep.forEach(function(d){lero.push({label: d.value.ASSETCODE+'_'+d.value.CALL+':'+d.value[parameter], value: d.value[parameter],caption:'john'})})
        window.lero = lero
        lero = lero.filter(function(d){if (d.value != 0)return d})
        lero.forEach(function(d){d.value = Math.abs(d.value)})
        pieMaker(parameter,lero,cheight)
    } else {
        rep.sort(function(a,b){return d3.descending(a.value[parameter],b.value[parameter])})
        lero = []
        rep.forEach(function(d){lero.push({label: d.value.ASSETCODE+'_'+d.value.CALL, value: d.value[parameter] })})
        lero = lero.filter(function(d){if (d.value != 0)return d})
        pieMaker(parameter,lero,cheight)
    }
}

gop_vsg = op_svg.append('g').attr('id','gop_vsg')

function pieMaker(title,lero,cheight) {
    window.pie = new d3pie("gop_vsg", {
      header: {
        title: {
          text: title,
          color:    "#ffffff",
        },
        location: "top-center"
      },
        labels: {
		outer: {
			format: "label",
			hideWhenLessThanPercentage: null,
			pieDistance: 5
		},
		inner: {
			format: "percentage",
			hideWhenLessThanPercentage: 2
		},
		mainLabel: {
			color: "#ffffff",
			font: "arial",
			fontSize: 10
		},
		percentage: {
			color: "#dddddd",
			font: "arial",
			fontSize: 10,
			decimalPlaces: 0
		},
		value: {
			color: "#cccc44",
			font: "arial",
			fontSize: 10
		},
		lines: {
			enabled: true,
			style: "curved",
			color: "segment" // "segment" or a hex color
		}
	},
      size: {
        canvasHeight:cheight,
        pieInnerRadius: "50%",
        pieOuterRadius: "80%"
      },
      data: {
        sortOrder: "value-desc",
        smallSegmentGrouping : {enabled: true,
			value: 1,
			valueType: "percentage",
			label: "Other",
			color: "#cccccc"},
        content: lero
      },
        
      misc: {
        colors: {
            segmentStroke: null,
        },
        gradient: {
              enabled: true,
        }
      },tooltips: {
    enabled: true,
    type: "placeholder",
    string: "{label}: {value}",
    styles: {
      fadeInSpeed: 500,
      backgroundColor: "#00cc99",
      backgroundOpacity: 0.8,
      color: "#ffffcc",
      borderRadius: 4,
      font: "verdana",
      fontSize: 12,
      padding: 10
    }
  },
        
        callbacks: {
            onClickSegment: function(a) {
//                alert(a.data.label);
                console.log(a);
                window.huha = a
                if (huha.data.label == 'Other') {
                    if (piesmall == null) {
                            miniDonutMaker(a,'on')
                        } else {
                            miniDonutMaker(a,'off')   
                        }
                    
                } else {
                    callingZardulu(huha.data.label)
                }
            }
        }
    });
op_svg.transition().attr('height',300)
}


function miniDonutMaker(a,onoff) {
    if (onoff == 'off') {
        piesmall.destroy()
        piesmall = null
        d3.select('#mini_gop').remove()
        d3.select('#gop_vsg')
            .transition()
                .attr('transform','translate(0,0)')
    } else {
        mini_gop = op_svg.append('g').attr('id','mini_gop')
        pieMakerSmall('Other',a.data.groupedData,300)
        d3.select('#gop_vsg').transition().attr('transform','translate(-90,0)')
    }
}

function pieMakerSmall(title,lero,cheight) {
    d3.select('#mini_gop').attr('transform','translate(200,0)')
    window.piesmall = new d3pie("mini_gop", {
      header: {
        title: {
          text: title,
          color:    "#ffffff",
        },
        location: "top-center"
      },
        labels: {
		outer: {
			format: "label",
			hideWhenLessThanPercentage: null,
			pieDistance: 5
		},
		inner: {
			format: "percentage",
			hideWhenLessThanPercentage: 2
		},
		mainLabel: {
			color: "#ffffff",
			font: "arial",
			fontSize: 10
		},
		percentage: {
			color: "#dddddd",
			font: "arial",
			fontSize: 10,
			decimalPlaces: 0
		},
		value: {
			color: "#cccc44",
			font: "arial",
			fontSize: 10
		},
		lines: {
			enabled: true,
			style: "curved",
			color: "segment" // "segment" or a hex color
		}
	},
      size: {
        canvasHeight:cheight,
        pieInnerRadius: "50%",
        pieOuterRadius: "60%"
      },
      data: {
        sortOrder: "value-desc",
        smallSegmentGrouping : {enabled: true,
			value: 1,
			valueType: "percentage",
			label: "Other",
			color: "#cccccc"},
        content: lero
      },
        
      misc: {
        colors: {
            segmentStroke: null,
        },
        gradient: {
              enabled: true,
        },
        pieCenterOffset: {
			x: 0,
			y: -25
		}
      },tooltips: {
    enabled: true,
    type: "placeholder",
    string: "{label}: {value}",
    styles: {
      fadeInSpeed: 500,
      backgroundColor: "#00cc99",
      backgroundOpacity: 0.8,
      color: "#ffffcc",
      borderRadius: 4,
      font: "verdana",
      fontSize: 12,
      padding: 10
    }
  },
        
        callbacks: {
            onClickSegment: function(m) {
//                alert(a.data.label);
                console.log('muller');
                window.huha = m
                
            }
        }
    });
}
//bow 
//wow

function strikeLayover(parm,split) {
    if (pie != null) {pie.destroy();pie = null}
    var width = op_svg["_groups"][0][0].getAttribute('width')
    var min_strike = d3.min(s1.map(function(p){return p.values.map(function(d){return d.value.strike})}).map(function(f){return d3.min(f)}))
    var max_strike = d3.max(s1.map(function(p){return p.values.map(function(d){return d.value.strike})}).map(function(f){return d3.max(f)}))
    
    maqui = s1.map(function(p){return [p.key,p.values.map(function(d){return [d.value.strike,d.value.num_trades,d.value.option_type]})]})
}

//#################################################################
//function distributeStrikes(param) {
//    
//}


//var blu = mena.map(function(d){
//    return {'strike':d.value.strike,
//            'option_type':d.value.option_type,
//            'time_to_maturity':+d.value.time_to_maturity,
//            'num_trades':d.value.num_trades,
//            'open_pos':d.value.open_pos,
//            
//           }
//})



//START HERE
var arp1 = {'VOLTODAY':'jam','VALTODAY':'jam','VALTODAY_USD':'jam','OICHANGE':'jam','QUANTITY':'jam','NUMTRADES':'jam','PREVSETTLEPRICE':'jec','PREVOPENPOSITION':'jec','num_trades':'mena','open_pos':'mena','volatility':'mena'}
var missing_options = []
buttons_are_set_2 = 0
function optionsfromAPI() {
    var url = 'https://iss.moex.com/iss/engines/futures/markets/options/securities.json?iss.json=extended'
    d3.json(url, function(data) {
        console.log('no')
        window.jader = data
        window.j_md = jader[1].marketdata[1]
        window.j_sec = jader[1].securities[1]
        var tog = [j_md,j_sec]
        missing_options = []
        tog.forEach(function(a){
            a.forEach(function(d){
            var pid = mona[d.SECID+" [SPBOPT]"]
            if (typeof pid !== 'undefined') {
                d.option_type = pid.option_type
                d.strike = pid.strike
                d.time_to_maturity = pid.time_to_maturity
            } else {
                missing_options.push(d.SECID)
//                a.pop(d)
            }
            })    
        })
        console.log('si')
        if (buttons_are_set_2 == 0) {
            Object.keys(arp1).forEach(function(x){
                op_buttons3.append('button')
                    .text(x)
                    .attr("onclick","distributeStrikesC3(\""+x+"\",\"cp\",\"no\")")
            })
            op_buttons3.append('button').text('CLOSE BARS').attr("onclick","closeBars()")
            buttons_are_set_2 = 1
        }
        window.jam = j_md.filter(function(d){if(d.SECID.slice(0,2) == seccode){return d}})
        window.jec = j_sec.filter(function(d){if(d.SECID.slice(0,2) == seccode){return d}})
    });
}

function closeBars() {
    if (typeof window.g !== 'undefined') {
        window.g.remove()
        $('#op_svg').hide()
    }
}



function futuresHalfSize(argo) {
    if (argo == 'half') { 
        d3.select('#futures_list').selectAll('.futures_list_ask').style('display','none')
        d3.select('#futures_list').selectAll('.futures_list_bid').style('display','none')
    }
    if (argo == 'full') { 
        d3.select('#futures_list').selectAll('.futures_list_ask').style('display','')
        d3.select('#futures_list').selectAll('.futures_list_bid').style('display','')
    }
}



//#################################################
//#################################################


// THIS IS TO KEEP THE ATM LINE IN CHECK FOR RTS
function dont_miss_the_strike(price) {
	var rip = $('#'+codax+'_last').text()
	if ((rip > stuko) && (rip < stuko2)) {
		 //console.log('yes')
	} else {
		for (var i in all_the_strikes) {
	if ((rip > all_the_strikes[i]) && (rip < all_the_strikes[Number(i)+1])) {
		window.stuko = all_the_strikes[i]
		window.stuko2 = all_the_strikes[Number(i)+1]
		console.log(stuko,stuko2)
		strks = d3.selectAll('.strike')
		d3.select('body').selectAll('.atmline').remove();
		d3.select('#atmx').attr('value',stuko2)
		strks["_groups"][0].forEach(function(d){if(d.innerText == stuko2){atm_line(d)}})
	}
}
	}
}

// THIS IS FOR ZARDULU
zardulu2 = Array()
zardulu = d3.entries()
zardulu_log = []
function callingZardulu(labla) {
    var short_labla = labla.split('_')[0]
    if (zardulu_log.includes(short_labla)) {
        console.log('You already have this my son!!')
        return short_labla
    } else {
        var t0 = performance.now();

        console.log(short_labla)
        $.post('/dex/zardulu/', {'zardulu': short_labla},function(data){
            console.log('zardulu')
            window.prune = data
            prune2 = JSON.parse(prune)
            Object.keys(prune2).forEach(function(m){
                zardulu2[m] = prune2[m]
            })
            prune3 = d3.entries(prune2)
            zardulu.push(prune3[0])
            zardulu.push(prune3[1])
            zardulu.push(prune3[2])
            zardulu.push(prune3[3])
            console.log('callingZardulu('+labla+')')
            var t1 = performance.now();
            zardulu_log.push(short_labla)
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
        });
    }
}
//THIS IS THE END OF ZARDULU


//THIS IS THE BEGGINING OF THE C3 SITUATION

d3.select('#overview_page').append('div').attr('id','c3')
//d3.select('body').style('font', '12px sans-serif')
op_svg.transition().attr('height',0)


chart_init = 0
function distributeStrikesC3(param,optionals,redo) {
    window.jam = j_md.filter(function(d){if(d.SECID.slice(0,2) == seccode){return d}})
    window.jec = j_sec.filter(function(d){if(d.SECID.slice(0,2) == seccode){return d}})
    
//    j_strikes = d3.nest().key(function(d){ return d.strike}).entries(jam)
    
    if (param in arp1) {
        if (arp1[param] == 'jam') {var data = jam}
        if (arp1[param] == 'jec') {var data = jec}
        if (arp1[param] == 'mena') {var data = mena.map(function(x){return x.value})}
    } else {
        throw 'bunga'
    }
    
    var data1 = d3.nest().key(function(d) { return d.option_type; }).entries(data)
    var data1_c = data1.find(function(x){if (x.key == 'Call'){return x}})
    var data1_p = data1.find(function(x){if (x.key == 'Put'){return x}})
    
    if (optionals == 'cp') {
        var callso = d3.nest()
          .key(function(d) { return d.strike; })
          .rollup(function(v) { return d3.sum(v, function(d) { return d[param]; }); })
          .entries(data1_c.values)
        var putso = d3.nest()
          .key(function(d) { return d.strike; })
          .rollup(function(v) { return d3.sum(v, function(d) { return d[param]; }); })
          .entries(data1_p.values)
        
        if (param == 'volatility') {
            var callso = d3.nest()
              .key(function(d) { return d.strike; })
              .rollup(function(v) { return d3.mean(v, function(d) { return d[param]; }); })
              .entries(data1_c.values)
            var putso = d3.nest()
              .key(function(d) { return d.strike; })
              .rollup(function(v) { return d3.mean(v, function(d) { return d[param]; }); })
              .entries(data1_p.values)
        }
        
        callso.sort(function(x, y){
           return d3.ascending(Number(x.key), Number(y.key));
        })

        putso.sort(function(x, y){
           return d3.ascending(Number(x.key), Number(y.key));
        })
        var callsov = callso.map(function(x){return x.value})
        var putsov = putso.map(function(x){return x.value})
        if (callso.length != putso.length) {alert('problyomka')}
        var strikov = callso.map(function(x){return x.key})
        callsov.unshift('callsov')
        putsov.unshift('putsov')
        strikov.unshift('x')
    }
    if (chart_init == 1){
        console.log('undefined dawg')
        chart.load({
          columns: [strikov,callsov,putsov],
          unload: [strikov,callsov,putsov],
        });
    } else {
        console.log('from scratschomo')
        chart = c3.generate({
            bindto: '#c3',
            padding: {
              left: 50,
              bottom:0,
            },
            data: {
                 x : 'x',
                columns: [
                    strikov,
                    callsov,
                    putsov,
                ],
                type: 'bar',
                groups: [
                    ['callsov', 'putsov']
                ]
            },
            subchart: {show:true},
            axis: {
                x: {
                    type: 'indexed', // this needed to load string x value
                    tick: {
                        culling: true,
                    },
                    label: {
                        position:'inner-center',
                    }
                }
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show:true,
                    lines: [{value:0}]
                }
            }
        }); 
        chart_init = 1
    }
}


$('#uloggout').hide()

var stats_page_button = d3.select('#menubar').append('div').attr('onclick','PagesSwitchboard(\"statistics\")').text('Statistics')

var overview_page_button = d3.select('#menubar').append('div').attr('onclick','PagesSwitchboard(\"overview\")').text('Overview')

var options_page_button = d3.select('#menubar').append('div').attr('onclick','PagesSwitchboard(\"options\")').text('Options Chain')

var analyze_page_buttons = d3.select('#menubar').append('div').attr('onclick','PagesSwitchboard(\"analyze\")').text('Analyze')

function PagesSwitchboard(page) {
    if (page == 'statistics') {$('#statistics_page').show();$('#mid_pane_table').hide();$('#overview_page').hide();$('#analyze_page').hide();$('#mid_pane_header').hide()}
    if (page == 'overview') {$('#statistics_page').hide();$('#mid_pane_table').hide();$('#overview_page').show();$('#analyze_page').hide();$('#mid_pane_header').hide()}
    if (page == 'options') {$('#statistics_page').hide();$('#mid_pane_table').show();$('#overview_page').hide();$('#analyze_page').hide();$('#mid_pane_header').show()}
    if (page == 'analyze') {$('#statistics_page').hide();$('#mid_pane_table').hide();$('#overview_page').hide();$('#analyze_page').show();$('#mid_pane_header').hide()}
}
PagesSwitchboard('options')


var StatsPage = d3.select('#statistics_page')
var AnalyzePage = d3.select('#analyze_page')
var APmenu = AnalyzePage.append('div').attr('id','analyze_page_menu')
APmenu.selectAll('input').style('background','transparent')
APmenu.selectAll('input').style('border','1px')
APmenu.selectAll('input').style('color','lightgrey')
APmenu.style('padding','0px 10px 10px 50px')



var analyze_page_svg = AnalyzePage.append('div').attr('id','analyze_page_svg')
var APmenuRow = APmenu.append('tr')

var APmenuTable = APmenuRow.append('td').append('table')
var APmenuRight = APmenuRow.append('td').append('div')

APmenuRight.append('button').attr('onclick','chartCommand(this)').attr('id','theo_command').text('THEO')
APmenuRight.append('button').attr('onclick','chartCommand(this)').attr('id','delta_command').text('DELTA')
APmenuRight.append('button').attr('onclick','chartCommand(this)').attr('id','gamma_command').text('GAMMA')
APmenuRight.append('button').attr('onclick','chartCommand(this)').attr('id','vega_command').text('VEGA')
APmenuRight.append('button').attr('onclick','chartCommand(this)').attr('id','theta_command').text('THETA')

function chartCommand(but){
    console.log(but.innerText)
    graphox = {
        plot_param:but.innerText,
        active:'no'
    }
}

var codax = 'RIM8'


var aptr = APmenuTable.append('thead').append('tr')
aptr.append('th').text('Price')
aptr.append('th').text('TTM')
aptr.append('th').text('VOL')
aptr.append('th').text('R')
var APmenuBody = APmenuTable.append('tbody')

analyze_default_lines = []
function plusrow(ttm) {
    var count = analyze_default_lines.length
    var row = APmenuBody.append('tr').attr('id','rr'+count)
    var price = futsal.find(function(x){if (x.key == codax) {return x}}).value.last
    var ttm = 60
    var vol = 0.2
//    var r_rate = r_rate
    console.log(r_rate)
    row.append('td').append('input').attr('id','rr'+count+'_price').attr('value',price)
    row.append('td').append('input').attr('id','rr'+count+'_ttm').attr('value',ttm)
    row.append('td').append('input').attr('id','rr'+count+'_vol').attr('value',vol)
    row.append('td').append('input').attr('id','rr'+count+'_r_rate').attr('value',r_rate)
    row.append('td').append('input').attr('id','rr'+count+'_load').attr('type','submit').attr('value','Load').attr('onclick','PlotItOut(this)')
    row.append('td').append('input').attr('id','rr'+count+'_unload').attr('type','submit').attr('value','rr'+count)
    var d_params = {
        row_id:'rr'+count,
        stockprice:price,
        time_to_maturity:ttm,
        vol:vol,
        r_rate:r_rate,
    }
    analyze_default_lines.push(d_params)
}
plusrow(60)
plusrow(30)
plusrow(5)
//d3.select('#r1load').attr('onclick','PlotItOut(this)')

function PlotItOut(arg) {
    window.parg = arg
    console.log(arg)
    var row_id = parg.id.split('_')[0]
    var params = analyze_default_lines.find(function(x){if (x.row_id == row_id){return x}})
    params['r_rate'] = Number(d3.select('#'+row_id+'_r_rate')["_groups"][0][0].value)
    params['stockprice'] = Number(d3.select('#'+row_id+'_price')["_groups"][0][0].value)
    params['time_to_maturity'] = Number(d3.select('#'+row_id+'_ttm')["_groups"][0][0].value)
    params['vol'] = Number(d3.select('#'+row_id+'_vol')["_groups"][0][0].value)
    AnalyzeGraphox(params)
}


//                    paramo:param,
//                    option_type:ct_option_type,
//                    stockprice: s_price,
//                    strike: ct.strike,
//                    time_to_maturity: ct.time_to_maturity,
//                    r_rate:r_rate,
//                    vol: ct.volatility,
var graphox = {
    plot_param:'THEO',
    active:'no'
}


function AnalyzeGraphox(params) {
    console.log('graphox')
    window.ct_params = params
    var x_axis = sec_strikes.map(function(x){return Number(x.key)})
//    var x_axis = d3.range(d3.min(xaxo),d3.max(xaxo),futures_sec[codax].MINSTEP)
    var plu = d3.select("#order_tbody").selectAll('tr')["_groups"][0]
    var y_line = []
    x_axis.forEach(function(d) {
        var y_val = 0
        plu.forEach(function(x) {
            var id = x.id.split('_')[0]
            var ct = mona[id+" [SPBOPT]"]
            var ct_ob = ct.option_base
            var ct_option_type = mona[id+" [SPBOPT]"].option_type.toUpperCase()
            var ttmo = mona[id+" [SPBOPT]"].time_to_maturity
            var s_price = futsal.find(function(x){if (x.key == ct_ob) {return x}}).value.last
//            var ct_params = {
//                paramo:param,
//                option_type:ct_option_type,
//                stockprice: s_price,
//                strike: ct.strike,
//                time_to_maturity: ct.time_to_maturity,
//                r_rate:r_rate,
//                vol: ct.volatility,
//            }
            ct_params['paramo'] = graphox['plot_param']
            ct_params['option_type'] = ct_option_type
            ct_params['strike'] = ct.strike
            ttmo = ttmo - ct_params['time_to_maturity']
            ct_params['time_to_maturity'] = ttmo
            ct_params["stockprice"] = Number(d)
//                console.log(ct_params)
            y_val = y_val + BSM_Switchboard(ct_params)
//                console.log(BSM_Switchboard(ct_params))
        })
        y_line.push(y_val)
    })
    console.log(y_line)
    var param = graphox['plot_param']
    y_line.unshift(ct_params['row_id'])
    Schartacus(x_axis,y_line,param)
}       


//functionPlot({
//  target: '#analyze_page_svg',
//  data: [{
//    fn: 'x^2'
//  }]
//})


//1/Math.sqrt(2*Math.PI)

function Schartacus(x_axis,y_line,param) {
    console.log(param)
    var xxxx = x_axis
    xxxx.unshift('x')
    var yyyy = y_line
//    yyyy.unshift(param)
    if (graphox['active'] == 'active') {
        ochart.load({
                columns: [
                    yyyy,
                ]
        })
    } else {
        window.ochart = c3.generate({
            bindto: '#analyze_page_svg',
            data: {
                x:'x',
                columns: [
                    xxxx,
                    yyyy,
                ],
            },
//            subchart: {
//                show: true,
//                rescale:true
//            },
            zoom: {
                enabled: true,
                rescale: true,
//                onzoom: function (domain) { console.log('zooooom') }
            },
            grid: {
              x: {
                show: true,
//                class:'somyanga'
                
              },
              y: {
                show: true
              }
            }
        });
    d3.select('#analyze_page_svg').selectAll('text').style('fill','white')
    graphox['active'] = 'active'
    }
}

APmenu.selectAll('input').style('background','transparent')
APmenu.selectAll('input').style('border','1px')
APmenu.selectAll('input').style('color','lightgrey')
APmenu.style('padding','0px 10px 10px 50px')
analyze_page_svg.selectAll('.c3-xgrid').style('stroke','black')
analyze_page_svg.selectAll('.c3-ygrid').style('stroke','black')
analyze_page_svg.selectAll('.domain').style('stroke','white')
//#analyze_page_menu {
//    padding: 0px 10px 10px 50px;
//}
//#analyze_page_menu .c3-xgrid {
//    stroke: black
//}
//#analyze_page_menu .c3-ygrid {
//    stroke: black
//}
//#analyze_page_menu .domain {
//    stroke: white
//}
//#analyze_page_menu input {
//    background:transparent;
//    border: 1px;
//    color:lightgrey;
//}


//option_type has to be capitalized
function BSM_Switchboard(params) {
//    console.log('BSM_Switchboard')
//    console.log(params)
    var paramo = params['paramo']
    var option_type = params['option_type']
    var stockprice = params['stockprice']
    var strike = params['strike']
    var time_to_maturity = params['time_to_maturity']
    var r_rate = params['r_rate']
    var vol = params['vol']
    if (paramo == 'THEO') {
        return BlackScholes(option_type,stockprice,strike,time_to_maturity/oy,r_rate,vol)
    }
    if (paramo == 'DELTA') {
        var delta = BSM_delta(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
		var delta_put = delta - 1
        if (option_type == 'CALL') {return delta}
        else {return delta_put}
    }
    if (paramo == 'GAMMA') {
        var gamma = BSM_gamma(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
		gamma = gamma * 100
        return gamma
    }
    if (paramo == 'THETA') {
        var theta = BSM_theta(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
//        theta = theta/price_step/price_step_price * global_margin
        return theta
    }
    if (paramo == 'VEGA') {
        var vega =  BSM_vega(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
//        vega = vega/price_step/price_step_price
        return vega
    }
}
//
//
//
//function recalculateGreeks(volva) {
//	console.log('rek')
//	rwz = table.selectAll('.strike_row')
//	rwz["_groups"][0].forEach(function(d){
//		var callcode = d.id.split('_')[0]
//		var putcode = d.id.split('_')[1]
//		if (volva) { vol = volva;console.log('volva') } else { vol = Number(d3.select('#'+callcode+'_'+putcode+'_volatility').text())/100}
//		var strike = Number(d.id.split('_')[2])
//		var time_to_maturity = Number(d.parentElement.attributes.value.value)
//		call_theo = BlackScholes("CALL",stockprice,strike,time_to_maturity/oy,r_rate,vol) 
//		put_theo = BlackScholes("Put",stockprice,strike,time_to_maturity/oy,r_rate,vol) 
//		delta = BSM_delta(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
//		delta_put = delta - 1
//		gamma = BSM_gamma(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
//		gamma = gamma * 100
//		price_step = 10
//		price_step_price = pstepval
//		theta = BSM_theta(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
//		theta = theta/price_step/price_step_price * global_margin
//		vega =  BSM_vega(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
//		vega = vega/price_step/price_step_price
//
//		var c1 = d3.select('#'+callcode+'_theor_price').attr('value',call_theo)
//		if (c1.text()) {c1.text(call_theo.toFixed(0))}
//		var c1 = d3.select('#'+callcode+'_delta').attr('value',delta)
//		if (c1.text()) {c1.text(delta.toFixed(2))}
//		var c1 = d3.select('#'+callcode+'_gamma').attr('value',gamma)
//		if (c1.text()) {c1.text(gamma.toFixed(3))}
//		var c1 = d3.select('#'+callcode+'_theta').attr('value',theta)
//		if (c1.text()) {c1.text(theta.toFixed(0))}
//		var c1 = d3.select('#'+callcode+'_vega').attr('value',vega)
//		if (c1.text()) {c1.text(vega.toFixed(0))}
//
//		var c1 = d3.select('#'+putcode+'_theor_price').attr('value',put_theo)
//		if (c1.text()) {c1.text(put_theo.toFixed(0))}
//		var c1 = d3.select('#'+putcode+'_delta').attr('value',delta_put)
//		if (c1.text()) {c1.text(delta_put.toFixed(2))}
//		var c1 = d3.select('#'+putcode+'_gamma').attr('value',gamma)
//		if (c1.text()) {c1.text(gamma.toFixed(3))}
//		var c1 = d3.select('#'+putcode+'_theta').attr('value',theta)
//		if (c1.text()) {c1.text(theta.toFixed(0))}
//		var c1 = d3.select('#'+putcode+'_vega').attr('value',vega)
//		if (c1.text()) {c1.text(vega.toFixed(0))}
//	})
//
//}
