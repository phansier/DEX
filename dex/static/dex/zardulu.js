//We add the Overview page
op_buttons = d3.select('#overview_page').append('div')
op_buttons.append('button').text('b1')
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
          text: title
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
			color: "#333333",
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
      fontSize: 20,
      padding: 20
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
          text: title
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
			color: "#333333",
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
      fontSize: 20,
      padding: 20
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


chart = 0
function distributeStrikesC3(param,optionals,redo) {
    if (param in arp1) {
        if (arp1[param] == 'jam') {var data = jam}
        if (arp1[param] == 'jec') {var data = jec}
        if (arp1[param] == 'mena') {var data = mena.map(function(x){return x.value})}
    } else {
        throw 'bunga'
    }
    
    var data1 = d3.nest().key(function(d) { return d.option_type; }).entries(data)
    
    if (optionals == 'cp') {
        var callso = d3.nest()
          .key(function(d) { return d.strike; })
          .rollup(function(v) { return d3.sum(v, function(d) { return d[param]; }); })
          .entries(data1[0].values)
        var putso = d3.nest()
          .key(function(d) { return d.strike; })
          .rollup(function(v) { return d3.sum(v, function(d) { return d[param]; }); })
          .entries(data1[1].values)
        
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
    if (redo == 'no'){
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
    }
}
