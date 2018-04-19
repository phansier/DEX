console.log('LOADING....')
//window.futures = {% autoescape off %}{{ table_data }}{% endautoescape %};
window.futures = {{futures|safe}}
var T1 = new Date();
times['futuresloaded'] = T1
window.all_orderos = {{all_orderos|safe}}
window.accus = {{accus|safe}}
window.account = {{account|safe}}
window.mona = {{mona|safe}};
var T1 = new Date();
times['accus_account_mona'] = T1
window.margins = {{margins|safe}};
var T1 = new Date();
times['margins'] = T1
window.snap1 = {{snap1|safe}};
window.snap2 = {{snap2|safe}};
window.rts_min = {{rts_min|safe}};
window.rvi_min = {{rvi_min|safe}};
window.cuser = "{{cuser}}";
window.bal = {{bal|safe}};
window.tokyo = "{{ csrf_token }}";
var stockprice;
window.volterms = {{volterms|safe}};
var juw = d3.entries(snap2)
console.log('LOADED....')
