console.log('order worker is here')
csbf = d3.select('#orders')
	.append('form')
	.attr('action','')
	.attr('id','confirmsendform')
//csbf.append('input').attr('type','text').attr('required',true)
slct = csbf.append('select').attr('name','chooseacc').attr('id','chooseacc').attr('required',true)
accus.forEach(function(d){d3.select('#chooseacc').append('option').attr('value',d.NAME).text(d.NAME)})
csba = csbf.append('input')
	.attr('type','submit')
	.attr('value','submit')
	.attr('id','confirmsendbutton')
//	.attr('onclick','confirmSend()')
	.text('Confirm Send')

$('#confirmsendform').on('submit', function () {
    var sut = $(this).serialize()
    confirmSend(sut);
    return false;
});


cuser_firm = 'jbt1'

function confirmSend(chunga) {
window.chunga = chunga
$('#alertwindow').toggle()
formi = d3.select('#formita').append('table').attr('id','ultimate')
awt = formi.append('table')
var awtr = awt.append('tr')

awtr.append('input').attr('value','Code').attr('style','width:100px')
awtr.append('input').attr('value','Side').attr('style','width:40px')
awtr.append('input').attr('value','Qty').attr('style','width:40px')
awtr.append('input').attr('value','Price')
awtr.append('input').attr('value','Value')
awtr.append('input').attr('value','Margin')
odahs = d3.select('#order_tbody').selectAll('tr')["_groups"][0]
odahs.forEach(function(d) {
	console.log(d)
	var qty = Number(d3.select(d).select('.qty_input')["_groups"][0][0].value)
	var price = Number(d3.select(d).select('.order_side_price')["_groups"][0][0].innerText)
	var side = d3.select(d).select('.order_side_val')["_groups"][0][0].innerText
	var code = d.id.split('_')[0]
	var pstepval = margins[code].pstepval
	var val = price * qty * pstepval / 10

	if (side == 'Buy') {var mg = margins[code].buydepo}
	if (side == 'Sell') {var mg = margins[code].bgonp}
	mg = mg * qty
	// if (side == 'Sell') {var mg = margins[code].bgop}
	var otype = margins[code].optiontype
	var trading_status = margins[code].tradingstatus


	var awtr = awt.append('tr')
	var now = new Date()
	awtr.append('input').attr('name','FIRM').attr('hidden',true).attr('value',cuser)
	awtr.append('input').attr('name','ACCOUNT').attr('hidden',true).attr('value',cuser_firm)
	awtr.append('input').attr('name','STATUS').attr('hidden',true).attr('value',trading_status)
	awtr.append('input').attr('name','ORDERTIME').attr('hidden',true).attr('value',now)
	awtr.append('input').attr('name','PERIOD').attr('hidden',true).attr('value',now)
	awtr.append('input').attr('name','BALANCE').attr('hidden',true).attr('value',0)
	awtr.append('input').attr('name','VISIBLE_QTY').attr('hidden',true).attr('value',0)
	awtr.append('input').attr('name','SECNAME').attr('readonly','readonly').attr('value',code).attr('style','width:100px')
	awtr.append('input').attr('name','BUYSELL').attr('readonly','readonly').attr('value',side).attr('style','width:40px')
	awtr.append('input').attr('name','QTY').attr('readonly','readonly').attr('value',qty).attr('style','width:40px')
	awtr.append('input').attr('name','PRICE').attr('readonly','readonly').attr('value',price)
	awtr.append('input').attr('name','VALUE').attr('readonly','readonly').attr('value',val.toFixed(2))
	awtr.append('input').attr('name','MARGIN').attr('readonly','readonly').attr('value',mg)
})
sway = d3.select('#formita').append('input').attr('type','submit').attr('value','Sway').attr('id','sway')
bye = d3.select('#formita').append('button').attr('onclick','cancelConfirm()').attr('type','button').text('BYE').attr('id','bye')


}


$('#formita').submit(function(e){
	$('#alertwindow').toggle()
    $.post('/dex/ordercomm/', $(this).serialize(),function(data){
      console.log(data)
      window.magi = JSON.parse(data)
      confirmationTable()
    });
    e.preventDefault();
});

// $('#alertwindow').toggle()


