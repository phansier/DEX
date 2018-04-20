console.log('worker page 2 is here')


emin = d3.entries(rts_min)
function devo(data,accessor,window) {
	data = data.slice(data.length-window,data.length)
	return d3.deviation(data, function(d) {return d.value[accessor]})

}
dshrow = dashboard.append('div').attr('class','row').attr('id','rowy')
dashc1 = dshrow.append('div').attr('class','col-3')
dashc2 = dshrow.append('div').attr('class','col-9').attr('id','chartyboy').attr('style','height:250px')
vt = dashc1.append('table').attr('id','volatility_table')
r1 = vt.append('tr')
r1.append('td').attr('id','std_days_value').attr('class','vol_indicator')
r1.append('td').append('input').attr('id','std_days').attr('class','qty_input').attr('type','number').attr('value',360).attr('onchange','devot(this.value)')
r1.append('td').text('day Vol.')
// Standard deviation of annual log returns

function devot(days) {
	var numd = days
	var std = devo(emin,'returns',numd) * Math.sqrt(365)
	std = std * 100
	d3.select('#std_days_value').text(std.toFixed(2))

}
devot(30)



var rea_var = emin.slice(emin.length-1,emin.length)[0].value.rea_var
var rea_vol = emin.slice(emin.length-1,emin.length)[0].value.rea_vol



//evol = d3.entries(rvi_min)
//var rvi_pc = evol.slice(evol.length - 1,evol.length)[0].value.close
//r2 = vt.append('tr')
//r2.append('td').attr('id','rvi_pc').attr('value',rvi_pc).attr('class','vol_indicator').text(rvi_pc)
//r2.append('td')
//r2.append('td').text('RVI')


function devotRank(data,window) {
	data = data.slice(data.length - window, data.length)
	var max = d3.max(data,function(d) {return d.value.close})
	var min = d3.min(data,function(d) {return d.value.close})
	var last = data.slice(data.length - 1, data.length)[0].value.close
	var range = max - min 
	var rank = (last - min) / range
	console.log('rank ' + rank)
	var pcts = data.filter(function(d) {if (d.value.close < last){return d}})
	var pct = pcts.length / data.length
	console.log('Pctle ' + pct)
	return [rank,pct]

}
//rp = devotRank(evol,360)

function rankot(days) {
	var numd = days
	rp = devotRank(evol,numd)
	rank = rp[0] * 100
	percentile = rp[1] * 100
	d3.select('#rank_days_value').text(rank.toFixed(2))
	d3.select('#percentile_days_value').text(percentile.toFixed(2))
}


r3 = vt.append('tr')
r3.append('td').attr('id','rank_days_value').attr('class','vol_indicator')
r3.append('td').append('input').attr('id','rank_days').attr('class','qty_input').attr('type','number').attr('value',360).attr('onchange','rankot(this.value)')
r3.append('td').text(' day IVR')

r4 = vt.append('tr')
r4.append('td').attr('id','percentile_days_value').attr('class','vol_indicator')
r4.append('td')
r4.append('td').text(' day IV %')

//rankot(30)



// Some COMMANDS
shrinkToggle(d3.select('#orders_title')["_groups"][0][0])
$('#rowy').toggle()
d3.select('body').selectAll('.expiration_head_col')["_groups"][0].forEach(function(d) {close_body(d)})

var dur = d3.select('body').selectAll('.expiration_head_col')["_groups"][0]
dur[dur.length-1]
d3.select(dur[dur.length-1]).attr('id','lastexp')
wid = d3.select('#lastexp').append('div').attr('id','widener').attr('style','width:840px;borders:0,')
window.flashactive = true
//END of COMMANDS



formol = d3.select('#add_trade_account')
formol.append('label').text('NAME')
formol.append('input')
	.attr('type','text')
	.attr('name','NAME')
	.attr('required',true)
formol.append('input')
	.attr('readonly','readonly')
	.attr('name','CBPLIMIT')
	.attr('value',100000)
formol.append('input')
	.attr('readonly','readonly')
	.attr('hidden',true)
	.attr('name','FIRMID')
	.attr('value',cuser)
formol.append('input')
	.attr('type','submit')
	.attr('value','Go')
$('#add_trade_account').toggle()

$('#add_trade_account').submit(function(e){
    $.post('/dex/formol/', $(this).serialize(),function(data){
      // console.log(data)
      window.accus = JSON.parse(data)
      loadUserAccounts('added')
    });
    e.preventDefault();
});
d3.select('#menubar').append('div').attr('id','account_list')
var al = d3.select('#account_list')
al.append('h6').attr('onclick','togta()').text('Add Acount')
var tl = al.append('table')
accus.forEach(function(d) {
	tlr = tl.append('tr')
	tlr.append('td').attr('value',d.NAME).text(d.NAME)
	tlr.append('td').attr('value',d.CBPLIMIT).text(d.CBPLIMIT)
})

d3.select('#account_list')["_groups"][0][0].style.height = '0px'

function toggleAccountList() {
	var mu = d3.select('#account_list')["_groups"][0][0].style.height
	if (mu == '0px') {
		d3.select('#account_list')["_groups"][0][0].style.height = '250px'
	} else {
		d3.select('#account_list')["_groups"][0][0].style.height = '0px'
	} 
}





function loadUserAccounts(key) {
	if (key == 'added') {
//		$('#add_trade_account').toggle()
		$('#alerttradeaccount').toggle()
		console.log('i should print just once')
	}
	var al = d3.select('#account_list')
	if (al) {
		al.remove()
		al = d3.select('#menubar').append('div').attr('id','account_list')
	} else {
		al = d3.select('#menubar').append('div').attr('id','account_list')
	}
	
	var tl = al.append('table')
	accus["accounts"].forEach(function(d) {
		tlr = tl.append('tr')
		tlr.append('td').attr('value',d.NAME).text(d.NAME)
		tlr.append('td').attr('value',d.CBPLIMIT).text(d.CBPLIMIT)
	})
	al.append('h6').attr('onclick','togta()').text('Add Account')
    
}

function togta() {
//	$('#add_trade_account').toggle()
	$('#alerttradeaccount').toggle()
}




//SCREEN PULL OUT
$('#alerttradeaccount').toggle()
$('#add_trade_account').toggle()
$('#alertwindow').toggle()
function closeScreen() {
    document.getElementById("introscreen").style.width = "0";
}
closeScreen()


function toggleAccountPage() {
	$('#mid_pane_header').toggle()
	$('#mid_pane_table').toggle()
	$('#mid_pane_accounts').toggle()
}


