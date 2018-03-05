
function switchSecurities(codax) {
//if (codax != 'RIZ7') {
//	if (codax != 'SiZ7') {
//		alert('For now we only have support for RIZ7 and SiZ7, the rest are coming soon')
//		return 'Sors'
//	}
//}

seccode = codax.slice(0,2)
stockprice = Number(d3.select('#'+codax+'_last')["_groups"][0][0].innerText)

d3.select('#mid_pane_table').remove()
mena = d3.entries(mona)
mena = mena.filter(function(d){if(d.key.startsWith(seccode)) {return d}})
nastya = 'blye'
s1 = d3.nest()
  .key(function(d) { return d.value.time_to_maturity; })
  .entries(mena)
s1 = s1.sort(function(a,b){return a.key - b.key})
s1 = s1.filter(function(d){if (d.key > 0){return d}})
bomba = d3.select('#mid_pane')
table = bomba.append('table').attr('class','mid_pane_table').attr('id','mid_pane_table')
pstepval = 11.58196
global_margin = 0.3
price_step = 10
price_step_price = pstepval
for (var i in s1) {
	if (s1[i].values.length < 10) {
		console.log('you have a weird expiration at s1 i')
	} else {
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
	gamma = gamma * 100
	stk_row.append('td').attr('id',sec_id+'_gamma').attr('class','gamma_col').attr('value',gamma)
	var theta = BSM_theta(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	theters = theta/price_step/price_step_price * global_margin
	stk_row.append('td').attr('id',sec_id+'_theta').attr('class','theta_col').attr('value',theters)
	var vega = BSM_vega(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	vega = vega/price_step/price_step_price
	vega =  Math.ceil(vega / 10) * 10
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
	stk_row.append('td').attr('id',call_id+'_'+put_id+'_volatility').attr('class','volatility').text(sec.volatility.toFixed(3))
	stk_row.append('td').attr('id',sec_id+'_theo').attr("onclick","clicker(this,'Put')").text(sec.theor_price)
	stk_row.append('td').attr('id',sec_id+'_bid').attr("onclick","clicker(this,'Put')").text(sec.bid)
	stk_row.append('td').attr('id',sec_id+'_ask').attr("onclick","clicker(this,'Put')").text(sec.ask)
	stk_row.append('td').attr('id',sec_id+'_last').text(sec.last)
	stk_row.append('td').attr('id',sec_id+'_num_trades').text(sec.num_trades)
	stk_row.append('td').attr('id',sec_id+'_open_pos').text(sec.open_pos)
	var vega = BSM_vega(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	vega = vega/price_step/price_step_price
	vega =  Math.ceil(vega / 10) * 10
	stk_row.append('td').attr('id',sec_id+'_vega').attr('class','vega_col').attr('value',vega)
	var theta = BSM_theta(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	theters = theta/price_step/price_step_price * global_margin
        stk_row.append('td').attr('id',sec_id+'_theta').attr('class','theta_col').attr('value',theters)
	var gamma = BSM_gamma(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	gamma = gamma * 100 
	stk_row.append('td').attr('id',sec_id+'_gamma').attr('class','gamma_col').attr('value',gamma)
        var delta = BSM_delta2("Put",stockprice,sec.strike,0,sec.time_to_maturity/oy,r_rate,sec.volatility/100)
	stk_row.append('td').attr('id',sec_id+'_delta').attr('class','delta_col').attr('value',delta).text(delta.toFixed(2))
	var theo = BlackScholes("Put",stockprice,sec.strike,sec.time_to_maturity/oy,r_rate,sec.volatility/100) 
        theo = Math.ceil(theo / 10) * 10
        stk_row.append('td').attr('id',sec_id+'_theor_price').attr('class','theo_col').attr('value',theo)
	stk_row.attr('id',call_id+'_'+put_id+'_'+sec.strike)
	}
//	stk_row.append('td').attr('id',sec_id).text(sec_id)
}
tbody.append('input').attr('hidden','true').attr('value',25)
}

// I am hardcoding a midsedction of length 930 here, I might want to alter that
table.append('tr')
	.append('td')
		.attr('colspan',stk_row._groups[0][0].children.length)
	.append('div')
		.attr('id','the_lengthener')
		.attr('style','width:930px')



exh = d3.select('body').selectAll('.expiration_head_col')
exh.attr('onclick','close_body(this)')

var all_the_strikes = s1_0.map(function(d){return Number(d.key)})
// sp = d3.select('#left_col').append('div')
// sp.text(115030)
if (seccode == 'RI') {var titler = 'RIZ7'}
if (seccode == 'Si') {var titler = 'SiZ7'}

sp = stockprice

for (var i in all_the_strikes) {
	if ((sp > all_the_strikes[i]) && (sp < all_the_strikes[Number(i)+1])) {
		var stuko = all_the_strikes[i]
		var stuko2 = all_the_strikes[Number(i)+1]
		console.log(stuko,stuko2)
	}
}


strks = d3.selectAll('.strike')

//function atm_line(row) {
//	d3.select('#'+row.id).append("svg").attr("style","position:absolute;width:720px;height:2px").attr('class','atmline').attr("transform","translate(-362,-4)").append("rect").attr("x", 0).attr("y", 0).attr('width',715).attr('height',2).attr('style',"stroke:red;fill:none;stroke-width:5")
//}
vol_terms = []
function atm_line(row) {
	var fauser = row.parentElement.parentElement.attributes.value.value
	console.log('FAUSER')
	var svigo = d3.select('#'+row.id).append("svg")
	svigo.attr("style","position:absolute;width:720px;height:2px").attr('class','atmline').attr("transform","translate(-362,-4)").append("rect").attr("x", 0).attr("y", 0).attr('width',715).attr('height',2).attr('style',"stroke:red;fill:none;stroke-width:5")
	var ido = row.id
	var ido2 = ido.split('_')[0]+'_'+ido.split('_')[1]+'_volatility'
	var atmvol = Number(d3.select('#'+ido2)['_groups'][0][0].innerText)
	svigo.attr('value',atmvol)
	vol_terms.push(fauser,atmvol)
	console.log(ido,atmvol)

}
strks["_groups"][0].forEach(function(d){if(d.innerText == stuko){console.log(d);atm_line(d)}})



d3.select('body').selectAll('.strike_selector_col').attr('onclick','strikeViews(this)')

d3.select('body').selectAll('.expiration_head_col')["_groups"][0].forEach(function(d) {close_body(d)})

d3.select('#dashboard_activate').text(titler)
}


futures_cols = ['ID','LAST','BID','ASK','CHG']
futurama = d3.select('#left_col')
				.append('div')
					.attr('id','div_for_futures_list')
				.append('table')
					.attr('id','futures_list')
var truby = futurama.append('tr')
futures_cols.forEach(function(a) {
	if (a == 'ID') {
		truby.append('th').text(a)
	} else {
		truby.append('th').attr('style','text-align:center').text(a)
	}
})
var futsal = d3.entries(futures)
futsal.forEach(function(d,i){
	var tr = futurama.append('tr')
	var coda = d.key
	var bid = Number(d.value.bid)
	var ask = Number(d.value.ask)
	var last = Number(d.value.last)
	var change = Number(d.value.change)
	tr.append('td').attr('id',coda+'_id').attr('value',coda).attr('onclick',"switchSecurities(\""+coda+"\")").text(coda)
	tr.append('td').attr('id',coda+'_last').attr('value',last).attr('style','text-align:center').text(last)
	tr.append('td').attr('id',coda+'_bid').attr('value',bid).attr('style','text-align:center').text(bid)
	tr.append('td').attr('id',coda+'_ask').attr('value',ask).attr('style','text-align:center').text(ask)
	var chn = tr.append('td').attr('id',coda+'_change').attr('value',change).text(change)

	if (change > 0) { chn.attr('style','text-align:center;color:green')}
	if (change < 0) { chn.attr('style','text-align:center;color:red')}
	if (change ==  0) { chn.attr('style','text-align:center;color:grey')}

})
// END OF FUTURES TABLE
// BEGIN OF BALTIC
futuresflash = false
function baltic(gb) {
	var coda = gb.payload.split(',')[2].split(' ')[0]
	var bid = gb.payload.split(',')[3]
	var ask = gb.payload.split(',')[4]
	var last = gb.payload.split(',')[5]
	if (bid.split('.').length == 2) {
		bid = Number(bid).toFixed(2)
		ask = Number(ask).toFixed(2)
		last = Number(last).toFixed(2)
	} else {
		if (bid.split('.').length == 2) {
			bid = Number(bid).toFixed(2)
			ask = Number(ask).toFixed(2)
			last = Number(last).toFixed(2)
		} else {
			bid = Number(bid)
			ask = Number(ask)
			last = Number(last)
		}
    }
//    d3.select('#SiZ7_bid')["_groups"][0][0].innerText
    
    guba(coda,'bid',bid)
    guba(coda,'ask',ask)
    guba(coda,'last',last)
    // guba(coda,'change',change)
	
	// d3.select('#'+coda+'_id').attr('value',coda).text(coda)
	// d3.select('#'+coda+'_bid').attr('value',bid).text(bid)
	// d3.select('#'+coda+'_ask').attr('value',ask).text(ask)
	// d3.select('#'+coda+'_last').attr('value',last).text(last)
	// d3.select('#'+coda+'_change').attr('value',last).text(last)
}
function guba(a,b,n) {
    	var colt = d3.select('#'+a+'_'+b)
    	var o = colt["_groups"][0][0].innerText
  //   	if (b == 'bid') {var o = bid}
		// if (b == 'ask') {var o = ask}
		// if (b == 'last') {var o = last}
		// if (b == 'change') {var o = change}

		if (n > o) { colt.attr('style','color:green');gubagb(colt,'green')}
		if (o > n) { colt.attr('style','color:red');gubagb(colt,'red')}
		if (n == o) { colt.attr('style','color:grey')}
		colt.attr('value',n)
		colt.text(n)
    }

function gubagb(colt,color) {
	if (futuresflash == true) {
		var row = colt["_groups"][0][0].parentElement

		if (color == 'green') {var layer = 'bomb'}
		if (color == 'red') {var layer = 'blood'}
		if (color == 'blue') {var layer = 'cool'}


		d3.select(row).attr('class',layer)
		setTimeout(function(){
		d3.select(row).attr('class','brut')
		},50)
	}
}

switchSecurities('RIZ7')

$( function() {
    $( "#left_col" ).resizable();
  } );

function indicatorPaste(dats) {
	dats.message.forEach(function(d) {
	var coda = d.SECCODE
	if (coda.slice(0,2) == seccode) {
		var net_pos = d.TOTAL_NET
		if (d3.select('#'+coda+'_pos_indicator')["_groups"][0][0] == null) {
			var tipo = d.TYPE 
			var brovah = d3.select('#'+coda+'_last')["_groups"][0][0].parentElement
			if (tipo == 'Call') {
				var pos_indicator = d3.select(brovah).select('.strike')
				var classy = 'pos_indicator_call'
			} else {
				var pos_indicator = d3.select(brovah).select('.volatility')
				var classy = 'pos_indicator_put'
			}
			console.log('about to pip')
			var pip = pos_indicator.append('div')
						.attr('id',coda+'_pos_indicator')
						.attr('class',classy).text(net_pos)
			console.log('pipped!')
		} else {
			d3.select('#'+coda+'_pos_indicator').text(net_pos)
		}		
	} else {
		console.log(d.SECCODE, 'not today')
	} 
	

	})
}



function runtheGreek(code) {

	var option_base = mona[code+" [SPBOPT]"].option_base
	var stockprice = Number($('#'+option_base+'_last')[0].innerText)

	var c_or_p = margins[code].optiontype
	var sec = mona[code+" [SPBOPT]"]
	var vol = sec.volatility/100
	var price_step = 10
	var price_step_price = margins[code].pstepval
	var oy = 365
	c_or_p = c_or_p.toLocaleUpperCase()
	var theo = BlackScholes(c_or_p,stockprice,sec.strike,sec.time_to_maturity/oy,r_rate,vol)
	theo = Math.ceil(theo / 10) * 10
	var delta = BSM_delta2(c_or_p,stockprice,sec.strike,0,sec.time_to_maturity/oy,r_rate,vol)
	var gamma = BSM_gamma(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	gamma = gamma * 100

	var theta = BSM_theta(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	theters = theta/price_step/price_step_price * global_margin
	var vega = BSM_vega(stockprice, sec.strike, 0, sec.time_to_maturity/oy, r_rate,vol)
	vega = vega/price_step/price_step_price
	vega =  Math.ceil(vega / 10) * 10
	// console.log(code)
	// console.log('Theo:',theo)
	// console.log('Delta:',delta)
	// console.log('gamma:',gamma)
	// console.log('vega:',vega)
	// console.log('theters:',theters)
	return {'code':code,'c_or_p':c_or_p,'theo':theo,'delta':delta,'gamma':gamma,'vega':vega,'theta':theters}
}



function updateMalls() {
	codeposher.forEach(function(d) {
		$('#'+d+'_updateButt').click()
	})
}