function cancelConfirm() {
	d3.select('#ultimate').remove()
	d3.select('#sway').remove()
	d3.select('#bye').remove()
	$('#alertwindow').toggle()
}

function confirmationTable() {
	d3.select('#ultimate').remove()
	d3.select('#sway').remove()
	d3.select('#bye').remove()
	$('#alertwindow').toggle()
	var table = d3.select('#formita').append('table').attr('id','confirmationtable')
	var row = table.append('tr')
	row.append('td').text('Order Confirmation ID')
	row.append('td').text('CODE')
	row.append('td').text('QTY')
	row.append('td').text('PRICE')
	row.append('td').text('SIDE')
	magi.message.legs.forEach(function(d) {
		var row = table.append('tr')
		row.append('td').text(d.id)
		row.append('td').text(d.SECNAME)
		row.append('td').text(d.QTY)
		row.append('td').text(d.PRICE)
		row.append('td').text(d.BUYSELL)
	})
	table.append('button').attr('type','button').attr('onclick','byeBye()').text('BYE')
	

}

function byeBye() {
	document.getElementById("yf").click();
	d3.select('#confirmationtable').remove()
	$('#alertwindow').toggle()
	clearOrderTable()
}

function clearOrderTable() {
	var rems = d3.select('#order_tbody').selectAll('.removedor')["_groups"][0]
	rems.forEach(function(d){
		remove_order(d)
	})
	console.log('cleared order table')
}

function hideMyKids(titl) {
	window.titl = titl
	var tn = titl.nextElementSibling 
	
	if ($(tn).hasClass("tini")) {
		var h = $(tn).attr('value')
		d3.select(tn).attr('style','height:'+h+'px')
		$(tn).removeClass('tini')
		// setTimeout(function(){ ;d3.select(tn).attr('style','transition:1s') }, 1000);
	} else {
		var h = $(tn).height()
		console.log('h is',h)

		d3.select(tn).attr('style',';height:'+h+'px;')
		
		d3.select(tn).attr('value',h)
		d3.select(tn).attr('style','height:0px;transition:1s')
		if ($(tn).hasClass("smoked")) {} else {$(tn).addClass("smoked")}
		
		$(tn).addClass('tini')
	}
}



