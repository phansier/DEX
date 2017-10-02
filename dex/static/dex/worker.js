var colas = ['Th','𝚫','Γ','Θ','V','OP','NUM_T','LAST','BID','ASK','THEO']
var putas = ['THEO','BID','ASK','LAST','NUM_T','OP','V','Θ','Γ','𝚫','Th']
var stockprice = 113380
var r_rate = 0.005





window.hero = 'hero'
var columns
function append_headers(table) {
	var thead = table.append('thead').attr('class','chain_head')
	for (var i in colas){
		if (i < 5) {
			thead.append('th').attr('class','greek_headcol').attr('onclick','hideGreek(this)').text(colas[i])
		} else {
			thead.append('th').text(colas[i])
		}
	}
	thead.append('th').attr('class','strike_headcol').text('STRK')
	thead.append('th').attr('class','volatility_headcol').text('VOL')
	for (var i in putas){
		if (i > 5) {
			thead.append('th').attr('class','greek_headcol').attr('onclick','hideGreek(this)').text(putas[i])
		} else {
			thead.append('th').text(putas[i])
		}
	}
	window.columns = colas.length+putas.length+2
}


mena = d3.entries(mona)
mena = mena.filter(function(d){if(d.key.startsWith('RI')) {return d}})
window.nastya = 'blye'
s1 = d3.nest()
  .key(function(d) { return d.value.time_to_maturity; })
  .entries(mena)
