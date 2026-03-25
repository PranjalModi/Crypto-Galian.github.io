function app(){
 return {
 page:'landing', section:'dashboard',
 usd:0, inr:0, pending:0,
 amount:0, withdrawAmt:0,
 txs:[], withdrawals:[],

 coin:'usdt',
 withdrawType:'inr',

 wallets:{
  usdt:"TQ6zXEEuZrFcSHWdhJt5a1Hi4p9qoBibTd",
  btc:"bc1pjxpdrsvhu6whk5hjtn7szm7ppkshfhtu8k8q57tv98mg8aj0haus0ml3cu",
  eth:"0x9b0aABC8d24a068F3797e44aE47EdA474cADA346",
  sol:"9nrbnqURHK75YFALxG23Kfrv4yEJgHySwzKCLdCmCCEs",
  trx:"TQ6zXEEuZrFcSHWdhJt5a1Hi4p9qoBibTd"
 },

 rates:{
  usdt:83,
  btc:0,
  eth:0,
  sol:0,
  trx:0
 },

 tab(s){ return this.section===s?'active-tab block':'block'; },

 submit(){
  if(this.amount<500) return alert('Minimum $500');
  this.pending++;
  this.txs.push({amount:this.amount, coin:this.coin.toUpperCase(), status:'pending'});
 },

 approveTx(i){
  const tx = this.txs[i];
  if(!tx || tx.status==='approved') return;

  this.usd += tx.amount;
  this.inr += tx.amount * this.rates[tx.coin.toLowerCase()];

  tx.status = 'approved';
  this.pending--;
 },

 withdraw(){
  const minUSD = 500;
  const minINR = 500 * 83;

  if(this.withdrawType==='inr'){
    if(this.withdrawAmt < minINR) return alert('Minimum ₹' + minINR);
    if(this.withdrawAmt > this.inr) return alert('Insufficient balance');

    this.inr -= this.withdrawAmt;
  } else {
    if(this.withdrawAmt < minUSD) return alert('Minimum $500');
    if(this.withdrawAmt > this.usd) return alert('Insufficient balance');

    this.usd -= this.withdrawAmt;
  }

  this.withdrawals.push(this.withdrawAmt);
 },

 async fetchPrices(){
  try{
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tron,tether&vs_currencies=inr');
    const data = await res.json();

    this.rates.btc = data.bitcoin.inr;
    this.rates.eth = data.ethereum.inr;
    this.rates.sol = data.solana.inr;
    this.rates.trx = data.tron.inr;
    this.rates.usdt = data.tether.inr;
  }catch(e){
    console.log('Price fetch error', e);
  }
 },

 init(){
  this.fetchPrices();
  setInterval(()=>this.fetchPrices(), 10000);
 },

 logout(){ this.page='landing'; }
 }
}