var tablusa
function miramax(dats) {

	var entries3 = d3.nest()
	    .key(function(d) { return d.SEC_UNDERLYING; })
	    .key(function(d) { return d.SEC_EXPIRY_DATE; })
	    .key(function(d) { return d.ORDERGROUP; })
	    .entries(dats.message);
	if (tablusa) {tablusa.remove()}
	tablusa = d3.select('#mid_pane_accounts').append('table').attr('id','tiesto')
	headz = tablusa.append('tr').append('tr').append('tr').append('tr').append('tr')
	headz.append('th').attr('class','smoke_smoke').text("____________________")
	headz.append('th').attr('class','smoke_code').text("CODE")
	headz.append('th').attr('class','smoke_strike').text("STRIKE")
	headz.append('th').attr('class','smoke_type').text("TYPE")
	headz.append('th').attr('class','smoke_total_net').text("NP")
	headz.append('th').attr('class','smoke_avsonprice').text("APR")
    headz.append('th').attr('class','smoke_avsonprice').text("P")
	headz.append('th').attr('class','smoke_varmargin').text("ViC")
	headz.append('th').attr('class','smoke_varmargin').text("VM")

	headz.append('th').attr('class','smoke_delta').text("D")
	headz.append('th').attr('class','smoke_vega').text("V")
	headz.append('th').attr('class','smoke_gamma').text("G")
	headz.append('th').attr('class','smoke_theta').text("Th")
	entries3.forEach(function(d) {
		// console.log("UNDERLYING IS",d.key)
		tr1 = tablusa.append('tr')
		tr1.append('tr').attr('onclick','hideMyKids(this)').text(d.key)
		tr1 = tr1.append('tr')
		d.values.forEach(function(e) {
			// console.log("______expiration",e.key)
			tr2 = tr1.append('tr').attr('class','smoky')
			tr2.append('tr').attr('onclick','hideMyKids(this)').text("_____"+e.key.slice(0,10))
			tr2 = tr2.append('tr')
			e.values.forEach(function(f) {
				// console.log("_____________",f.key)
				tr3 = tr2.append('tr').attr('class','smoky')
				tr3.append('tr').attr('onclick','hideMyKids(this)').text("__________"+f.key)
				tr3 = tr3.append('tr')
				f.values.forEach(function(g){
					// console.log("__________________________",
					// 	g.SEC_SHORT_NAME,
					// 	g.STRIKE,
					// 	g.TYPE,
					// 	g.TOTAL_NET,
					// 	g.AVRPOSNPRICE,
					// 	g.VARMARGIN
					// 	)
					tr4 = tr3.append('tr').attr('class','smoky')
					var code = g.SEC_SHORT_NAME
					var tot_net = Number(g.TOTAL_NET)
					tr4.append('td').attr('class','smoke_smoke').text("____________________")
					tr4.append('td').attr('class','smoke_code' ).text(code)
					tr4.append('td').attr('class','smoke_strike').text(g.STRIKE)
					tr4.append('td').attr('class','smoke_type').text(g.TYPE)
					tr4.append('td').attr('class','smoke_total_net').text(tot_net)
					var num = g.AVRPOSNPRICE
					if (num % 1 != 0) { num = num.toFixed(2) }
					tr4.append('td').attr('class','smoke_avsonprice').text(num)
					if (tot_net > 0) {var bid_or_ask = 'bid'; var z = -1} else {var bid_or_ask = 'ask';var z = 1}
					var price_to_close = $('#'+code+'_'+bid_or_ask)[0].innerHTML
					tr4.append('td').attr('class','smoke_avsonprice').attr('id',code+'_position').text(price_to_close)
					var vm_if_close = (num - price_to_close) * z * margins[code].pstepval 
					tr4.append('td').attr('class','smoke_varmargin').text(vm_if_close)
					tr4.append('td').attr('class','smoke_varmargin').text(g.VARMARGIN)
					var gk = runtheGreek(code)
					var d = gk['delta'].toFixed(2) * tot_net
					var v = gk['vega'] * tot_net
					var g = gk['gamma'].toFixed(3) * tot_net
					var t = gk['theta'].toFixed() * tot_net
					tr4.append('td').attr('class','smoke_delta').text(d)
					tr4.append('td').attr('class','smoke_vega').text(v)
					tr4.append('td').attr('class','smoke_gamma').text(g)
					tr4.append('td').attr('class','smoke_theta').text(t)
				})
			})
		})
	})

indicatorPaste(dats)

}

function updateMe(sec) {
	console.log('eh')
	window.eh = sec
	var code = eh.id.split("_")[0]
	var position = Number($('#'+code+'_totnet')[0].innerText)
	if (position > 0) {
		var price = mona[code+" [SPBOPT]"].bid
	} else {
		var price = mona[code+" [SPBOPT]"].ask
	}
	var theor_price = mona[code+" [SPBOPT]"].theor_price

	$('#'+code+'_position')[0].innerText = price
	
}