s1 = s1.sort(function(a,b){return a.key - b.key})
s1 = s1.filter(function(d){if (d.key > 0){return d}})
bomba = d3.select('#mid_pane')
table = bomba.append('table').attr('class','mid_pane_table').attr('id','mid_pane_table')
for (var i in s1) {
//	table = bomba.append('table').attr('class','mid_pane_table')
	var exp_head = table.append('thead').attr('class','expiration_head')
//	exp_head.append('tr').append('th').attr('colspan','11').text(s1[i].key+' Days to Expiration')
	exp_row = exp_head.append('tr')
	append_headers(table)
	exp_row.append('th').attr('colspan',columns-3).attr('class','expiration_head_col').text(s1[i].key+' Days to Expiration')
	exp_row.append('td').attr('class','strike_selector_col').text(10)
	exp_row.append('td').attr('class','strike_selector_col').text(30)
	exp_row.append('td').attr('class','strike_selector_col').text('All')
//	append_headers(table)
	tbody = table.append('tbody').attr('value',s1[i].key)
	s1_0 = d3.nest().key(function(d) {return d.value.strike}).entries(s1[i].values).sort(function(a,b){return a.key - b.key})
	for (var j in s1_0) {
	stk_row = tbody.append('tr').attr('class','strike_row')
	s1_0_0 = d3.nest().key(function(d) {return d.value.option_type}).entries(s1_0[j].values)
	var pc = 1
	if (s1_0_0[1].key == 'Call') {
		pc = 1
	} else {pc = 0}
	var sec = s1_0_0[pc].values[0].value
	var sec_id = s1_0_0[pc].values[0].key.split(' ')[0]
	var call_id = sec_id
//	stk_row.append('td').attr('id',sec_id).text(sec_id)
	var vol = sec.volatility/100
	var oy = 365
	var theo = BlackScholes("CALL",stockprice,sec.strike,sec.time_to_maturity/oy,r_rate,vol)
	theo = Math.ceil(theo / 10) * 10
	stk_row.append('td').attr('id',sec_id+'_theor_price').attr('class','theo_col').attr('value',theo).text()
	var delta = BSM_delta2("CALL",stockprice,sec.strike,0,sec.time_to_maturity/oy,r_rate,vol)
//	delta = Math.ceil(delta / 10) * 10
	stk_row.append('td').attr('id',sec_id+'_delta').attr('class','delta_col').attr('value',delta).text(delta.toFixed(2))
	var gamma = BSM_gamma(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	stk_row.append('td').attr('id',sec_id+'_gamma').attr('class','gamma_col').attr('value',gamma)
	var theta = BSM_theta(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	stk_row.append('td').attr('id',sec_id+'_theta').attr('class','theta_col').attr('value',theta)
	var vega = BSM_vega(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	var vega =  Math.ceil(vega / 10) * 10
	stk_row.append('td').attr('id',sec_id+'_vega').attr('class','vega_col').attr('value',vega)
	stk_row.append('td').attr('id',sec_id+'_open_pos').text(sec.open_pos)
	stk_row.append('td').attr('id',sec_id+'_num_trades').text(sec.num_trades)
	stk_row.append('td').attr('id',sec_id+'_last').text(sec.last)
	stk_row.append('td').attr('id',sec_id+'_bid').attr("onclick","clicker(this,'Call')").text(sec.bid)
	stk_row.append('td').attr('id',sec_id+'_ask').attr("onclick","clicker(this,'Call')").text(sec.ask)
	stk_row.append('td').attr('id',sec_id+'_theo').attr("onclick","clicker(this,'Call')").text(sec.theor_price)
//	stk_row.append('td').attr('id',sec_id+'_strike').attr('style','text-align:right').attr('class','strike').text(sec.strike)
	if (pc == 1) {pc = 0} else {pc = 1}
	var sec = s1_0_0[pc].values[0].value
	var sec_id = s1_0_0[pc].values[0].key.split(' ')[0]
	var put_id = sec_id
	stk_row.append('td').attr('id',call_id+'_'+put_id+'_strike').attr('style','text-align:right').attr('class','strike').text(sec.strike)
	stk_row.append('td').attr('id',call_id+'_'+put_id+'_volatility').attr('class','volatility').text(sec.volatility.toFixed(2))
	stk_row.append('td').attr('id',sec_id+'_theo').attr("onclick","clicker(this,'Put')").text(sec.theor_price)
	stk_row.append('td').attr('id',sec_id+'_bid').attr("onclick","clicker(this,'Put')").text(sec.bid)
	stk_row.append('td').attr('id',sec_id+'_ask').attr("onclick","clicker(this,'Put')").text(sec.ask)
	stk_row.append('td').attr('id',sec_id+'_last').text(sec.last)
	stk_row.append('td').attr('id',sec_id+'_num_trades').text(sec.num_trades)
	stk_row.append('td').attr('id',sec_id+'_open_pos').text(sec.open_pos)
	var vega = BSM_vega(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	var vega =  Math.ceil(vega / 10) * 10
	stk_row.append('td').attr('id',sec_id+'_vega').attr('class','vega_col').attr('value',vega)
	var theta = BSM_theta(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
        stk_row.append('td').attr('id',sec_id+'_theta').attr('class','theta_col').attr('value',theta)
	var gamma = BSM_gamma(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	stk_row.append('td').attr('id',sec_id+'_gamma').attr('class','gamma_col').attr('value',gamma)
        var delta = BSM_delta2("Put",stockprice,sec.strike,0,sec.time_to_maturity/oy,r_rate,sec.volatility/100)
	stk_row.append('td').attr('id',sec_id+'_delta').attr('class','delta_col').attr('value',delta).text(delta.toFixed(2))
	var theo = BlackScholes("Put",stockprice,sec.strike,sec.time_to_maturity/oy,r_rate,sec.volatility/100) 
        theo = Math.ceil(theo / 10) * 10
        stk_row.append('td').attr('id',sec_id+'_theor_price').attr('class','theo_col').attr('value',theo)
	stk_row.attr('id',call_id+'_'+put_id+'_'+sec.strike)
//	stk_row.append('td').attr('id',sec_id).text(sec_id)
}
tbody.append('input').attr('hidden','true').attr('value',25)
}

// This is to create the frame when clicking on a security
//

function clicker(aro,aro2) {
	window.aro = aro
	var kis = Array.from(aro.parentElement.children).filter(function(d){if ((d.id.includes(aro.id.split('_')[0])) &&(d.id.includes('strike'))){console.log(d);return d}})
	stk = kis[0].id
	if (aro2 == "Call") {
//		stk = aro.id.split('_')[0]+'_strike'
		exo = -362
		mexo = -2

	} else {
		//stk = aro.id.split('_')[0]+'_volatility'
		//stk = d3.select("#"+stk)["_groups"][0][0].previousElementSibling.id
		exo = -70
		mexo = -2
	}

	var side;
	var side_color
	if (aro.id.split('_')[1] == 'bid') {
                        side = 'Sell'
			side_color = 'rgb(255,0,0)'
			side_color_o = 'rgba(255,0,0,0.3)'
        } else {
                        if (aro.id.split('_')[1] == 'ask') {
                                side = 'Buy'
				side_color = 'rgb(0,255,0)'
				side_color_o = 'rgba(0,255,0,0.3)'
                        } else {
                                side_color = 'purple'
                                side_color_o = 'purple'
                        }
                }





	var frame = d3.select("#"+stk).append("svg")
			.attr('id',aro.id.split('_')[0]+'_order')
			.attr("style","position:absolute;width:430px;height:25px")
			.attr("transform","translate("+exo+","+mexo+")")
		frame.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr('width',430)
			.attr('height',20)
			.attr('style',"stroke:"+side_color+";fill:"+side_color_o+";stroke-width:4")
		frame.append('circle').attr('cx',5).attr('cy',5).attr('r',5).style('fill','purple').attr('transform','translate(350,5)')
			.on('click',function(d,i,m) {
						window.chap = m;
						console.log(m);
						remove_order(m,'svg');
					});

	connectToTable(aro,aro2)
}
// this is to remove an order, its connected to above function





function remove_order(circle,from_where) {
	if (from_where == 'svg') {
		var order = circle[0].parentElement
		d3.select('#'+order.id+'_table').remove()
		d3.select('#'+order.id).remove()
	} else {
		var order = circle.parentElement
		d3.select('#'+order.id.slice(0,-6)).remove()
		d3.select('#'+order.id).remove() 
	}
	d3.select('#'+order.id.split('_')[0]+'_margins').remove()
	d3.select('#'+order.id.split('_')[0]+'_greeks').remove()
	calculateTotals()
}

//CALCULATE TOTALS


function calculateTotals() {
	var tb = d3.select('#order_margins_table').select('tbody')
	var tb2 = d3.select('#order_tbody')
	var sum = 0
	for (var i = 0; i < tb["_groups"][0][0].children.length; i++) {
		p = Number(tb["_groups"][0][0].children[i].attributes.value.value)
		q = Number(d3.select(tb2["_groups"][0][0].children[i]).select('.qty_input')["_groups"][0][0].value)
		sum = sum + (p * q)
		console.log(sum+'_'+q+'_'+'calked')
	}
	// var qty = Number(d3.select(tb["_groups"][0][0].children[i]).select('.qty_input')["_groups"][0][0].value)
	// console.log(sum+'_'+qty+'_'+'calked')
	// sum = sum * qty
	d3.select('#mr_sum').text(sum.toFixed(0))



	
	var sum = 0
	for (var i = 0; i < tb2["_groups"][0][0].children.length; i++) {
		p = Number(tb2["_groups"][0][0].children[i].attributes.value.value)
		q = Number(d3.select(tb2["_groups"][0][0].children[i]).select('.qty_input')["_groups"][0][0].value)
		sum = sum + (p * q)
		console.log(sum+'_'+q+'_'+'calked')
		 // qty = Number(tb["_groups"][0][0].children[i].children[5].innerText)
	}
	// console.log(sum)

	
	d3.select('#dc_sum').text(sum.toFixed(0))

	// Now with the greeks

	var tb = d3.select('#order_totals_table').select('tbody')
	// var sum = 0
	var de = 0
	var ga = 0
	var th = 0
	var vg = 0
	for (var i = 0; i < tb["_groups"][0][0].children.length; i++) {
		 de = de + Number(tb["_groups"][0][0].children[i].children[0].innerText)
		 ga = ga + Number(tb["_groups"][0][0].children[i].children[1].innerText)
		 th = th + Number(tb["_groups"][0][0].children[i].children[2].innerText)
		 vg = vg + Number(tb["_groups"][0][0].children[i].children[3].innerText)
		 
	}
	// console.log(sum)
	d3.select('#delta_sum').text(de.toFixed(2))
	d3.select('#gamma_sum').text(ga.toFixed(2))
	d3.select('#theta_sum').text(th.toFixed(0))
	d3.select('#vega_sum').text(vg.toFixed(0))
}


// Udpate Totals


function updateTotals(garg) {
	console.log(garg)
	window.garg = garg
	window.qty = d3.select(garg)["_groups"][0][0].value
	qty = Number(qty)
	var code = garg.id.split('_')[0]

	var bgop = d3.select('#'+code+'_bgop')
	bgop.text((Number(margins[code]["bgop"]) * qty).toFixed(0))
	var bgonp = d3.select('#'+code+'_bgonp')
	bgonp.text((Number(margins[code]["bgonp"]) * qty).toFixed(0))
	var buydepo = d3.select('#'+code+'_buydepo')
	buydepo.text((Number(margins[code]["buydepo"]) * qty).toFixed(0))

	delt = d3.select('#'+code+'_delta')["_groups"][0][0].attributes.value.value
	delt = Number(delt)
	delt = delt * qty
	gamm = d3.select('#'+code+'_gamma')["_groups"][0][0].attributes.value.value
	gamm = gamm * qty
	gamm = Number(gamm)
	thet = d3.select('#'+code+'_theta')["_groups"][0][0].attributes.value.value
	thet = thet * qty
	thet = Number(thet)
	veg = d3.select('#'+code+'_vega')["_groups"][0][0].attributes.value.value
	veg = veg * qty
	veg = Number(veg)

	gtkrow = d3.select('#'+code+'_greeks').selectAll('td')
	gtkrow["_groups"][0][0].innerText = Number(delt).toFixed(2)
	gtkrow["_groups"][0][1].innerText = Number(gamm).toFixed(2)
	gtkrow["_groups"][0][2].innerText = Number(thet).toFixed(0)
	gtkrow["_groups"][0][3].innerText = Number(veg).toFixed(0)

	calculateTotals()
}


// This function adds contract to table, its used in above function


function connectToTable(aro,otype) {
	var coda = aro.id.split('_')[0]
	var row = order_tbody.append('tr').attr('id',aro.id.split('_')[0]+'_order_table')
	var ttm = aro.parentElement.parentElement.previousElementSibling.previousElementSibling.textContent.split(' ')[0]
	var strike = aro.parentElement.id.split('_')[2]
	row.append('td').text(Number(ttm))
	var side;
	var dc;
	var qty = 1
	
	if (otype == 'Call') {
		if (aro.id.split('_')[1] == 'bid') {
			side = 'Sell'
			dc = 1
		} else {
			if (aro.id.split('_')[1] == 'ask') {
				side = 'Buy'
				dc = -1
			} else {
				// THEO
			}
		}
	} else {

		if (aro.id.split('_')[1] == 'bid') {
			side = 'Sell'
			dc = 1
		} else {
			if (aro.id.split('_')[1] == 'ask') {
				side = 'Buy'
				dc = -1
			} else {
				// THEO
			}
		}
	}
	
	row.append('td').attr('id',coda+'_order_side').text(side)
	row.append('input').attr('id',coda+'_order_qty')
			.attr('class','qty_input')
			.attr('type','number')
			.attr('value',qty)
			.attr('onchange','updateTotals(this)')
	row.append('td').attr('id',coda+'_order_strike').text(Number(strike))
	row.append('td').attr('id',coda+'_order_otype').text(otype)
	row.append('td').attr('id',coda+'_order_price').text(Number(aro.textContent))
	row.append('td').attr('onclick','remove_order(this)').attr('style','color:red').text('X')

	dc = dc * (qty * Number(aro.textContent))
	row.attr('value',dc)


	var code = aro.id.split('_')[0]
	var tots = d3.select('#order_margins_table').select('tbody').append('tr').attr('id',code+'_margins')
	tots.append('td').text(code)
	var bgop = tots.append('td').attr('id',code+'_bgop').text((Number(margins[code]["bgop"]) * qty).toFixed(0))
	var bgonp = tots.append('td').attr('id',code+'_bgonp').text((Number(margins[code]["bgonp"]) * qty).toFixed(0))
	var buydepo = tots.append('td').attr('id',code+'_buydepo').text((Number(margins[code]["buydepo"]) * qty).toFixed(0))
	var go 
	if (side == 'Buy') {
		buydepo.attr('style','color:rgb(0,255,0)')
		go = margins[code]["buydepo"] * qty
	} else {
		bgop.attr('style','color:rgb(0,255,0)')
		go = margins[code]["bgop"] * qty
	}
	tots.attr('value',go)

	gkt = d3.select('#order_totals_table').select('tbody')
	gtkrow = gkt.append('tr').attr('id',code+'_greeks')
	delt = d3.select('#'+code+'_delta')["_groups"][0][0].attributes.value.value
	gtkrow.append('td').text(Number(delt).toFixed(2))
	gamm = d3.select('#'+code+'_gamma')["_groups"][0][0].attributes.value.value
	gtkrow.append('td').text(Number(gamm).toFixed(2))
	thet = d3.select('#'+code+'_theta')["_groups"][0][0].attributes.value.value
	gtkrow.append('td').text(Number(thet).toFixed(0))
	veg = d3.select('#'+code+'_vega')["_groups"][0][0].attributes.value.value
	gtkrow.append('td').text(Number(veg).toFixed(0))

	calculateTotals()

}




//This is to close the body of expiration tables on click
//

exh = d3.select('body').selectAll('.expiration_head_col')
exh.attr('onclick','close_body(this)')

function close_body(thing) {
	thing = thing.parentElement.parentElement
	window.close_body_thing = thing
	console.log(thing)
	if (thing.nextElementSibling.style.display != 'none') {
		thing.nextElementSibling.style.display = 'none'
		thing.nextElementSibling.nextElementSibling.style.display = 'none'
		thing.children[0].children[1].hidden = true
		thing.children[0].children[2].hidden = true
		thing.children[0].children[3].hidden = true
		thing.children[0].children[0].colSpan = columns
//		thing.nextElementSibling.style.height = '0px'
//               thing.nextElementSibling.nextElementSibling.style.height = '0px'
//		thing.nextElementSibling.style.overflowY = 'hidden'
//                thing.nextElementSibling.nextElementSibling.style.overflowY = 'hidden'
	} else {
		thing.children[0].children[0].colSpan = columns - 3
		thing.children[0].children[1].hidden = false
                thing.children[0].children[2].hidden = false
                thing.children[0].children[3].hidden = false
		thing.nextElementSibling.style.display = 'table-header-group'
		thing.nextElementSibling.nextElementSibling.style.display = 'table-row-group'
	}
}

// This is to add the ATM line
//

var all_the_strikes = s1_0.map(function(d){return Number(d.key)})
sp = d3.select('#left_col').append('div')
sp.text(115030)

for (var i in all_the_strikes) {
	if ((Number(sp["_groups"][0][0].innerText) > all_the_strikes[i]) && (Number(sp["_groups"][0][0].innerText) < all_the_strikes[Number(i)+1])) {
		var stuko = all_the_strikes[i]
		var stuko2 = all_the_strikes[Number(i)+1]
		console.log(stuko,stuko2)
	}
}


strks = d3.selectAll('.strike')

function atm_line(row) {
	d3.select('#'+row.id).append("svg").attr("style","position:absolute;width:720px;height:2px").attr('class','atmline').attr("transform","translate(-362,-4)").append("rect").attr("x", 0).attr("y", 0).attr('width',715).attr('height',2).attr('style',"stroke:red;fill:none;stroke-width:5")
}
strks["_groups"][0].forEach(function(d){if(d.innerText == stuko){console.log(d);atm_line(d)}})


//function locate_the_options(message) {
//	var code = message.payload.split(',')[2].split(' ')[0]
//	if (code.startsWith('RI')) {
//		$('#'+code+'_bid')[0].innerHTML = message.payload.split(',')[3]
//		$('#'+code+'_ask')[0].innerHTML = message.payload.split(',')[4]
//		$('#'+code+'_last')[0].innerHTML = message.payload.split(',')[5]
//		$('#'+code+'_num_trades')[0].innerHTML = message.payload.split(',')[6]
//		$('#'+code+'_open_pos')[0].innerHTML = message.payload.split(',')[8]
//		var kis = Array.from($('#'+code+'_open_pos')[0].parentElement.children).filter(function(d){if ((d.id.includes(code)) &&(d.id.includes('volatility'))){return d}})
//		$('#'+kis[0].id)[0].innerHTML = Number(message.payload.split(',')[9]).toFixed(2)
//		$('#'+code+'_theo')[0].innerHTML = message.payload.split(',')[10]
//		
//	}
//}


//function locate_the_options(message) {
//	var code = message.payload.split(',')[2].split(' ')[0]
//	if (code.startsWith('RI')) {
//		$('#'+code+'_bid')[0].innerHTML = message.payload.split(',')[3]
//		$('#'+code+'_ask')[0].innerHTML = message.payload.split(',')[4]
//		// $('#'+code+'_last')[0].innerHTML = message.payload.split(',')[5]
//		if (message.payload.split(',')[5] < $('#'+code+'_last')[0].innerHTML) {
//			$('#'+code+'_last')[0].innerHTML = message.payload.split(',')[5]
//			var o = 0;                     //  set your counter to 1
//			var rowcode = $('#'+code+'_last')[0].parentElement.id
//			function myLoopR () {        //  create a loop function
//			   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
//				d3.select('#'+rowcode).attr('style','background-color:rgb(255,'+o+','+o+')')
//			             //  your code here
//			      o=o+1;                     //  increment the counter
//			      if (o < 255) {            //  if the counter < 10, call the loop function
//			         myLoopR();             //  ..  again which will trigger another
//			      }                        //  ..  setTimeout()
//			   }, 1)
//			}
//			myLoopR();
//			d3.select('#'+rowcode).attr('style','background-color:inherit')
//
//		} else {
//			if (message.payload.split(',')[5] > $('#'+code+'_last')[0].innerHTML) {
//				$('#'+code+'_last')[0].innerHTML = message.payload.split(',')[5]
//				var o = 0;                     //  set your counter to 1
//				var rowcode = $('#'+code+'_last')[0].parentElement.id
//				function myLoop () {
//				          //  create a loop function
//				   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
//					d3.select('#'+rowcode).attr('style','background-color:rgb('+o+',255,'+o+')')
//				             //  your code here
//				      o=o+1;                     //  increment the counter
//				      if (o < 255) {            //  if the counter < 10, call the loop function
//				         myLoop();             //  ..  again which will trigger another
//				      }                        //  ..  setTimeout()
//				   }, 1)
//				}
//				myLoop();
//				d3.select('#'+rowcode).attr('style','background-color:inherit')
//			}
//		} 
//		$('#'+code+'_num_trades')[0].innerHTML = message.payload.split(',')[6]
//		$('#'+code+'_open_pos')[0].innerHTML = message.payload.split(',')[8]
//		$('#'+code+'_open_pos')[0].parentElement.children[7].innerHTML = Number(message.payload.split(',')[9]).toFixed(2)
//		$('#'+code+'_theo')[0].innerHTML = message.payload.split(',')[10]
//		
//	}
//}

function green_red(a,b) {
	if (a.innerHTML == b) {
		a.innerHTML = b
	} else {
		if (a.innerHTML > b) {
			a.style.color = 'rgb(255,0,0)' 
		} else {
			a.style.color = 'rgb(0,255,0)'
		}
	}
	a.innerHTML = b
}


function locate_the_options(message) {
	var code = message.payload.split(',')[2].split(' ')[0]
	if (code.startsWith('RI')) {
		// $('#'+code+'_bid')[0].innerHTML = message.payload.split(',')[3]
		green_red($('#'+code+'_bid')[0],message.payload.split(',')[3])
		// $('#'+code+'_ask')[0].innerHTML = message.payload.split(',')[4]
		green_red($('#'+code+'_ask')[0],message.payload.split(',')[4])
		// $('#'+code+'_last')[0].innerHTML = message.payload.split(',')
		// $('#'+code+'_last')[0].innerHTML = message.payload.split(',')[5]
		if (message.payload.split(',')[5] < $('#'+code+'_last')[0].innerHTML) {
			$('#'+code+'_last')[0].innerHTML = message.payload.split(',')[5]
			var o = 0;
			var c = 1                     //  set your counter to 1
			var rowcode = $('#'+code+'_last')[0].parentElement.id
			function myLoopR () {        //  create a loop function
			   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
				d3.select('#'+rowcode).attr('style','background-color:rgba(255,'+o+','+o+','+c+')')
			             //  your code here
			      o=o+1;
			      c = c - 0.004                     //  increment the counter
			      if (o < 255) {            //  if the counter < 10, call the loop function
			         myLoopR();             //  ..  again which will trigger another
			      }                        //  ..  setTimeout()
			   }, 1)

			}
			myLoopR();

		} else {
			if (message.payload.split(',')[5] > $('#'+code+'_last')[0].innerHTML) {
				$('#'+code+'_last')[0].innerHTML = message.payload.split(',')[5]
				var o = 0;   
				var c = 1                    //  set your counter to 1
				var rowcode = $('#'+code+'_last')[0].parentElement.id
				function myLoop () {
				          //  create a loop function
				   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
					d3.select('#'+rowcode).attr('style','background-color:rgba('+o+',255,'+o+','+c+')')
				             //  your code here
				      o=o+1;
				      c = c - 0.004                     //  increment the counter
				      if (o < 255) {            //  if the counter < 10, call the loop function
				         myLoop();             //  ..  again which will trigger another
				      }                        //  ..  setTimeout()
				   }, 1)
				   
				}
				myLoop()
			} else {
				if (message.payload.split(',')[6]>$('#'+code+'_num_trades')[0].innerHTML) {
					console.log('numup')
				var o = 0;   
				var c = 1                    //  set your counter to 1
				var rowcode = $('#'+code+'_last')[0].parentElement.id
				function myLoopB () {
				          //  create a loop function
				   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
					d3.select('#'+rowcode).attr('style','background-color:rgba('+o+','+o+',255,'+c+')')
				             //  your code here
				      o=o+1;
				      c = c - 0.004                     //  increment the counter
				      if (o < 255) {            //  if the counter < 10, call the loop function
				         myLoopB();             //  ..  again which will trigger another
				      }                        //  ..  setTimeout()
				   }, 1)
				   
				}
				myLoopB()
				}
			} 
		} 
		$('#'+code+'_num_trades')[0].innerHTML = message.payload.split(',')[6]
		$('#'+code+'_open_pos')[0].innerHTML = message.payload.split(',')[8]
		$('#'+code+'_open_pos')[0].parentElement.children[7].innerHTML = Number(message.payload.split(',')[9]).toFixed(2)
		$('#'+code+'_theo')[0].innerHTML = message.payload.split(',')[10]
		
	}
}







