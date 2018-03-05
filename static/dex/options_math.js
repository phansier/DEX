console.log('im here! optionsmath.js')

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