function miramaxW(dats) {

	var entries3 = d3.nest()
	    .key(function(d) { return d.SEC_UNDERLYING; })
	    .key(function(d) { return d.SEC_EXPIRY_DATE; })
	    .entries(dats.message);
	if (tablusa) {tablusa.remove()}
	tablusa = d3.select('#mid_pane_accounts').append('table').attr('id','tiesto')
	headz = tablusa.append('tr').append('tr').append('tr').append('tr').append('tr')
	headz.append('th').attr('class','smoke_smoke').text("____________________")
	headz.append('th').attr('class','smoke_code').text("CODE")
	headz.append('th').attr('class','smoke_strike').text("STRIKE")
	headz.append('th').attr('class','smoke_type').text("TYPE")
	headz.append('th').attr('class','smoke_total_net').text("NP")
	headz.append('th').attr('class','smoke_avsonprice').text("APR")
    headz.append('th').attr('class','smoke_avsonprice').text("P")
	headz.append('th').attr('class','smoke_varmargin').text("ViC")
	headz.append('th').attr('class','smoke_varmargin').text("VM")

	headz.append('th').attr('class','smoke_delta').text("D")
	headz.append('th').attr('class','smoke_vega').text("V")
	headz.append('th').attr('class','smoke_gamma').text("G")
	headz.append('th').attr('class','smoke_theta').text("Th")
	entries3.forEach(function(d) {
		console.log("UNDERLYING IS",d.key)
		tr1 = tablusa.append('tr')
		tr1.append('tr').attr('onclick','hideMyKids(this)').text(d.key)
		tr1 = tr1.append('tr')
		d.values.forEach(function(e) {
			console.log("______expiration",e.key)
			tr2 = tr1.append('tr').attr('class','smoky')
			tr2.append('tr').attr('onclick','hideMyKids(this)').text("_____"+e.key.slice(0,10))
			tr2 = tr2.append('tr')
			
				e.values.forEach(function(g){
					window.icho = g
					console.log("__________________________",
						g.SEC_SHORT_NAME)
					// 	g.STRIKE,
					// 	g.TYPE,
					// 	g.TOTAL_NET,
					// 	g.AVRPOSNPRICE,
					// 	g.VARMARGIN
					// 	)
					tr4 = tr2.append('tr').attr('class','smoky')
					var code = g.SEC_SHORT_NAME
					var tot_net = Number(g.TOTAL_NET)
					tr4.append('td').attr('class','smoke_smoke').text("____________________")
					tr4.append('td').attr('class','smoke_code' ).text(code)
					tr4.append('td').attr('class','smoke_strike').text(g.STRIKE)
					tr4.append('td').attr('class','smoke_type').text(g.TYPE)
					tr4.append('td').attr('class','smoke_total_net').attr('id',code+'_totnet').text(tot_net)
					var num = g.AVRPOSNPRICE
					if (num % 1 != 0) { num = num.toFixed(2) }
					tr4.append('td').attr('class','smoke_avsonprice').text(num)
					if (tot_net > 0) {var bid_or_ask = 'bid'; var z = -1} else {var bid_or_ask = 'ask';var z = 1}
					var price_to_close = $('#'+code+'_'+bid_or_ask)[0].innerHTML
					tr4.append('td').attr('class','smoke_avsonprice').attr('id',code+'_position').text(price_to_close)
					var vm_if_close = (num - price_to_close) * z * margins[code].pstepval 
					tr4.append('td').attr('class','smoke_varmargin').text(vm_if_close)
					tr4.append('td').attr('class','smoke_varmargin').text(g.VARMARGIN)
					var gk = runtheGreek(code)
					var d = gk['delta'].toFixed(2) * tot_net
					var v = gk['vega'] * tot_net
					var g = gk['gamma'].toFixed(3) * tot_net
					var t = gk['theta'].toFixed() * tot_net
					tr4.append('td').attr('class','smoke_delta').text(d)
					tr4.append('td').attr('class','smoke_vega').text(v)
					tr4.append('td').attr('class','smoke_gamma').text(g)
					tr4.append('td').attr('class','smoke_theta').text(t)
					tr4.append('button').attr('id',code+'_updateButt').attr('onclick','updateMe(this)').attr('hidden',true)
				})
			
		})
	})

indicatorPaste(dats)
window.codeposher = dats.message.map(function(d) {return d.SEC_SHORT_NAME})
}


$('#refreshpos').submit(function(e){

    $.post('/dex/refreshpos/', $(this).serialize(),function(data){
      console.log('YESO')
      window.posh = JSON.parse(data)
      miramaxW(posh)
    });
e.preventDefault();
    
});
// document.getElementById("yf").click();


var target = document.getElementById('order_tbody');
d3.select('#confirmsendbutton').attr('disabled',true)
var observer = new MutationObserver(function(mutations) {
  console.log('Mutated')
  var boch = d3.select('#order_tbody')["_groups"][0][0].children[0]
  if (boch) {
        console.log('yes boch')
        // $('#confirmsendform').show()
        d3.select('#confirmsendbutton').attr('disabled',null)
        // d3.select('#chooseacc').attr('disabled',null)
  } else {
        console.log('koko')
        d3.select('#confirmsendbutton').attr('disabled',true)
        d3.select('#chooseacc').attr('disabled',true)
        // $('#confirmsendform').hide()
  }
  // mutations.forEach(function(mutation) {
  //   console.log(mutation.type);
  // });    
});
// configuration of the observer:
var config = { childList: true, characterData: true };
// pass in the target node, as well as the observer options
observer.observe(target, config);
// later, you can stop observing
// observer.disconnect();


console.log('order worker is done')