// THIS IS TO KEEP THE ATM LINE IN CHECK FOR RTS
function dont_miss_the_strike(price) {
	var rip = Number($('#RIZ7')[0].children[3].innerHTML)
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


//This is to create the orders table into window.order_section
// and window.order_tbody variables


function order_table(){
	window.order_section = d3.select('#orders')
	order_section.append('h3').attr('id','orders_title').text('Order Entry')
	order_section_row = order_section.append('div').attr('class','row')
	var table = order_section_row.append('div').attr('class','col').append('table').attr('id','ot1').attr('style','margin-top:29px')
	var thead = table.append('thead')
	var hrow = thead.append('tr')
	hrow.append('th').text('TTM')
	hrow.append('th').text('Side')
	hrow.append('th').text('Qty')
	hrow.append('th').text('Stk')
	hrow.append('th').text('Type')
	hrow.append('th').text('Price')
	window.order_tbody = table.append('tbody').attr('id','order_tbody')
	
}

order_table()
// THIS ADDS THE TOTALS BODY
order_margins = order_section_row.append('div').attr('class','col').attr('id','order_margins')
var msum = order_margins.append('table').attr('id','margins_sum').append('thead')
msum.append('th').text('Net D/C')
msum.append('td').attr('id','dc_sum').attr('class','summy').text(0)
msum.append('th').text('MR')
msum.append('td').attr('id','mr_sum').attr('class','summy').text(0)
order_margins.append('table').attr('id','order_margins_table')
var thead = d3.select('#order_margins_table').append('thead')
thead.append('th')
thead.append('th').text('CM')
thead.append('th').text('UM')
thead.append('th').text('BC')
var tbody = d3.select('#order_margins_table').append('tbody')
//tbody.append('td').text('Strategy')
//tbody.append('td').attr('id','total_buydepo')
//tbody.append('td').attr('id','total_bgop')
//tbody.append('td').attr('id','total_bgonp')

order_totals = order_section_row.append('div').attr('class','col').attr('id','order_totals')

var gsum = order_totals.append('table').attr('id','greeks_sum').append('thead')
gsum.append('td').attr('id','delta_sum').attr('class','summy_sm')
gsum.append('td').attr('id','gamma_sum').attr('class','summy_sm')
gsum.append('td').attr('id','theta_sum').attr('class','summy_sm')
gsum.append('td').attr('id','vega_sum').attr('class','summy_sm')

order_totals.append('table').attr('id','order_totals_table')
var thead = d3.select('#order_totals_table').append('thead')
thead.append('th').text('𝚫')
thead.append('th').text('Γ')
thead.append('th').text('Θ')
thead.append('th').text('V')
var tbody = d3.select('#order_totals_table').append('tbody')



// This is to shrink the orders table
//

function shrinkToggle(smth) {


	function shrinkOn() {
		setTimeout(function() {
			d3.select('#'+section).attr('style',width_or_height+':'+o+'px')
			o = o - 5
			if (o > 30) {
				shrinkOn();
			}
		}, 1)
	}

	function shrinkOff() {
		setTimeout(function() {
			d3.select('#'+section).attr('style',width_or_height+':'+o+'px')
			o = o + 5
			if (o < sec_height) {
				shrinkOff();
			}
		}, 1)
	}

	var ind = smth.attributes.value.value

	if (ind == 1) {
		var o = 250
		var width_or_height = 'height'
		var section = 'orders'
		shrinkOn()
		smth.attributes.value.value = 0
	} else {
		var o = 0
		var sec_height = 250
		var width_or_height = 'height'
		var section = 'orders'
		shrinkOff()
		smth.attributes.value.value = 1
	}
}
d3.select('#orders_title').attr('onclick','shrinkToggle(this)').attr('value',1)





// This is to manage strikes displayed
//

d3.select('body').selectAll('.strike_selector_col').attr('onclick','strikeViews(this)')

function strikeViews(val) {
console.log(val)
window.val = val 
valks = val.parentElement.parentElement.nextElementSibling.nextElementSibling
atm = d3.select(valks).select('.atmline')
atmrow = atm["_groups"][0][0].parentElement.parentElement
$(atmrow.parentElement).children().hide()
$(atmrow).show()
atmrow_d = atmrow.nextElementSibling
atmrow_u = atmrow.previousElementSibling
$(atmrow_d).show()
$(atmrow_u).show()
if (Number(val.innerText) > 0) {
	var updown = Number(val.innerText)/2-2
	for (var i in d3.range(updown)) {
		atmrow_u = atmrow_u.previousElementSibling
		atmrow_d = atmrow_d.nextElementSibling
		$(atmrow_d).show()
		$(atmrow_u).show()
//		console.log(atmrow)
	}
	atmrow_u = atmrow_u.previousElementSibling
	$(atmrow_u).show()
} else {
	$(atmrow.parentElement).children().show()
}


}

// This is to hide the columns, remember that the greek value for each contract
// is stored in the value attribute of the respective column, so what this function
// does is alter the innerHTML to nothing or to the value of the col

var hidden_columns = {'vega':true,'gamma':true,'theo':true,'delta':false,'theta':true,}

function hideGreek(argo) {
	var mup = {'V':'vega','Th':'theo','𝚫':'delta','Γ':'gamma','Θ':'theta'}
	var wicho = mup[argo.innerHTML]
	window.wicho = wicho
	if (hidden_columns[wicho] == true) {
		var cols = d3.select('body').selectAll('.'+wicho+'_col')["_groups"][0]
		cols.forEach(function(d) {
			var val = Number(d.attributes.value.value)
			if (wicho == 'delta') {val = val.toFixed(2)}
			if (wicho == 'vega') {val = val.toFixed(0)}
			if (wicho == 'theo') {val = val.toFixed(0)}
			if (wicho == 'gamma') {val = val.toFixed(3)}
			if (wicho == 'theta') {val = val.toFixed(0)}
			d.innerHTML = val
		})
		hidden_columns[wicho] = false
		// var val = Number(d3.select('body').selectAll('.'+wicho+'_col')["_groups"][0][0].attributes.value.value)
		// d3.select('body').selectAll('.'+wicho+'_col')["_groups"][0][0].innerHTML = val
		
	} else {
		var cols = d3.select('body').selectAll('.'+wicho+'_col')["_groups"][0]
		cols.forEach(function(d) {
			d.innerHTML = ''
		})
		hidden_columns[wicho] = true
	}

}



// START FROM HERE
fm = d3.select('#mid_pane_header').append('form').attr('id','option_parms_form').attr('class','btn-group')
fm.append('label')
		.attr('class','btn btn-primary btn-sm option_parms')
		.attr('onclick','preacher(this)')
		.attr('id','go_button')
		.text('GO')

fm.append('label')
		.attr('class','btn btn-primary btn-sm option_parms juk')
		.text('Short Rate')
 	.append('input')
 		.attr('type','number')
 		.attr('onsubmit','preacher(this)')
 		.attr('step',0.001)
 		.attr('class','qty_input juki')
 		.attr('id','g_r_rate')
 		.attr('autocomplete','off')
 		.attr('value',.005)
fm.append('label')
		.attr('class','btn btn-primary btn-sm option_parms juk')
		.text('Vol.')
 	.append('input')
 		.attr('type','number')
 		.attr('onsubmit','preacher(this)')
 		.attr('step',0.01)
 		.attr('class','qty_input juki')
 		.attr('id','g_vol')
 		.attr('autocomplete','off')
 		.attr('value',.2)


fm = d3.select('#mid_pane_header').append('form').attr('id','option_parms_form').attr('class','btn-group').attr('data-toggle','buttons')
// fm.append('input').attr('id','g_r_rate').attr('class','parms_input').attr('type','number').attr('value',r_rate)
// fm.append('input').attr('id','g_vol').attr('class','parms_input').attr('type','number').attr('value',g_vol)

 		

fm.append('label')
		.attr('class','btn btn-primary btn-sm option_parms active')
		.attr('onclick','volParameterToggle(this)')
		.text('Choose volatility')
 	.append('input')
 		.attr('type','radio')
 		.attr('name','options')
 		.attr('id','option1')
 		.attr('autocomplete','off')
 		.attr('checked')
 		
// d3.select('#option1')
fm.append('label')
		.attr('class','btn btn-primary btn-sm option_parms')
		.attr('onclick','volParameterToggle(this)')
		.text('Use volatility from system')
 	.append('input')
 		.attr('type','radio')
 		.attr('name','options')
 		.attr('id','option2')
 		.attr('autocomplete','off')
 		

function volParameterToggle(voli) {
	window.voli = voli
	if (voli.children[0].id == 'option2') {
		d3.select('#g_vol').attr('readonly','readonly').attr('style','color:grey')
		d3.select('#g_vol')["_groups"][0][0].value = g_volatility
	} else {
		d3.select('#g_vol')
			.attr('readonly',null)
			.attr('style','color:white')
		d3.select('#g_vol')["_groups"][0][0].value = g_volatility

	}
	
}
function preacher(abc) {
	window.abc = abc
	window.g_volatility = Number(d3.select('#g_vol')["_groups"][0][0].value)
	window.r_rate = Number(d3.select('#g_r_rate')["_groups"][0][0].value)
	if (d3.select('#g_vol')["_groups"][0][0].attributes.readonly) {
		recalculateGreeks()
		console.log('imhere')
	} else {
		recalculateGreeks(g_volatility)
	}
}

// END HERE
//RECALCULATEGREEKS
function recalculateGreeks(volva) {
	console.log('rek')
	rwz = table.selectAll('.strike_row')
	rwz["_groups"][0].forEach(function(d){
		var callcode = d.id.split('_')[0]
		var putcode = d.id.split('_')[1]
		if (volva) { vol = volva;console.log('volva') } else { vol = Number(d3.select('#'+callcode+'_'+putcode+'_volatility').text())/100}
		var strike = Number(d.id.split('_')[2])
		var time_to_maturity = Number(d.parentElement.attributes.value.value)
		call_theo = BlackScholes("CALL",stockprice,strike,time_to_maturity/oy,r_rate,vol) 
		put_theo = BlackScholes("Put",stockprice,strike,time_to_maturity/oy,r_rate,vol) 
		delta = BSM_delta(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
		delta_put = delta - 1
		gamma = BSM_gamma(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
		theta = BSM_theta(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)
		vega =  BSM_vega(stockprice, strike, 0, time_to_maturity/oy, r_rate,vol)


		var c1 = d3.select('#'+callcode+'_theor_price').attr('value',call_theo)
		if (c1.text()) {c1.text(call_theo.toFixed(0))}
		var c1 = d3.select('#'+callcode+'_delta').attr('value',delta)
		if (c1.text()) {c1.text(delta.toFixed(2))}
		var c1 = d3.select('#'+callcode+'_gamma').attr('value',gamma)
		if (c1.text()) {c1.text(gamma.toFixed(3))}
		var c1 = d3.select('#'+callcode+'_theta').attr('value',theta)
		if (c1.text()) {c1.text(theta.toFixed(0))}
		var c1 = d3.select('#'+callcode+'_vega').attr('value',vega)
		if (c1.text()) {c1.text(vega.toFixed(0))}

		var c1 = d3.select('#'+putcode+'_theor_price').attr('value',put_theo)
		if (c1.text()) {c1.text(put_theo.toFixed(0))}
		var c1 = d3.select('#'+putcode+'_delta').attr('value',delta_put)
		if (c1.text()) {c1.text(delta_put.toFixed(2))}
		var c1 = d3.select('#'+putcode+'_gamma').attr('value',gamma)
		if (c1.text()) {c1.text(gamma.toFixed(3))}
		var c1 = d3.select('#'+putcode+'_theta').attr('value',theta)
		if (c1.text()) {c1.text(theta.toFixed(0))}
		var c1 = d3.select('#'+putcode+'_vega').attr('value',vega)
		if (c1.text()) {c1.text(vega.toFixed(0))}
	})

}
// END OF RECALCULATEGREKES
console.log('end of worker')
